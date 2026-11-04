"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Printer,
  Download,
  Share2,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  Search,
  Code2,
  Building,
  Target,
  Clock,
  ArrowRight,
  Cpu,
  Eye,
  Edit3,
  Save,
  Trash2,
  MessageSquare,
  UploadCloud,
  SendHorizontal,
  Bot,
  User as UserIcon,
  HelpCircle,
  Link2,
} from "lucide-react";
import {
  GeneratedResume,
  ResumeAuditEvaluation,
  ResumeChainStepLog,
  ResumeGenerationResult,
  UserProfile,
  BragItem,
  ScrapedJob,
  Application,
  ResumeChatMessage,
  ExtractedInterviewData,
} from "@/types";
import {
  getGeneratedResumes,
  saveGeneratedResume,
  deleteGeneratedResume,
} from "@/lib/storage";

interface ResumeStudioProps {
  profile: UserProfile;
  bragItems?: BragItem[];
  scrapedJobs?: ScrapedJob[];
  applications?: Application[];
  onNavigateToPitch?: (company: string, role: string) => void;
  onShowToast: (message: string) => void;
}

const SAMPLE_JDS = [
  {
    company: "Razorpay",
    role: "Backend Software Engineer (Payments Core)",
    jd: `About the Role:
We are looking for a Backend Software Engineer to join our Core Ledger & Settlement Platform in Bengaluru. You will design and scale high-throughput, low-latency transaction processing microservices handling millions of events daily.

Key Responsibilities:
- Build and scale distributed payment backends using Java 17/21, Spring Boot, and Kafka.
- Design fault-tolerant database schemas on PostgreSQL and optimize high-volume queries with Redis caching.
- Deploy and manage containerized services on AWS (EKS, SQS, S3, IAM) with Kubernetes and automated CI/CD.
- Mitigate concurrency issues, consumer lag, and ensure zero-data-loss event streaming during payment spikes.

Requirements:
- 2+ years of production experience in backend software engineering with Java or Go.
- Hands-on experience with Kafka, Distributed Systems, Microservices, and PostgreSQL optimization.
- Strong grounding in Computer Science fundamentals, DSA, and System Design.`,
  },
  {
    company: "Swiggy",
    role: "Software Engineer II (Delivery & Tracking Platform)",
    jd: `About the Team:
Swiggy's Tracking Platform processes millions of real-time geospatial location pings and order lifecycle state transitions every second with sub-100ms latency.

Requirements & Responsibilities:
- Architect distributed event-driven systems using Java, Spring Boot, Kafka, and Kubernetes.
- Optimize database performance on PostgreSQL and DynamoDB with partition pruning and caching.
- Build resilient cloud systems on AWS with active failover, KEDA event-driven auto-scaling, and telemetry monitoring.
- Strong problem-solving skills with algorithms, data structures, and concurrency handling.`,
  },
];

export function ResumeStudio({
  profile,
  bragItems = [],
  scrapedJobs = [],
  applications = [],
  onNavigateToPitch,
  onShowToast,
}: ResumeStudioProps) {
  // Navigation / Input Tabs in Left Panel
  const [leftTab, setLeftTab] = useState<"jd" | "upload" | "chat">("jd");

  // Input State: Target JD
  const [targetCompany, setTargetCompany] = useState<string>("Razorpay");
  const [targetRole, setTargetRole] = useState<string>("Backend Software Engineer");
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_JDS[0].jd);

  // Input State: Existing Resume
  const defaultExistingResume = `Rahul Prasanna T S
Software Engineer at Fidelity Investments India (Communications Orchestration Platform)
Experience: 2+ Years in Java 17/21, Spring Boot, AWS, Kubernetes, KEDA, PostgreSQL.
Achievements:
- Scaled platform to process 2.1B+ annual communications, retiring legacy mainframes.
- Cut backend batch execution time by 90% (under 2 hours) via parallelized Kubernetes worker model.
- Reduced PostgreSQL batch insert runtimes by 67% with partitioned summary tables and index pruning.
- Fixed KEDA AWS SQS scale-down race condition eliminating data loss.
- Built multi-region active-active backend on AWS MRAP.`;

  const [existingResumeText, setExistingResumeText] = useState<string>(defaultExistingResume);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Interactive Information Collecting Chat State
  const [chatMessages, setChatMessages] = useState<ResumeChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractedInterviewData>({
    githubUrl: "https://github.com/RahulPrasanna-code",
    linkedinUrl: "https://linkedin.com/in/rahul-prasanna",
    additionalSkills: [],
    additionalAchievements: [],
    gapNotes: [],
  });
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Generation & Pipeline State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [chainLogs, setChainLogs] = useState<ResumeChainStepLog[]>([]);
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [evaluation, setEvaluation] = useState<ResumeAuditEvaluation | null>(null);
  const [iterationsRun, setIterationsRun] = useState<number>(1);
  const [sourceEngine, setSourceEngine] = useState<string>("");

  // UI State for Preview
  const [activeViewTab, setActiveViewTab] = useState<"preview" | "audit" | "markdown" | "json">("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [savedResumes, setSavedResumes] = useState<GeneratedResume[]>([]);
  const [showSavedDrawer, setShowSavedDrawer] = useState<boolean>(false);

  // Initialize saved resumes
  useEffect(() => {
    loadSavedResumes();
  }, []);

  // Initialize first recruiter message when opening chat
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: "welcome-1",
          sender: "assistant",
          text: `👋 Hi ${profile.name?.split(" ")[0] || "there"}! I'm your **Information Collecting AI Recruiter**.\n\nI compared your background with **${targetCompany}**'s **${targetRole}** role.\n\nTo ensure our ATS score hits 90%+, let's check:\n1. **Your GitHub Link**: To showcase code quality & open-source projects.\n2. **High-Throughput Caching / Streaming**: ${targetCompany} emphasizes low-latency processing. Did you handle Kafka streaming, Redis caching, or message partitioning at Fidelity?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedActions: [
            { label: "Share GitHub Link", payload: "My GitHub is https://github.com/RahulPrasanna-code" },
            { label: "Add Redis 5ms Caching Metric", payload: "I implemented Redis caching reducing database read pressure during 2.1B+ bursts with sub-5ms latency." },
            { label: "Add Kafka 50M Events/Day", payload: "I architected Kafka event streaming pipelines processing 50M+ daily events with idempotency keys." },
          ],
        },
      ]);
    }
  }, [targetCompany, targetRole]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  const loadSavedResumes = async () => {
    const list = await getGeneratedResumes();
    setSavedResumes(list);
  };

  const handleSelectSample = (sample: (typeof SAMPLE_JDS)[0]) => {
    setTargetCompany(sample.company);
    setTargetRole(sample.role);
    setJobDescription(sample.jd);
    setChatMessages([]);
    onShowToast(`Loaded ${sample.company} sample Job Description.`);
  };

  const handleSelectFromRadar = (job: ScrapedJob) => {
    setTargetCompany(job.company);
    setTargetRole(job.title);
    setJobDescription(`Role: ${job.title} at ${job.company}\nLocation: ${job.location}\nSource: ${job.source}\nRequired Skills: ${job.matchingSkills.join(", ")}\nMissing Keywords: ${job.missingKeywords.join(", ")}`);
    setChatMessages([]);
    onShowToast(`Imported ${job.company} opening from Morning Radar.`);
  };

  // Handle Upload of Existing Resume File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setExistingResumeText(text);
        onShowToast(`Loaded ${file.name} (${Math.round(text.length / 5)} words).`);
        // Switch to chat to prompt gap analysis!
        setLeftTab("chat");
      }
    };
    reader.readAsText(file);
  };

  // Send Chat Message to Information-Collecting LLM
  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || userChatInput).trim();
    if (!text || isChatLoading) return;

    if (text === "READY_TO_GENERATE") {
      handleGenerate();
      return;
    }

    const userMessage: ResumeChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...chatMessages, userMessage];
    setChatMessages(newHistory);
    setUserChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/resume-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          existingResumeText,
          jobDescription,
          targetCompany,
          targetRole,
          extractedData,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setChatMessages((prev) => [...prev, data.message]);
        if (data.extractedData) {
          setExtractedData(data.extractedData);
        }
      }
    } catch (err: any) {
      console.warn("Chat agent error:", err);
      onShowToast("Chat response delayed. Details still captured.");
    } finally {
      setIsChatLoading(false);
    }
  };

  // Trigger Multi-Agent LLM Chain
  const handleGenerate = async () => {
    if (!jobDescription || jobDescription.trim().length < 30) {
      onShowToast("Please enter a valid Job Description first.");
      setLeftTab("jd");
      return;
    }

    setIsGenerating(true);
    setGeneratedResume(null);
    setEvaluation(null);
    setCurrentStep(1);
    setChainLogs([
      {
        step: 1,
        name: "JD Deconstruction & ATS Token Extraction",
        status: "running",
        timestamp: new Date().toLocaleTimeString(),
        summary: "Analyzing JD requirements, parsing domain problems & extracting top ATS tokens...",
      },
    ]);

    try {
      const stepTimer1 = setTimeout(() => {
        setCurrentStep(2);
        setChainLogs((prev) => [
          { ...prev[0], status: "completed" },
          {
            step: 2,
            name: "Experience Splicing & STAR Match",
            status: "running",
            timestamp: new Date().toLocaleTimeString(),
            summary: "Splicing Fidelity 2.1B+ communications, chat metrics & verified links...",
          },
        ]);
      }, 1200);

      const stepTimer2 = setTimeout(() => {
        setCurrentStep(3);
        setChainLogs((prev) => [
          prev[0],
          { ...prev[1], status: "completed" },
          {
            step: 3,
            name: "Resume Section Synthesis (Pass 1)",
            status: "running",
            timestamp: new Date().toLocaleTimeString(),
            summary: "Formulating Google XYZ bullets, targeted summary & categorized skills...",
          },
        ]);
      }, 2500);

      const res = await fetch("/api/ai/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          targetCompany,
          targetRole,
          profile,
          bragItems,
          existingResumeText,
          extractedData,
          maxIterations: 2,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data: ResumeGenerationResult = await res.json();

      if (!res.ok || !(data as any).success) {
        throw new Error((data as any).error || "Failed to generate resume");
      }

      setGeneratedResume(data.resume);
      setEvaluation(data.evaluation);
      setIterationsRun(data.iterationsRun);
      setSourceEngine(data.source);
      setChainLogs(data.chainHistory || []);
      setCurrentStep(6);

      // Auto-save generated resume
      await saveGeneratedResume(data.resume);
      loadSavedResumes();

      if (data.iterationsRun > 1) {
        onShowToast(`🎯 Resume synthesized with Evaluator Self-Correction (${data.evaluation.fitScore}% Fit Score)!`);
      } else {
        onShowToast(`✅ Tailored ATS Resume generated (${data.evaluation.fitScore}% Fit Score)!`);
      }
    } catch (err: any) {
      console.error("Resume generation error:", err);
      onShowToast(`Error: ${err.message || "Failed to generate resume"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!generatedResume) return;
    const md = generateMarkdown(generatedResume);
    navigator.clipboard.writeText(md);
    setCopiedType("markdown");
    setTimeout(() => setCopiedType(null), 2500);
    onShowToast("📋 Copied full resume as Markdown to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteSaved = async (id: string) => {
    const updated = await deleteGeneratedResume(id);
    setSavedResumes(updated);
    if (generatedResume?.id === id) {
      setGeneratedResume(null);
    }
    onShowToast("Resume deleted from saved bank.");
  };

  const generateMarkdown = (r: GeneratedResume) => {
    return `# ${r.contactInfo.name}
**${r.contactInfo.title}** | ${r.contactInfo.location} | ${r.contactInfo.email} | ${r.contactInfo.phone || ""}
[LinkedIn](${r.contactInfo.linkedin}) | [GitHub](${r.contactInfo.github})

---

### PROFESSIONAL SUMMARY
${r.professionalSummary}

---

### CORE TECHNICAL SKILLS
- **Languages & Frameworks:** ${r.coreSkills.languagesAndFrameworks.join(", ")}
- **Cloud & DevOps:** ${r.coreSkills.cloudAndInfrastructure.join(", ")}
- **Databases & Distributed Systems:** ${r.coreSkills.databasesAndDistributedSystems.join(", ")}
- **Architecture & Engineering:** ${r.coreSkills.architectureAndPractices.join(", ")}

---

### WORK EXPERIENCE
${r.workExperience
  .map(
    (exp) => `#### ${exp.role} — ${exp.company}
*${exp.location} | ${exp.period}*
${exp.bullets.map((b) => `- ${b}`).join("\n")}`
  )
  .join("\n\n")}

---

### KEY ENGINEERING PROJECTS
${r.keyProjects
  .map(
    (proj) => `#### ${proj.title}
*Tech Stack: ${proj.techStack.join(", ")}*
${proj.bullets.map((b) => `- ${b}`).join("\n")}`
  )
  .join("\n\n")}

---

### EDUCATION
${r.education
  .map((edu) => `- **${edu.degree}** — ${edu.institution} (${edu.year}) — *${edu.gradeOrDetails || ""}*`)
  .join("\n")}
`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-indigo/10 dark:bg-brand-cyan/15 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Resume Studio & Interview Assistant
            </h2>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              Interactive Gap Collector
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Upload or paste your existing resume, chat with the AI Recruiter to fill critical metrics and links, then run the multi-agent LLM chain with a self-correcting Bar-Raiser Evaluator loop.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedResumes.length > 0 && (
            <button
              onClick={() => setShowSavedDrawer(!showSavedDrawer)}
              className="flex items-center gap-1.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-indigo dark:hover:border-brand-cyan transition"
            >
              <Layers className="h-4 w-4" />
              <span>Saved Resumes ({savedResumes.length})</span>
            </button>
          )}

          {generatedResume && onNavigateToPitch && (
            <button
              onClick={() => onNavigateToPitch(generatedResume.targetCompany, generatedResume.targetRole)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 hover:opacity-90 transition"
            >
              <Zap className="h-4 w-4" />
              <span>Pitch HM for this Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Saved Resumes Mini Tray (Expandable) */}
      {showSavedDrawer && (
        <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Saved Tailored Resumes
            </span>
            <button
              onClick={() => setShowSavedDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {savedResumes.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-3 text-xs shadow-2xs hover:border-brand-indigo dark:hover:border-brand-cyan transition"
              >
                <div
                  className="cursor-pointer space-y-0.5 flex-1 pr-2"
                  onClick={() => {
                    setGeneratedResume(r);
                    setTargetCompany(r.targetCompany);
                    setTargetRole(r.targetRole);
                    setShowSavedDrawer(false);
                    onShowToast(`Loaded resume for ${r.targetCompany}`);
                  }}
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100">{r.targetCompany}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{r.targetRole}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSaved(r.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                  title="Delete resume"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* =========================================================================
            LEFT COLUMN (5 Cols): TABBED INPUT (TARGET JD / MY RESUME / CHAT)
        ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs space-y-4">
            
            {/* 3-Tab Selector: [Target JD] [My Resume] [💬 AI Recruiter Chat] */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-subsurface-light dark:bg-subsurface-dark p-1 text-xs">
              <button
                type="button"
                onClick={() => setLeftTab("jd")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-bold transition ${
                  leftTab === "jd"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                <span>1. Target JD</span>
              </button>

              <button
                type="button"
                onClick={() => setLeftTab("upload")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-bold transition ${
                  leftTab === "upload"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>2. My Resume</span>
              </button>

              <button
                type="button"
                onClick={() => setLeftTab("chat")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-bold transition relative ${
                  leftTab === "chat"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>3. AI Chat</span>
                {extractedData.additionalAchievements.length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            </div>

            {/* TAB A: TARGET JD INPUT */}
            {leftTab === "jd" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Role & Job Description
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-400">Sample:</span>
                    {SAMPLE_JDS.map((s) => (
                      <button
                        key={s.company}
                        type="button"
                        onClick={() => handleSelectSample(s)}
                        className="rounded bg-subsurface-light dark:bg-subsurface-dark px-2 py-0.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-cyan border border-hairline-light dark:border-hairline-dark transition"
                      >
                        {s.company}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scraped Jobs from Morning Radar */}
                {scrapedJobs.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                    <span className="text-slate-400 shrink-0">From Radar:</span>
                    {scrapedJobs.slice(0, 3).map((job) => (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => handleSelectFromRadar(job)}
                        className="shrink-0 rounded-lg bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 hover:opacity-80 transition"
                      >
                        {job.company} · {job.title.slice(0, 16)}...
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Company
                    </label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="e.g. Razorpay, Swiggy"
                      className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role Title
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Backend Software Engineer"
                      className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Description (Paste Requirements)
                  </label>
                  <textarea
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description here..."
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono leading-relaxed focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Step 1 complete</span>
                  <button
                    type="button"
                    onClick={() => setLeftTab("chat")}
                    className="flex items-center gap-1 font-bold text-brand-indigo dark:text-brand-cyan hover:underline"
                  >
                    <span>Proceed to Gap Interview Chat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB B: UPLOAD / PASTE EXISTING RESUME */}
            {leftTab === "upload" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Existing Resume Source
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setExistingResumeText(defaultExistingResume);
                      setUploadedFileName(null);
                      onShowToast("Reset to default Fidelity profile credentials.");
                    }}
                    className="text-[10px] font-semibold text-brand-indigo dark:text-brand-cyan hover:underline"
                  >
                    Reset to Fidelity Default
                  </button>
                </div>

                {/* Upload Box */}
                <div className="rounded-xl border border-dashed border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/30 dark:bg-cyan-500/5 p-4 text-center">
                  <UploadCloud className="h-6 w-6 mx-auto text-brand-indigo dark:text-brand-cyan mb-1.5" />
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {uploadedFileName ? `Loaded: ${uploadedFileName}` : "Upload Existing Resume Text / Doc"}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports .txt, .md, and raw resume exports
                  </p>
                  <label className="mt-2.5 inline-flex items-center gap-1.5 cursor-pointer rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3 py-1.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition">
                    <span>Browse File</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Or Paste Existing Resume Text
                  </label>
                  <textarea
                    rows={8}
                    value={existingResumeText}
                    onChange={(e) => setExistingResumeText(e.target.value)}
                    placeholder="Paste your current resume content here..."
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono leading-relaxed focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">
                    {existingResumeText.length > 50 ? "✓ Resume Context Active" : "No text added"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLeftTab("chat")}
                    className="flex items-center gap-1 font-bold text-brand-indigo dark:text-brand-cyan hover:underline"
                  >
                    <span>Run Gap Analysis Chat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB C: INTERACTIVE INFORMATION-COLLECTING CHAT */}
            {leftTab === "chat" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Bot className="h-3.5 w-3.5 text-brand-indigo dark:text-brand-cyan" />
                    Gap Collector Assistant
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Comparing vs {targetCompany}
                  </span>
                </div>

                {/* Extracted Ammunition Badges */}
                <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2.5 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                    <span>Captured Context</span>
                    <span className="text-brand-indigo dark:text-brand-cyan">Feeds Step 2 & 3 Chain</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedData.githubUrl && (
                      <span className="flex items-center gap-1 rounded bg-white dark:bg-slate-800 px-2 py-0.5 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                        <Check className="h-3 w-3" /> GitHub: {extractedData.githubUrl.replace("https://", "")}
                      </span>
                    )}
                    {extractedData.additionalAchievements.length > 0 && (
                      <span className="flex items-center gap-1 rounded bg-white dark:bg-slate-800 px-2 py-0.5 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
                        <Zap className="h-3 w-3" /> {extractedData.additionalAchievements.length} Spliced Metric(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Chat Scroll Container */}
                <div
                  ref={chatScrollRef}
                  className="h-64 overflow-y-auto rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light/40 dark:bg-subsurface-dark/40 p-3 space-y-3 text-xs"
                >
                  {chatMessages.map((msg) => {
                    const isAssistant = msg.sender === "assistant";
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isAssistant ? "items-start" : "items-start flex-row-reverse"}`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isAssistant
                              ? "bg-brand-indigo/15 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {isAssistant ? <Bot className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                        </div>

                        <div className={`space-y-1.5 max-w-[85%]`}>
                          <div
                            className={`rounded-2xl p-3 leading-relaxed whitespace-pre-line ${
                              isAssistant
                                ? "bg-white dark:bg-[#070E1A] text-slate-800 dark:text-slate-200 border border-hairline-light dark:border-hairline-dark shadow-2xs"
                                : "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 font-medium"
                            }`}
                          >
                            {msg.text}
                          </div>

                          {/* Quick Action Suggestion Chips */}
                          {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {msg.suggestedActions.map((action, aIdx) => (
                                <button
                                  key={aIdx}
                                  type="button"
                                  onClick={() => handleSendChatMessage(action.payload || action.label)}
                                  className="rounded-lg border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/80 dark:bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-brand-indigo dark:text-brand-cyan hover:opacity-90 transition active:scale-95"
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                      <Bot className="h-4 w-4 animate-spin text-brand-indigo dark:text-brand-cyan" />
                      <span>Analyzing gaps and formulating question...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="e.g. My GitHub is github.com/user, and I scaled Kafka to 50M events..."
                    className="flex-1 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!userChatInput.trim() || isChatLoading}
                    className="rounded-xl bg-brand-indigo dark:bg-brand-cyan p-2 text-white dark:text-slate-950 disabled:opacity-40 transition shadow-xs"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Launch LLM Chaining Generation Button */}
            <div className="pt-2 border-t border-hairline-light dark:border-hairline-dark">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-3 text-xs font-bold text-white dark:text-slate-950 shadow-md hover:opacity-95 transition-all disabled:opacity-50 active:scale-[0.99]"
              >
                <Sparkles className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                <span>
                  {isGenerating
                    ? "Orchestrating LLM Chain & Auditor..."
                    : `Generate Tailored Resume for ${targetCompany}`}
                </span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              LLM CHAINING & EVALUATOR TELEMETRY CARD
          ========================================================================= */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
                Orchestrator Chain Telemetry
              </span>

              {evaluation && (
                <span className="rounded-full bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
                  {iterationsRun} Iteration(s) Run
                </span>
              )}
            </div>

            {/* Live Step Progress List */}
            <div className="space-y-2">
              {[
                { step: 1, label: "Step 1: JD Deconstruction & ATS Token Extraction", icon: Target },
                { step: 2, label: "Step 2: Experience Splicing & Chat Ammunition Match", icon: Zap },
                { step: 3, label: "Step 3: Resume Section Synthesis", icon: FileText },
                { step: 4, label: "Step 4: Evaluator / Bar-Raiser ATS Audit", icon: ShieldCheck },
                { step: 5, label: "Step 5: Self-Correction Feedback Loop", icon: RotateCcw, conditional: iterationsRun > 1 || currentStep >= 5 },
                { step: 6, label: "Step 6: Final Verification & Verification", icon: CheckCircle2 },
              ]
                .filter((s) => s.conditional === undefined || s.conditional)
                .map((s) => {
                  const Icon = s.icon;
                  const isDone = currentStep > s.step || (currentStep === 6 && s.step <= 6);
                  const isCurrent = currentStep === s.step && isGenerating;

                  return (
                    <div
                      key={s.step}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-xs transition ${
                        isCurrent
                          ? "border-brand-indigo dark:border-brand-cyan bg-indigo-50/50 dark:bg-cyan-500/10 font-bold"
                          : isDone
                          ? "border-hairline-light dark:border-hairline-dark bg-subsurface-light/60 dark:bg-subsurface-dark/60 text-slate-700 dark:text-slate-300"
                          : "border-transparent text-slate-400 dark:text-slate-600 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs ${
                            isCurrent
                              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 font-bold"
                              : isDone
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[11px]">{s.label}</span>
                      </div>

                      <div>
                        {isCurrent && (
                          <span className="font-mono text-[10px] text-brand-indigo dark:text-brand-cyan">
                            Processing...
                          </span>
                        )}
                        {isDone && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Evaluator Audit Card (If evaluated) */}
            {evaluation && (
              <div className="rounded-xl border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/40 dark:bg-cyan-500/5 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
                      {evaluation.fitScore}%
                    </span>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                        Evaluator Fit Score
                      </div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {evaluation.passed ? "✓ Meets Bar-Raiser Threshold" : "Optimized in Feedback Loop"}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-hairline-light dark:border-hairline-dark">
                    ATS Match: {evaluation.atsMatchPercentage}%
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{evaluation.evaluatorVerdict}&rdquo;
                </p>

                {/* Keyword Pills */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                    Found ATS Keywords ({evaluation.foundKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.foundKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Critique / Improvements applied */}
                {evaluation.critiqueNotes && evaluation.critiqueNotes.length > 0 && (
                  <div className="pt-2 border-t border-indigo-100 dark:border-cyan-500/20 text-[11px] space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Feedback Loop Directives Applied:
                    </span>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {evaluation.critiqueNotes.map((note, idx) => (
                        <li key={idx} className="leading-snug">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (7 Cols): RESUME PREVIEW & EXPORTER TOOLBAR
        ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Tabs & Export Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-3 shadow-xs">
            {/* View Switcher */}
            <div className="flex items-center gap-1 rounded-xl bg-subsurface-light dark:bg-subsurface-dark p-1 text-xs">
              <button
                onClick={() => setActiveViewTab("preview")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition ${
                  activeViewTab === "preview"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>ATS Preview</span>
              </button>

              <button
                onClick={() => setActiveViewTab("audit")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition ${
                  activeViewTab === "audit"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Audit Report</span>
              </button>

              <button
                onClick={() => setActiveViewTab("markdown")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition ${
                  activeViewTab === "markdown"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Markdown</span>
              </button>

              <button
                onClick={() => setActiveViewTab("json")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition ${
                  activeViewTab === "json"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>JSON</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                disabled={!generatedResume}
                className="flex items-center gap-1.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-indigo dark:hover:border-brand-cyan transition disabled:opacity-40"
              >
                {copiedType === "markdown" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                disabled={!generatedResume}
                className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3 py-1.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition disabled:opacity-40"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              DISPLAY PANEL: TAB 1 (ATS PREVIEW), TAB 2 (AUDIT), TAB 3 (MARKDOWN), TAB 4 (JSON)
          ========================================================================= */}
          {!generatedResume && !isGenerating && (
            <div className="rounded-2xl border border-dashed border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-12 text-center space-y-3">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                No Tailored Resume Generated Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Select your target JD, check the <strong>AI Gap Collector Chat</strong> to input your GitHub link or custom metrics, and click &ldquo;Generate Tailored Resume&rdquo;.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-12 text-center space-y-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-brand-indigo/10 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan">
                <Sparkles className="h-6 w-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Orchestrating Multi-Agent Resume Chain...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Splicing Chat Ammunition ➔ Evaluating ATS Bar ➔ Looping if needed
                </p>
              </div>
            </div>
          )}

          {generatedResume && (
            <>
              {/* TAB 1: ATS INDUSTRIAL RESUME DOCUMENT VIEW */}
              {activeViewTab === "preview" && (
                <div
                  id="resume-printable-area"
                  className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-8 sm:p-10 shadow-md text-slate-900 dark:text-slate-100 font-sans space-y-6 transition-colors print:p-0 print:border-none print:shadow-none print:bg-white print:text-black"
                >
                  {/* Header / Contact Info */}
                  <div className="border-b border-hairline-light dark:border-hairline-dark pb-4 space-y-1 text-center">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 print:text-black">
                      {generatedResume.contactInfo.name}
                    </h1>
                    <div className="text-xs font-bold text-brand-indigo dark:text-brand-cyan print:text-black">
                      {generatedResume.contactInfo.title} · Bengaluru, India
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 print:text-black">
                      <span>{generatedResume.contactInfo.email}</span>
                      <span>•</span>
                      <span>{generatedResume.contactInfo.phone}</span>
                      <span>•</span>
                      <a
                        href={generatedResume.contactInfo.linkedin?.startsWith("http") ? generatedResume.contactInfo.linkedin : `https://${generatedResume.contactInfo.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-brand-indigo dark:text-brand-cyan print:text-black"
                      >
                        LinkedIn
                      </a>
                      <span>•</span>
                      <a
                        href={generatedResume.contactInfo.github?.startsWith("http") ? generatedResume.contactInfo.github : `https://${generatedResume.contactInfo.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-brand-indigo dark:text-brand-cyan print:text-black"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>

                  {/* Section 1: Professional Summary */}
                  <div className="space-y-1.5">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-hairline-light dark:border-hairline-dark pb-1 print:text-black">
                      Professional Summary
                    </h2>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 print:text-black">
                      {generatedResume.professionalSummary}
                    </p>
                  </div>

                  {/* Section 2: Core Skills */}
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-hairline-light dark:border-hairline-dark pb-1 print:text-black">
                      Technical Skills
                    </h2>
                    <div className="grid gap-1.5 text-xs text-slate-700 dark:text-slate-300 print:text-black">
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold print:text-black">
                          Languages & Frameworks:{" "}
                        </strong>
                        <span>{generatedResume.coreSkills.languagesAndFrameworks.join(", ")}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold print:text-black">
                          Cloud & Infrastructure:{" "}
                        </strong>
                        <span>{generatedResume.coreSkills.cloudAndInfrastructure.join(", ")}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold print:text-black">
                          Databases & Streaming:{" "}
                        </strong>
                        <span>{generatedResume.coreSkills.databasesAndDistributedSystems.join(", ")}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold print:text-black">
                          Architecture & Practices:{" "}
                        </strong>
                        <span>{generatedResume.coreSkills.architectureAndPractices.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Professional Experience */}
                  <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-hairline-light dark:border-hairline-dark pb-1 print:text-black">
                      Work Experience
                    </h2>

                    {generatedResume.workExperience.map((exp) => (
                      <div key={exp.id} className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 print:text-black">
                            {exp.role} <span className="font-normal text-slate-500">at</span> {exp.company}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 print:text-black">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-outside ml-4 leading-relaxed print:text-black">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Section 4: Key Projects */}
                  <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-hairline-light dark:border-hairline-dark pb-1 print:text-black">
                      Key Technical Projects
                    </h2>

                    {generatedResume.keyProjects.map((proj) => (
                      <div key={proj.id} className="space-y-1.5">
                        <div className="flex flex-wrap items-baseline justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 print:text-black">
                              {proj.title}
                            </h3>
                            {proj.link && (
                              <span className="text-[10px] text-slate-400 font-mono">({proj.link})</span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {proj.techStack.slice(0, 3).join(" • ")}
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-outside ml-4 leading-relaxed print:text-black">
                          {proj.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Section 5: Education & Honors */}
                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-hairline-light dark:border-hairline-dark pb-1 print:text-black">
                      Education & Honors
                    </h2>
                    {generatedResume.education.map((edu, idx) => (
                      <div key={idx} className="flex flex-wrap items-baseline justify-between text-xs">
                        <div>
                          <strong className="text-slate-900 dark:text-slate-100 print:text-black">
                            {edu.degree}
                          </strong>{" "}
                          — {edu.institution}
                          {edu.gradeOrDetails && (
                            <span className="text-slate-500 font-mono ml-2">({edu.gradeOrDetails})</span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: DETAILED EVALUATOR AUDIT REPORT */}
              {activeViewTab === "audit" && evaluation && (
                <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Senior Bar-Raiser ATS Evaluation Report
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evaluated against {generatedResume.targetCompany}&apos;s required tech stack and hiring bar.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-brand-indigo dark:text-brand-cyan font-mono">
                        {evaluation.fitScore}%
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {evaluation.passed ? "PASSED ATS BAR" : "REVISED IN FEEDBACK LOOP"}
                      </span>
                    </div>
                  </div>

                  {/* Metrics 4-Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400">ATS Keyword Match</span>
                      <div className="text-lg font-black mt-1 font-mono text-slate-900 dark:text-slate-100">
                        {evaluation.atsMatchPercentage}%
                      </div>
                    </div>

                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Action Verb Bar</span>
                      <div className="text-lg font-black mt-1 text-emerald-600 dark:text-emerald-400">
                        {evaluation.actionVerbRating}
                      </div>
                    </div>

                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Quantified Proofs</span>
                      <div className="text-lg font-black mt-1 font-mono text-slate-900 dark:text-slate-100">
                        {evaluation.quantifiedMetricsCount}+ Spliced
                      </div>
                    </div>

                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Fact-Check Score</span>
                      <div className="text-lg font-black mt-1 font-mono text-emerald-600 dark:text-emerald-400">
                        {evaluation.hallucinationSafetyScore}% Pure
                      </div>
                    </div>
                  </div>

                  {/* Standout Strengths */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Standout Engineering Strengths
                    </h4>
                    <div className="space-y-1.5">
                      {evaluation.strengths.map((str, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 rounded-xl bg-subsurface-light dark:bg-subsurface-dark p-2.5 text-xs text-slate-800 dark:text-slate-200 border border-hairline-light dark:border-hairline-dark"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critique & Self-Correction Log */}
                  {evaluation.critiqueNotes && evaluation.critiqueNotes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Evaluator Critique & Resolution History
                      </h4>
                      <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10 p-3.5 space-y-2 text-xs">
                        <p className="text-slate-700 dark:text-slate-300">
                          The orchestrator evaluator detected the following areas needing reinforcement and re-synthesized the resume in iteration 2:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                          {evaluation.critiqueNotes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RAW MARKDOWN VIEW */}
              {activeViewTab === "markdown" && (
                <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4">
                  <textarea
                    rows={22}
                    readOnly
                    value={generateMarkdown(generatedResume)}
                    className="w-full bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* TAB 4: RAW JSON VIEW */}
              {activeViewTab === "json" && (
                <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4">
                  <textarea
                    rows={22}
                    readOnly
                    value={JSON.stringify(generatedResume, null, 2)}
                    className="w-full bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
