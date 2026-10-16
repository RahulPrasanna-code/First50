import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DeepPrepTopic } from "@/types";
import { SEED_PROFILE } from "@/data/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic = "Distributed Systems & Concurrency" } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

        const prompt = `
You are a Staff Software Engineer and Senior Technical Interview Coach for Tier-1 Product Companies and FinTechs (Razorpay, Stripe, Swiggy, Cred, AWS).
The candidate is Rahul Prasanna T S:
- Current Role: Software Engineer at Fidelity Investments India (Communications Orchestration Platform)
- Core Stack: Java 17/21, Spring Boot, AWS, Kubernetes, KEDA, PostgreSQL
- Key Quantified Achievements: 2.1B+ scale communications, 90% batch latency cut, 67% PostgreSQL insert optimization, zero SQS data loss in KEDA, AWS MRAP active-active failover.

Generate a focused, high-yield preparation module for the topic: "${topic}".

Return ONLY a raw JSON object with this EXACT structure (no markdown, no backticks, no extra text):
{
  "id": "custom-${Date.now()}",
  "dayOfWeek": "Custom Target",
  "dsaTitle": string (Name of an iconic LeetCode Medium or Hard problem relevant to this topic),
  "dsaDifficulty": "Medium" or "Hard",
  "dsaPattern": string (Core algorithmic pattern e.g. "Monotonic Stack", "Sliding Window", "Topological Sort"),
  "dsaUrl": string (Direct working URL to problem on LeetCode e.g. "https://leetcode.com/problems/..."),
  "dsaKeyInsight": string (2-3 sentences explaining the non-obvious algorithmic trick and SDE-2 follow-up),
  "distSysTitle": string (A high-yield distributed systems architecture topic),
  "distSysCategory": string (Category e.g. "Caching", "Concurrency", "Database Scaling", "Fault Tolerance"),
  "distSysReadingUrl": string (URL to a classic paper, engineering blog, or System Design Primer),
  "distSysReadingTitle": string (Name of the article or whitepaper),
  "distSysSummary": string (3-4 sentences explaining trade-offs, architecture, and common pitfalls),
  "fidelityConnection": string (How Rahul can cite this in an SDE-2 interview using his Fidelity 2.1B+ scale or 90% latency reduction experience),
  "interviewTip": string (1-2 sentences on what Tier-1 interviewers look for when asking this)
}
`;

        const response = await model.generateContent(prompt);
        const text = response.response.text().trim();
        const cleanJson = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        const parsed: DeepPrepTopic = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, prep: parsed });
      } catch (err: any) {
        console.warn("Gemini prep generator failed, using heuristic fallback:", err.message);
      }
    }

    // Heuristic fallback
    const fallbackPrep: DeepPrepTopic = {
      id: `custom-${Date.now()}`,
      dayOfWeek: "Custom Target",
      dsaTitle: `${topic} - In-Memory Design & Optimization`,
      dsaDifficulty: "Medium",
      dsaPattern: "Hash Map + Heap / Sliding Window",
      dsaUrl: "https://leetcode.com/problemset/all/",
      dsaKeyInsight: "Focus on optimal O(1) or O(log N) lookup and deletion operations. Be prepared to discuss thread safety with concurrent collections.",
      distSysTitle: `${topic}: High-Throughput & Fault-Tolerant Architecture`,
      distSysCategory: "System Design & Scalability",
      distSysReadingUrl: "https://github.com/donnemartin/system-design-primer",
      distSysReadingTitle: "System Design Primer: Scalable Systems & Patterns",
      distSysSummary: `Architectural breakdown for ${topic}: balancing latency vs consistency (CAP theorem). Key considerations include asynchronous processing, failure isolation, and backpressure handling.`,
      fidelityConnection: `Connect this to your Fidelity communications platform handling 2.1B+ transactions: explain how decoupling services prevented cascading failures during peak market volumes.`,
      interviewTip: `Always articulate trade-offs clearly: latency vs durability, and write vs read throughput.`,
    };

    return NextResponse.json({ success: true, prep: fallbackPrep });
  } catch (error) {
    console.error("Error in /api/ai/generate-prep:", error);
    return NextResponse.json({ error: "Failed to generate prep topic" }, { status: 500 });
  }
}
