import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JDAnalysisResult } from "@/types";
import { SEED_PROFILE } from "@/data/seed";

export const dynamic = "force-dynamic";

function heuristicAnalyzeJD(
  jd: string,
  company: string = "Target Company",
  roleTitle: string = "Backend Software Engineer"
): JDAnalysisResult {
  const lower = jd.toLowerCase();

  // 1. YoE Gate Check
  let yoeGatePassed = true;
  let yoeGateDetails = "2+ YoE aligns well with early-career/mid-level criteria.";

  const yoeMatches = jd.match(/(\d+)\+?\s*(-|to)?\s*(\d+)?\s*(years?|yrs?)/gi);
  if (yoeMatches && yoeMatches.length > 0) {
    for (const match of yoeMatches) {
      const numbers = match.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const minYears = parseInt(numbers[0], 10);
        if (minYears > 3 && !match.toLowerCase().includes("preferred")) {
          yoeGatePassed = false;
          yoeGateDetails = `Warning: JD mentions "${match.trim()}". Rahul has 2+ YoE. Position yourself as high-impact SDE with 2.1B+ scale to bypass strict filters.`;
          break;
        } else if (minYears <= 3) {
          yoeGatePassed = true;
          yoeGateDetails = `Passed: Requires ${match.trim()}. Rahul's 2+ YoE at Fidelity is a direct match.`;
          break;
        }
      }
    }
  }

  // 2. Keyword Matching
  const skillsToTest = [
    { name: "Java 17/21", triggers: ["java", "jvm"] },
    { name: "Spring Boot", triggers: ["spring", "springboot"] },
    { name: "Distributed Systems", triggers: ["distributed", "microservices", "concurrency"] },
    { name: "AWS Cloud Infrastructure", triggers: ["aws", "sqs", "sns", "s3", "lambda", "rds", "ec2"] },
    { name: "Kubernetes & Docker", triggers: ["k8s", "kubernetes", "docker", "containers"] },
    { name: "PostgreSQL Optimization", triggers: ["postgres", "postgresql", "sql", "rdbms"] },
    { name: "KEDA / Event Driven", triggers: ["keda", "event-driven", "messaging", "queue"] },
    { name: "REST APIs", triggers: ["rest", "api", "apis"] },
  ];

  const candidateKeywords = [
    { name: "Apache Kafka", triggers: ["kafka"] },
    { name: "Redis Caching", triggers: ["redis", "cache"] },
    { name: "gRPC & Protocol Buffers", triggers: ["grpc", "protobuf"] },
    { name: "Elasticsearch / OpenSearch", triggers: ["elasticsearch", "opensearch", "elk"] },
    { name: "Cassandra / NoSQL", triggers: ["cassandra", "dynamo", "nosql"] },
    { name: "CI/CD & Terraform", triggers: ["terraform", "ci/cd", "jenkins", "github actions"] },
    { name: "System Observability (Datadog)", triggers: ["datadog", "splunk", "prometheus", "grafana"] },
  ];

  const matchingHighlights: string[] = [];
  skillsToTest.forEach((s) => {
    if (s.triggers.some((t) => lower.includes(t))) {
      matchingHighlights.push(s.name);
    }
  });
  if (matchingHighlights.length === 0) {
    matchingHighlights.push("Core Java / Microservices", "AWS Cloud Services", "High-Throughput Batch Processing");
  }

  const missingKeywords: string[] = [];
  candidateKeywords.forEach((k) => {
    if (k.triggers.some((t) => lower.includes(t)) && !matchingHighlights.includes(k.name)) {
      missingKeywords.push(k.name);
    }
  });
  if (missingKeywords.length === 0) {
    missingKeywords.push("Apache Kafka", "gRPC Architecture", "Redis Caching");
  }

  // 3. Fit score
  let fitScore = 78 + Math.min(matchingHighlights.length * 3, 16);
  if (!yoeGatePassed) fitScore = Math.max(fitScore - 12, 68);

  // 4. LinkedIn Pitch (<300 chars)
  let linkedinPitch = `Hi [Name], saw your team scaling ${company}'s ${roleTitle}. At Fidelity I run Java microservices handling 2.1B+ communications & cut batch latency 90% via KEDA + partitioned Postgres. Would love to share my CV before applying on the portal!`;
  if (linkedinPitch.length > 298) {
    linkedinPitch = linkedinPitch.slice(0, 295) + "...";
  }

  // 5. Cold Email (~120 words)
  const coldEmail = `Subject: SDE Application - ${roleTitle} (${SEED_PROFILE.name} - 2.1B+ Scale Java/AWS)

Hi [Hiring Manager / Team Lead],

I noticed your team is actively building out ${company}'s ${roleTitle} platform. Given your focus on resilient backend systems, I wanted to reach out directly.

Currently at Fidelity Investments India, I engineer cloud-native Java 17/21 microservices powering our Communications Orchestration Platform—processing over 2.1B+ annual communications. Recently, I:
• Cut batch processing runtime by 90% (to <2h) using a parallelized K8s orchestrator-worker model.
• Reduced PostgreSQL insert times by 67% on 15M+ monthly statements via table partitioning and GIN index tuning.
• Eliminated SQS data loss during KEDA auto-scaling with graceful SIGTERM termination.

With a B.Tech in IT (9.1 CGPA) and 2+ years hands-on production engineering, I would love to explore how my experience aligns with your team's goals. Attached is my resume for review.

Best regards,
${SEED_PROFILE.name}
${SEED_PROFILE.email} | Bengaluru / Chennai`;

  return {
    fitScore,
    yoeGatePassed,
    yoeGateDetails,
    matchingHighlights,
    missingKeywords: missingKeywords.slice(0, 4),
    linkedinPitch,
    coldEmail,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDescription, company = "Target Company", roleTitle = "Backend Software Engineer" } = body;

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid Job Description to analyze." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

        const prompt = `
You are a Staff Technical Recruiter and Engineering Career Coach.
Analyze the following Job Description against candidate Rahul Prasanna T S:

Candidate Background:
- Name: ${SEED_PROFILE.name}
- Current Role: ${SEED_PROFILE.currentRole} at ${SEED_PROFILE.company}
- Total Experience: ${SEED_PROFILE.totalExperience}
- Education: ${SEED_PROFILE.education}
- Target Compensation: ${SEED_PROFILE.targetCompensation}
- Tech Stack: ${SEED_PROFILE.skills.join(", ")}
- Quantified Achievements:
  1. ${SEED_PROFILE.achievements[0]}
  2. ${SEED_PROFILE.achievements[1]}
  3. ${SEED_PROFILE.achievements[2]}
  4. ${SEED_PROFILE.achievements[3]}
  5. ${SEED_PROFILE.achievements[4]}

Target Job Info:
- Company: ${company}
- Role Title: ${roleTitle}
- Job Description:
"""
${jobDescription.slice(0, 4000)}
"""

Evaluate this JD and produce a JSON response with:
1. "fitScore": integer from 0 to 100 reflecting stack & scope alignment.
2. "yoeGatePassed": boolean. True if 2 YoE is acceptable or if it's early-career / mid-level / Software Engineer. False if it strictly mandates 4+ or 5+ YoE.
3. "yoeGateDetails": concise string explaining the YoE evaluation and strategy.
4. "matchingHighlights": array of 3-5 strings highlighting candidate's exact strengths matching the JD.
5. "missingKeywords": array of 3-5 critical ATS keywords mentioned in the JD that Rahul should add to his tailored resume.
6. "linkedinPitch": string of STRICTLY LESS THAN 300 CHARACTERS tailored connection request note to an Engineering Manager citing Rahul's 2.1B+ scale and 90% latency reduction.
7. "coldEmail": string around 100-140 words cold email to the hiring manager with subject line, bullet points of achievements, and call to action.

Return ONLY the raw JSON object. Do not wrap in markdown or backticks.
`;

        const response = await model.generateContent(prompt);
        const text = response.response.text().trim();
        const cleanJson = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(cleanJson);

        let pitch = parsed.linkedinPitch || "";
        if (pitch.length > 299) {
          pitch = pitch.slice(0, 296) + "...";
        }

        const result: JDAnalysisResult = {
          fitScore: Math.min(Math.max(parsed.fitScore || 85, 0), 100),
          yoeGatePassed: parsed.yoeGatePassed ?? true,
          yoeGateDetails: parsed.yoeGateDetails || "Evaluated against 2+ YoE profile.",
          matchingHighlights: Array.isArray(parsed.matchingHighlights) ? parsed.matchingHighlights : [],
          missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
          linkedinPitch: pitch,
          coldEmail: parsed.coldEmail || "",
        };

        return NextResponse.json({ success: true, analysis: result, source: "gemini-2.5-flash" });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to heuristic analyzer:", geminiError);
      }
    }

    // Heuristic analyzer fallback
    const heuristicResult = heuristicAnalyzeJD(jobDescription, company, roleTitle);
    return NextResponse.json({
      success: true,
      analysis: heuristicResult,
      source: "heuristic-engine",
    });
  } catch (error) {
    console.error("Error in /api/ai/analyze-jd:", error);
    return NextResponse.json(
      { error: "Internal server error analyzing job description." },
      { status: 500 }
    );
  }
}
