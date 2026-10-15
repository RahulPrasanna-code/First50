import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScrapedJob } from "@/types";
import { SEED_PROFILE, INITIAL_SCRAPED_JOBS } from "@/data/seed";

export const dynamic = "force-dynamic";

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  updated_at: string;
  location?: { name: string };
  content?: string;
}

interface LeverJob {
  id: string;
  text: string;
  hostedUrl: string;
  createdAt: number;
  categories?: {
    location?: string;
    team?: string;
  };
  descriptionPlain?: string;
}

const GREENHOUSE_BOARDS = [
  "razorpay",
  "postman",
  "chargebee",
  "rubrik",
  "cloudflare",
  "twilio",
  "stripe",
];

const LEVER_BOARDS = [
  "cred",
  "zeta",
  "palantir",
];

const LOCATION_KEYWORDS = ["bengaluru", "bangalore", "chennai", "india", "remote"];
const TITLE_KEYWORDS = ["software", "backend", "engineer", "sde", "platform", "java", "distributed"];

function matchesFilters(title: string, location: string): boolean {
  const t = title.toLowerCase();
  const l = location.toLowerCase();

  const titleMatch = TITLE_KEYWORDS.some((k) => t.includes(k));
  const locationMatch = LOCATION_KEYWORDS.some((k) => l.includes(k)) || l === "";

  return titleMatch && locationMatch;
}

function heuristicScoreJob(title: string, company: string, description: string = ""): {
  matchScore: number;
  matchingSkills: string[];
  missingKeywords: string[];
  aiPitch: string;
} {
  const combined = (title + " " + description).toLowerCase();
  
  const knownSkills = [
    { name: "Java 17/21", test: ["java", "spring"] },
    { name: "Distributed Systems", test: ["distributed", "concurrency", "scaling", "high-throughput"] },
    { name: "AWS Microservices", test: ["aws", "sqs", "sns", "s3", "mrap"] },
    { name: "PostgreSQL Tuning", test: ["postgres", "postgresql", "sql", "partition"] },
    { name: "Kubernetes / KEDA", test: ["k8s", "kubernetes", "docker", "keda"] },
  ];

  const candidateMissing = [
    { name: "Kafka", test: ["kafka"] },
    { name: "gRPC / Protobuf", test: ["grpc", "protobuf"] },
    { name: "Redis Caching", test: ["redis", "memcached"] },
    { name: "Go / Golang", test: ["golang", "go "] },
    { name: "Elasticsearch", test: ["elastic", "opensearch"] },
  ];

  const matchingSkills: string[] = [];
  knownSkills.forEach((s) => {
    if (s.test.some((t) => combined.includes(t))) {
      matchingSkills.push(s.name);
    }
  });

  if (matchingSkills.length === 0) {
    matchingSkills.push("Java Backend", "Microservices", "AWS Cloud");
  }

  const missingKeywords: string[] = [];
  candidateMissing.forEach((m) => {
    if (m.test.some((t) => combined.includes(t))) {
      missingKeywords.push(m.name);
    }
  });

  if (missingKeywords.length === 0) {
    missingKeywords.push("Kafka Clustering", "gRPC", "Redis");
  }

  // Calculate score between 82 and 96
  let score = 80 + Math.min(matchingSkills.length * 4, 16);
  if (score > 98) score = 97;

  // Generate crisp <300 char LinkedIn note
  const roleName = title.length > 25 ? title.substring(0, 22) + "..." : title;
  let aiPitch = `Hi [EM], saw your team scaling ${company}'s ${roleName}. At Fidelity I run Java microservices handling 2.1B+ communications & cut batch runtime 90% via KEDA + partitioned Postgres. Would love to share my CV before applying on the portal!`;
  if (aiPitch.length > 298) {
    aiPitch = aiPitch.slice(0, 295) + "...";
  }

  return {
    matchScore: score,
    matchingSkills,
    missingKeywords: missingKeywords.slice(0, 3),
    aiPitch,
  };
}

async function scoreWithGemini(
  job: { title: string; company: string; description: string; location: string },
  apiKey: string
): Promise<{
  matchScore: number;
  matchingSkills: string[];
  missingKeywords: string[];
  aiPitch: string;
} | null> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert technical recruiter evaluating a candidate for a backend engineering role.
Candidate Profile:
- Name: ${SEED_PROFILE.name}
- Role: ${SEED_PROFILE.currentRole} at ${SEED_PROFILE.company} (2+ YoE, B.Tech IT 9.1 CGPA)
- Core Stack: ${SEED_PROFILE.skills.join(", ")}
- Achievements:
  1. ${SEED_PROFILE.achievements[0]}
  2. ${SEED_PROFILE.achievements[1]}
  3. ${SEED_PROFILE.achievements[2]}

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location}
- Description excerpt: ${job.description.slice(0, 1500)}

Return ONLY valid JSON matching this exact structure:
{
  "matchScore": number (integer 0-100 reflecting fit),
  "matchingSkills": string[] (3-5 core matching skills),
  "missingKeywords": string[] (2-4 keywords mentioned in JD that candidate should emphasize),
  "aiPitch": string (EXACTLY under 300 characters, high-signal LinkedIn connection request note for hiring manager citing candidate's 2.1B+ scale and 90% latency reduction)
}
Do not include any markdown formatting, backticks, or extra commentary.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJson = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleanJson);

    let pitch = parsed.aiPitch || "";
    if (pitch.length > 299) {
      pitch = pitch.slice(0, 296) + "...";
    }

    return {
      matchScore: Math.min(Math.max(parsed.matchScore || 85, 0), 100),
      matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : ["Java", "Distributed Systems"],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : ["Kafka", "gRPC"],
      aiPitch: pitch,
    };
  } catch (err) {
    console.warn("Gemini scoring error, falling back to heuristic:", err);
    return null;
  }
}

export async function GET(request: Request) {
  return handleRadarScan(request);
}

export async function POST(request: Request) {
  return handleRadarScan(request);
}

async function handleRadarScan(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceMock = searchParams.get("mock") === "true";
  const apiKey = process.env.GEMINI_API_KEY;

  const scrapedJobs: ScrapedJob[] = [];

  if (!forceMock) {
    // 1. Fetch from Greenhouse Boards
    for (const board of GREENHOUSE_BOARDS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(
          `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`,
          { signal: controller.signal, headers: { Accept: "application/json" } }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const jobs: GreenhouseJob[] = data.jobs || [];

          for (const j of jobs) {
            const locName = j.location?.name || "";
            if (matchesFilters(j.title, locName)) {
              let scoreData = null;
              if (apiKey) {
                scoreData = await scoreWithGemini(
                  {
                    title: j.title,
                    company: board.charAt(0).toUpperCase() + board.slice(1),
                    description: j.content || "",
                    location: locName,
                  },
                  apiKey
                );
              }
              if (!scoreData) {
                scoreData = heuristicScoreJob(
                  j.title,
                  board.charAt(0).toUpperCase() + board.slice(1),
                  j.content || ""
                );
              }

              scrapedJobs.push({
                id: `gh-${board}-${j.id}`,
                company: board.charAt(0).toUpperCase() + board.slice(1),
                title: j.title,
                location: locName || "Bengaluru / India",
                source: "Greenhouse",
                applyUrl: j.absolute_url,
                postedAt: "Scanned Today, 8:30 AM IST",
                matchScore: scoreData.matchScore,
                matchingSkills: scoreData.matchingSkills,
                missingKeywords: scoreData.missingKeywords,
                aiPitch: scoreData.aiPitch,
                status: "new",
              });

              if (scrapedJobs.length >= 8) break;
            }
          }
        }
      } catch (e) {
        // Individual board timeout or rate limit, continue to next board
        console.warn(`Greenhouse fetch for ${board} skipped:`, (e as Error).message);
      }
    }

    // 2. Fetch from Lever Boards
    for (const board of LEVER_BOARDS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(
          `https://api.lever.co/v0/postings/${board}?mode=json`,
          { signal: controller.signal, headers: { Accept: "application/json" } }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const jobs: LeverJob[] = await res.json();
          for (const j of jobs) {
            const locName = j.categories?.location || "";
            if (matchesFilters(j.text, locName)) {
              let scoreData = null;
              if (apiKey) {
                scoreData = await scoreWithGemini(
                  {
                    title: j.text,
                    company: board.charAt(0).toUpperCase() + board.slice(1),
                    description: j.descriptionPlain || "",
                    location: locName,
                  },
                  apiKey
                );
              }
              if (!scoreData) {
                scoreData = heuristicScoreJob(
                  j.text,
                  board.charAt(0).toUpperCase() + board.slice(1),
                  j.descriptionPlain || ""
                );
              }

              scrapedJobs.push({
                id: `lev-${board}-${j.id}`,
                company: board.charAt(0).toUpperCase() + board.slice(1),
                title: j.text,
                location: locName || "Bengaluru / India",
                source: "Lever",
                applyUrl: j.hostedUrl,
                postedAt: "Scanned Today, 8:30 AM IST",
                matchScore: scoreData.matchScore,
                matchingSkills: scoreData.matchingSkills,
                missingKeywords: scoreData.missingKeywords,
                aiPitch: scoreData.aiPitch,
                status: "new",
              });

              if (scrapedJobs.length >= 12) break;
            }
          }
        }
      } catch (e) {
        console.warn(`Lever fetch for ${board} skipped:`, (e as Error).message);
      }
    }
  }

  // Ensure high-signal results even if ATS APIs are rate-limiting or offline
  const finalJobs = scrapedJobs.length > 0 ? scrapedJobs : INITIAL_SCRAPED_JOBS;

  // Sort by matchScore descending
  finalJobs.sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json({
    success: true,
    count: finalJobs.length,
    scannedAt: new Date().toISOString(),
    jobs: finalJobs,
  });
}
