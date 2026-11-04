import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeChatMessage, ExtractedInterviewData } from "@/types";

export const dynamic = "force-dynamic";

interface ResumeChatRequest {
  messages: ResumeChatMessage[];
  existingResumeText: string;
  jobDescription: string;
  targetCompany?: string;
  targetRole?: string;
  extractedData?: ExtractedInterviewData;
}

// Helper: Extract links and metrics from text using regex
function parseUserEntities(
  text: string,
  existingData: ExtractedInterviewData = {
    additionalSkills: [],
    additionalAchievements: [],
    gapNotes: [],
  }
): ExtractedInterviewData {
  const updated: ExtractedInterviewData = {
    ...existingData,
    additionalSkills: [...(existingData.additionalSkills || [])],
    additionalAchievements: [...(existingData.additionalAchievements || [])],
    gapNotes: [...(existingData.gapNotes || [])],
  };

  // 1. GitHub match
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?)/i);
  if (githubMatch) {
    updated.githubUrl = githubMatch[0].startsWith("http") ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  // 2. LinkedIn match
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    updated.linkedinUrl = linkedinMatch[0].startsWith("http") ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  // 3. Portfolio match
  const portfolioMatch = text.match(/(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:dev|me|io|com|org)(?:\/[^\s]*)?)/i);
  if (portfolioMatch && !portfolioMatch[0].includes("github.com") && !portfolioMatch[0].includes("linkedin.com")) {
    updated.portfolioUrl = portfolioMatch[0].startsWith("http") ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
  }

  // 4. Quantified metric recognition
  const metricMatch = text.match(/(\d+[\d,.]*(?:\+|%|k|m|b|ms|s|x|gb|tb)?(?:\s*(?:million|billion|users|req\/s|latency|throughput|events|speedup|reduction|scale))?)/gi);
  if (metricMatch && text.length > 25) {
    updated.additionalAchievements.push(text.trim());
  }

  // Deduplicate
  updated.additionalSkills = Array.from(new Set(updated.additionalSkills));
  updated.additionalAchievements = Array.from(new Set(updated.additionalAchievements));

  return updated;
}

// Heuristic Fallback Assistant
function generateHeuristicResponse(
  messages: ResumeChatMessage[],
  existingResume: string,
  jd: string,
  company: string,
  role: string,
  currentExtracted: ExtractedInterviewData
) {
  const lastUserMsg = messages[messages.length - 1]?.text || "";
  const extracted = parseUserEntities(lastUserMsg, currentExtracted);

  const resumeLower = (existingResume + " " + lastUserMsg).toLowerCase();
  const jdLower = jd.toLowerCase();

  // Check specific gaps
  const missingGithub = !extracted.githubUrl && !resumeLower.includes("github.com");
  const jdHasKafka = jdLower.includes("kafka") || jdLower.includes("streaming");
  const resumeHasKafka = resumeLower.includes("kafka");
  const jdHasRedis = jdLower.includes("redis") || jdLower.includes("caching");
  const resumeHasRedis = resumeLower.includes("redis");

  let replyText = "";
  const suggestedActions: { label: string; payload?: string }[] = [];

  if (messages.length <= 1) {
    // Initial opening comparison
    replyText = `I did an immediate comparison between your profile and **${company}**'s **${role}** description.\n\nHere are 2 high-impact items we should clarify:\n\n1. **GitHub / Project Proof**: We need your GitHub URL to showcase code quality and personal engineering projects.\n2. **High-Throughput Caching / Streaming**: ${company} specifically asks for distributed stream processing. Did you handle event streaming (Kafka/SQS) or Redis caching at Fidelity? What were the throughput or latency numbers?`;
    
    suggestedActions.push(
      { label: "Share GitHub Link", payload: "My GitHub profile is https://github.com/" },
      { label: "Add Redis 5ms Caching Metric", payload: "Yes, I scaled Redis caching to achieve sub-5ms lookup latency across 10M+ daily requests." }
    );
  } else if (missingGithub) {
    replyText = `Got it! I logged that experience into our context bank.\n\nCould you also share your **GitHub or portfolio profile link**? ATS parsers and engineering managers score candidates significantly higher when an active codebase or project link (like First50) is included.`;
    suggestedActions.push({ label: "Paste GitHub: github.com/RahulPrasanna-code", payload: "https://github.com/RahulPrasanna-code" });
  } else if (jdHasKafka && !resumeHasKafka) {
    replyText = `Awesome! I've linked your GitHub profile (${extracted.githubUrl}).\n\nOne more technical requirement: **${company}** mandates experience with event streaming and message partitioning. Have you worked with Kafka consumer groups, partition rebalancing, or message deduplication?`;
    suggestedActions.push(
      { label: "Yes, Kafka 50M+ events/day", payload: "Yes, I designed Kafka event consumers handling 50M+ events/day with idempotency keys to prevent duplicate processing." },
      { label: "Skip this question", payload: "I have foundational Kafka knowledge but prefer highlighting my AWS SQS and Kubernetes KEDA scaling work." }
    );
  } else {
    replyText = `Excellent! We now have the complete ammunition for **${company}**:\n- Target Role: **${role}**\n- Verified GitHub: **${extracted.githubUrl || "Added"}**\n- Spliced Metrics: High-scale communications, latency cuts, and distributed caching.\n\nWe are ready to trigger the multi-agent LLM chain to synthesize your tailored resume!`;
    suggestedActions.push({ label: "🚀 Generate Tailored Resume Now", payload: "READY_TO_GENERATE" });
  }

  return {
    reply: replyText,
    extractedData: extracted,
    suggestedActions,
  };
}

export async function POST(req: Request) {
  try {
    const body: ResumeChatRequest = await req.json();
    const {
      messages = [],
      existingResumeText = "",
      jobDescription = "",
      targetCompany = "Target Company",
      targetRole = "Backend Software Engineer",
      extractedData = {
        additionalSkills: [],
        additionalAchievements: [],
        gapNotes: [],
      },
    } = body;

    // First, extract any entities from the latest user message
    const lastUserMsg = messages[messages.length - 1]?.text || "";
    let updatedExtractedData = parseUserEntities(lastUserMsg, extractedData);

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

        const prompt = `
You are an expert Technical Recruiter & Career Strategist interviewing candidate Rahul Prasanna for an opening at ${targetCompany} for the role of ${targetRole}.

Target Job Description:
"""
${jobDescription.slice(0, 3000)}
"""

Candidate's Current Resume / Background Summary:
"""
${existingResumeText.slice(0, 2500)}
"""

Conversation History:
${JSON.stringify(messages, null, 2)}

Already Extracted Entities:
${JSON.stringify(updatedExtractedData, null, 2)}

YOUR OBJECTIVE:
1. Conduct an intelligent, conversational interview gap analysis.
2. Ask 1 or 2 targeted questions to extract missing links (e.g. GitHub URL, portfolio), missing hard skills from the JD (e.g., Kafka, Redis, AWS, CI/CD), or missing quantified numbers (latencies, percentages, throughput).
3. If the candidate just provided answers or URLs, acknowledge them warmly, note what you incorporated, and ask the next high-value question.
4. When sufficient details (GitHub, key stack metrics) are collected or the candidate says they are ready, conclude and tell them we are ready to run the LLM chain to generate the verified resume.
5. Keep your tone encouraging, concise, and professional (like an elite technical coach).

Return ONLY a raw JSON object (no markdown, no backticks):
{
  "replyText": string (your conversational reply to the candidate formatted in clean markdown),
  "newExtractedData": {
    "githubUrl": string or null,
    "linkedinUrl": string or null,
    "portfolioUrl": string or null,
    "additionalSkills": string[],
    "additionalAchievements": string[],
    "gapNotes": string[]
  },
  "suggestedActions": [
    { "label": string, "payload": string }
  ]
}
`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim();
        const cleanJson = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(cleanJson);

        if (parsed.newExtractedData) {
          updatedExtractedData = {
            ...updatedExtractedData,
            githubUrl: parsed.newExtractedData.githubUrl || updatedExtractedData.githubUrl,
            linkedinUrl: parsed.newExtractedData.linkedinUrl || updatedExtractedData.linkedinUrl,
            portfolioUrl: parsed.newExtractedData.portfolioUrl || updatedExtractedData.portfolioUrl,
            additionalSkills: Array.from(new Set([...updatedExtractedData.additionalSkills, ...(parsed.newExtractedData.additionalSkills || [])])),
            additionalAchievements: Array.from(new Set([...updatedExtractedData.additionalAchievements, ...(parsed.newExtractedData.additionalAchievements || [])])),
            gapNotes: Array.from(new Set([...updatedExtractedData.gapNotes, ...(parsed.newExtractedData.gapNotes || [])])),
          };
        }

        const newAssistantMessage: ResumeChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "assistant",
          text: parsed.replyText || "I've noted that! Let's incorporate it into your tailored resume.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedActions: parsed.suggestedActions || [],
        };

        return NextResponse.json({
          success: true,
          message: newAssistantMessage,
          extractedData: updatedExtractedData,
          source: "gemini-interview-agent",
        });
      } catch (geminiError: any) {
        console.warn("Gemini resume-chat failed, using heuristic assistant:", geminiError?.message || geminiError);
      }
    }

    // Heuristic Assistant Fallback
    const heuristic = generateHeuristicResponse(
      messages,
      existingResumeText,
      jobDescription,
      targetCompany,
      targetRole,
      updatedExtractedData
    );

    const fallbackAssistantMessage: ResumeChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "assistant",
      text: heuristic.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: heuristic.suggestedActions,
    };

    return NextResponse.json({
      success: true,
      message: fallbackAssistantMessage,
      extractedData: heuristic.extractedData,
      source: "heuristic-assistant",
    });
  } catch (error: any) {
    console.error("Critical error in /api/ai/resume-chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat message." },
      { status: 500 }
    );
  }
}
