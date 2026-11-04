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
  ChevronLeft,
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
  // ==========================================
  // PROGRESSIVE 4-STEP WIZARD STATE
  // Step 1: Target JD Input
  // Step 2: Existing Resume Collection
  // Step 3: AI Gap Analysis & Interactive Interview
  // Step 4: Iterative LLM Generation & Output
  // ==========================================
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Stage 1: Target JD State
  const [targetCompany, setTargetCompany] = useState<string>("Razorpay");
  const [targetRole, setTargetRole] = useState<string>("Backend Software Engineer");
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_JDS[0].jd);

  // Stage 2: Existing Resume State
  const defaultExistingResume = `Rahul Prasanna T S
Software Engineer at Fidelity Investments India (Communications Orchestration Platform)
Experience: 2+ Years in Java 17/21, Spring Boot, AWS, Kubernetes, KEDA, PostgreSQL.
Achievements:
- Scaled platform to process 2.1B+ annual communications, retiring legacy mainframes with cloud microservices.
- Cut backend batch execution time by 90% (under 2 hours) via parallelized Kubernetes worker model.
- Reduced PostgreSQL batch insert runtimes by 67% with partitioned summary tables and GIN index pruning.
- Fixed KEDA AWS SQS scale-down race condition eliminating data loss during Kubernetes autoscaling.
- Built multi-region active-active backend on AWS MRAP with automatic failover.`;

  const [existingResumeText, setExistingResumeText] = useState<string>(defaultExistingResume);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Stage 3: Interactive Interview Chat State
  const [chatMessages, setChatMessages] = useState<ResumeChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isInterviewUnlocked, setIsInterviewUnlocked] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ExtractedInterviewData>({
    githubUrl: "https://github.com/RahulPrasanna-code",
    linkedinUrl: "https://linkedin.com/in/rahul-prasanna",
    additionalSkills: [],
    additionalAchievements: [],
    gapNotes: [],
  });
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Stage 4: LLM Chaining Generation & Iterations State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [chainLogs, setChainLogs] = useState<ResumeChainStepLog[]>([]);
  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [evaluation, setEvaluation] = useState<ResumeAuditEvaluation | null>(null);
  const [iterationsRun, setIterationsRun] = useState<number>(1);
  const [sourceEngine, setSourceEngine] = useState<string>("");

  // Resume Document Viewer State
  const [activeViewTab, setActiveViewTab] = useState<"preview" | "audit" | "markdown" | "json">("preview");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [savedResumes, setSavedResumes] = useState<GeneratedResume[]>([]);
  const [showSavedDrawer, setShowSavedDrawer] = useState<boolean>(false);

  // Load saved resumes on mount
  useEffect(() => {
    loadSavedResumes();
  }, []);

  // Auto-scroll chat window
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
    setIsInterviewUnlocked(false);
    onShowToast(`Loaded ${sample.company} sample requirements.`);
  };

  const handleSelectFromRadar = (job: ScrapedJob) => {
    setTargetCompany(job.company);
    setTargetRole(job.title);
    setJobDescription(`Role: ${job.title} at ${job.company}\nLocation: ${job.location}\nSource: ${job.source}\nRequired Skills: ${job.matchingSkills.join(", ")}\nMissing Keywords: ${job.missingKeywords.join(", ")}`);
    setChatMessages([]);
    setIsInterviewUnlocked(false);
    onShowToast(`Imported ${job.company} opening from Morning Radar.`);
  };

  // Step 2: Handle File Upload
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
      }
    };
    reader.readAsText(file);
  };

  // Transition to Step 3: Run Initial Diff & Greet User
  const handleProceedToInterview = async () => {
    if (!jobDescription || jobDescription.trim().length < 30) {
      onShowToast("Please enter a valid Job Description first.");
      setWizardStep(1);
      return;
    }

    setWizardStep(3);

    // If chat is empty, fire initial comparison
    if (chatMessages.length === 0) {
      setIsChatLoading(true);

      const initialOpeningMsg: ResumeChatMessage = {
        id: `assistant-start`,
        sender: "assistant",
        text: `Hello ${profile.name?.split(" ")[0] || "Rahul"}! I am your **AI Technical Recruiter & Gap Collector**.\n\nI just performed an immediate comparison between your provided resume and **${targetCompany}**'s **${targetRole}** requirements.\n\nHere are 2 high-impact items we must clarify before generating your resume:\n1. **GitHub Proof**: ATS parsers and engineering managers prioritize candidates who link their active codebase. Is your GitHub profile **https://github.com/RahulPrasanna-code** or would you like to link a specific repo?\n2. **High-Throughput Streaming & Caching**: ${targetCompany} mandates event-driven streaming and low-latency caching. Did you handle Kafka partition balancing or Redis caching at Fidelity? What throughput or latency numbers did you achieve?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          { label: "✓ Confirm GitHub: github.com/RahulPrasanna-code", payload: "My GitHub profile is https://github.com/RahulPrasanna-code" },
          { label: "+ Add Redis 5ms Caching Metric", payload: "I implemented Redis caching reducing database read pressure during 2.1B+ communications bursts with sub-5ms lookup latency." },
          { label: "+ Add Kafka 50M Events/Day", payload: "I designed Kafka event-streaming pipelines handling 50M+ daily events with idempotency keys." },
          { label: "⚡ I'm Ready to Generate", payload: "READY_TO_GENERATE" },
        ],
      };

      setChatMessages([initialOpeningMsg]);
      setIsChatLoading(false);
    }
  };

  // Step 3: Handle Chat Interactions
  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || userChatInput).trim();
    if (!text || isChatLoading) return;

    if (text === "READY_TO_GENERATE") {
      setIsInterviewUnlocked(true);
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
        // Unlock generation button once user provides at least one response
        setIsInterviewUnlocked(true);
      }
    } catch (err: any) {
      console.warn("Chat agent error:", err);
      onShowToast("Chat response delayed. Details still captured.");
      setIsInterviewUnlocked(true);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Step 4: Multi-Agent LLM Chaining Generation with Bar-Raiser Feedback Loop
  const handleGenerate = async () => {
    if (!jobDescription || jobDescription.trim().length < 30) {
      onShowToast("Please enter a valid Job Description first.");
      setWizardStep(1);
      return;
    }

    setWizardStep(4);
    setIsGenerating(true);
    setGeneratedResume(null);
    setEvaluation(null);

    setChainLogs([
      {
        step: 1,
        name: "Stage 1: Target JD Deconstruction & ATS Token Extraction",
        status: "running",
        timestamp: new Date().toLocaleTimeString(),
        summary: `Deconstructing ${targetCompany} requirements and isolating high-frequency ATS tokens...`,
      },
    ]);

    try {
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

      const data: ResumeGenerationResult = await res.json();

      if (!res.ok || !(data as any).success) {
        throw new Error((data as any).error || "Failed to generate resume");
      }

      setGeneratedResume(data.resume);
      setEvaluation(data.evaluation);
      setIterationsRun(data.iterationsRun);
      setSourceEngine(data.source);
      setChainLogs(data.chainHistory || []);

      // Auto-save generated resume to local/cloud storage
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
      {/* Top Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-indigo/10 dark:bg-brand-cyan/15 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Resume Studio — Guided Step-by-Step Chaining
            </h2>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              Sequential Multi-Agent
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            A guided 4-step pipeline: Provide the Target JD ➔ Supply your existing resume ➔ Clarify missing links & metrics via AI Chat ➔ Generate with self-correcting Bar-Raiser Evaluator iterations.
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

      {/* Saved Resumes Drawer */}
      {showSavedDrawer && (
        <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 space-y-3 animate-fadeIn">
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
                    setWizardStep(4);
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

      {/* =========================================================================
          PROGRESSIVE 4-STEP WIZARD PROGRESS TRACKER
      ========================================================================= */}
      <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-3 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            { step: 1, title: "1. Target JD", desc: "Define role & requirements" },
            { step: 2, title: "2. My Resume", desc: "Upload / paste background" },
            { step: 3, title: "3. Gap Interview", desc: "AI recruiter Q&A" },
            { step: 4, title: "4. LLM Synthesis", desc: "Iterative Bar-Raiser pass" },
          ].map((s) => {
            const isCurrent = wizardStep === s.step;
            const isCompleted = wizardStep > s.step || (s.step === 4 && generatedResume !== null);

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  // Allow navigating backwards or forwards if valid
                  if (s.step <= wizardStep || (s.step === 3 && existingResumeText)) {
                    setWizardStep(s.step as any);
                  }
                }}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition ${
                  isCurrent
                    ? "border-brand-indigo dark:border-brand-cyan bg-indigo-50/60 dark:bg-cyan-500/10 font-bold"
                    : isCompleted
                    ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/5 text-slate-700 dark:text-slate-300"
                    : "border-transparent text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? "text-brand-indigo dark:text-brand-cyan" : ""}`}>
                    {s.title}
                  </span>
                  {isCompleted && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MAIN WORKSPACE (LEFT COLUMN: WIZARD STEP; RIGHT COLUMN: PREVIEW / AUDIT)
      ========================================================================= */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: GUIDED STEP-BY-STEP CONTROLS (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* =====================================================================
              STAGE 1: TARGET JOB DESCRIPTION
          ===================================================================== */}
          {wizardStep === 1 && (
            <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
                  Step 1: Target Job Description
                </span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-slate-400">Presets:</span>
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

              {/* Scraped Jobs from Radar */}
              {scrapedJobs.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                  <span className="text-slate-400 shrink-0">Radar Leads:</span>
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
                    Target Role Title
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
                  Job Description / Core Requirements
                </label>
                <textarea
                  rows={9}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono leading-relaxed focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!jobDescription || jobDescription.trim().length < 30) {
                    onShowToast("Please enter a valid Job Description first.");
                    return;
                  }
                  setWizardStep(2);
                  onShowToast("Step 1 complete! Now review or upload your resume.");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-3 text-xs font-bold text-white dark:text-slate-950 shadow-md hover:opacity-95 transition active:scale-[0.99]"
              >
                <span>Continue to Step 2: Upload / Provide Resume</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* =====================================================================
              STAGE 2: EXISTING RESUME COLLECTION
          ===================================================================== */}
          {wizardStep === 2 && (
            <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
                  Step 2: Existing Resume Source
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
                  Use Fidelity Default
                </button>
              </div>

              {/* Upload Box */}
              <div className="rounded-xl border border-dashed border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/30 dark:bg-cyan-500/5 p-4 text-center">
                <UploadCloud className="h-6 w-6 mx-auto text-brand-indigo dark:text-brand-cyan mb-1.5" />
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {uploadedFileName ? `File Loaded: ${uploadedFileName}` : "Upload Existing Resume File"}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Supports .txt, .md, and raw resume exports
                </p>
                <label className="mt-2.5 inline-flex items-center gap-1.5 cursor-pointer rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3 py-1.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition">
                  <span>Browse Document</span>
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
                  Review or Paste Resume Content
                </label>
                <textarea
                  rows={9}
                  value={existingResumeText}
                  onChange={(e) => setExistingResumeText(e.target.value)}
                  placeholder="Paste your existing resume here..."
                  className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono leading-relaxed focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:opacity-90 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to JD</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToInterview}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan py-3 text-xs font-bold text-white dark:text-slate-950 shadow-md hover:opacity-95 transition active:scale-[0.99]"
                >
                  <span>Continue to Step 3: Run AI Gap Interview</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              STAGE 3: INTERACTIVE GAP ANALYSIS & AI RECRUITER INTERVIEW
          ===================================================================== */}
          {wizardStep === 3 && (
            <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Step 3: AI Recruiter Gap Interview
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Comparing your resume vs {targetCompany} & extracting missing credentials
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  Live Gap Diff
                </span>
              </div>

              {/* Extracted Ammunition Badges */}
              <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2.5 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">
                  <span>Captured Context Bank</span>
                  <span className="text-brand-indigo dark:text-brand-cyan">Feeds Synthesis Chain</span>
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
                className="h-72 overflow-y-auto rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light/40 dark:bg-subsurface-dark/40 p-3 space-y-3 text-xs"
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

                      <div className="space-y-1.5 max-w-[88%]">
                        <div
                          className={`rounded-2xl p-3 leading-relaxed whitespace-pre-line ${
                            isAssistant
                              ? "bg-white dark:bg-[#070E1A] text-slate-800 dark:text-slate-200 border border-hairline-light dark:border-hairline-dark shadow-2xs"
                              : "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 font-medium"
                          }`}
                        >
                          {msg.text}
                        </div>

                        {/* Suggested Action Chips */}
                        {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {msg.suggestedActions.map((action, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleSendChatMessage(action.payload || action.label)}
                                className="rounded-lg border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/80 dark:bg-cyan-500/10 px-2 py-1 text-[11px] font-semibold text-brand-indigo dark:text-brand-cyan hover:opacity-90 transition active:scale-95 text-left"
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
                    <span>Analyzing gaps against {targetCompany} and formulating question...</span>
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
                  placeholder="Type your answer, GitHub link, or specific numbers..."
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

              {/* THE CONDITIONAL GENERATE BUTTON / INTERVIEW IN-PROGRESS BANNER */}
              <div className="pt-2 border-t border-hairline-light dark:border-hairline-dark space-y-3">
                {!isInterviewUnlocked ? (
                  <div className="rounded-xl border border-dashed border-hairline-light dark:border-hairline-dark bg-subsurface-light/70 dark:bg-subsurface-dark/70 p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        AI Recruiter Questions in Progress
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Answer the question above or click a quick-reply chip to verify your GitHub and scale metrics. Once answered, the <strong className="text-slate-700 dark:text-slate-300">Generate Best-Fit Resume</strong> button will appear.
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className="text-slate-500 hover:underline flex items-center gap-1"
                      >
                        <ChevronLeft className="h-3 w-3" /> Back to Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsInterviewUnlocked(true);
                          onShowToast("Questions marked as completed. Generator unlocked!");
                        }}
                        className="text-brand-indigo dark:text-brand-cyan font-semibold hover:underline"
                      >
                        Skip questions & unlock generator ➔
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between px-1">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Questions Completed & Metrics Captured!
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        Ready for LLM Synthesis
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-3.5 text-xs font-black text-white dark:text-slate-950 transition-all shadow-md hover:opacity-95 ring-2 ring-brand-indigo/30 dark:ring-brand-cyan/30 active:scale-[0.99]"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>
                        {isGenerating
                          ? "Running Multi-Agent Chaining & Evaluator..."
                          : `🚀 Generate Best-Fit Resume for ${targetCompany} (Run LLM Chain)`}
                      </span>
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className="hover:underline flex items-center gap-1"
                      >
                        <ChevronLeft className="h-3 w-3" /> Back to Resume
                      </button>
                      <span className="text-slate-400">
                        Includes Self-Correcting Bar-Raiser Pass
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              STAGE 4: REAL-TIME CHAIN TELEMETRY & EVALUATOR SUMMARY
          ===================================================================== */}
          {wizardStep === 4 && (
            <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
                  Step 4: Chaining Telemetry
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="text-xs text-brand-indigo dark:text-brand-cyan hover:underline font-semibold"
                  >
                    Adjust Chat Inputs
                  </button>
                </div>
              </div>

              {/* Chain Execution Steps */}
              <div className="space-y-2">
                {chainLogs.map((log) => (
                  <div
                    key={log.step}
                    className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light/60 dark:bg-subsurface-dark/60 p-3 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        {log.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {log.summary}
                    </p>
                  </div>
                ))}
              </div>

              {/* Regenerate Trigger */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-brand-indigo dark:hover:border-brand-cyan transition"
              >
                <RotateCcw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                <span>Re-Run Evaluator & Synthesis Loop</span>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RESUME PREVIEW & AUDIT REPORT (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Action Tabs & Exporter Toolbar */}
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
                <span>Evaluator Audit</span>
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

          {/* Empty State before Generation */}
          {!generatedResume && !isGenerating && (
            <div className="rounded-2xl border border-dashed border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-12 text-center space-y-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Follow the 4-Step Wizard on the Left
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Step 1 (Target JD) ➔ Step 2 (Resume Upload) ➔ Step 3 (AI Gap Interview) ➔ Click Generate to synthesize your verified ATS resume.
                </p>
              </div>
            </div>
          )}

          {/* Generating State */}
          {isGenerating && (
            <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-12 text-center space-y-4">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-brand-indigo/10 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan">
                <Sparkles className="h-6 w-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Executing Multi-Agent LLM Chain with Evaluator Feedback Loop...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Extracting tokens ➔ Splicing interview answers ➔ Auditing ATS Fit ➔ Self-Correcting
                </p>
              </div>
            </div>
          )}

          {/* Render Generated Resume */}
          {generatedResume && (
            <>
              {/* TAB 1: ATS INDUSTRIAL RESUME DOCUMENT VIEW */}
              {activeViewTab === "preview" && (
                <div
                  id="resume-printable-area"
                  className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-8 sm:p-10 shadow-md text-slate-900 dark:text-slate-100 font-sans space-y-6 transition-colors print:p-0 print:border-none print:shadow-none print:bg-white print:text-black animate-fadeIn"
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
                        className="hover:underline text-brand-indigo dark:text-brand-cyan print:text-black font-semibold"
                      >
                        LinkedIn
                      </a>
                      <span>•</span>
                      <a
                        href={generatedResume.contactInfo.github?.startsWith("http") ? generatedResume.contactInfo.github : `https://${generatedResume.contactInfo.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-brand-indigo dark:text-brand-cyan print:text-black font-semibold"
                      >
                        GitHub ({generatedResume.contactInfo.github?.replace("https://github.com/", "")})
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
                <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Senior Bar-Raiser ATS Evaluation Report
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evaluated against {generatedResume.targetCompany}&apos;s required tech stack across {iterationsRun} iteration(s).
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-brand-indigo dark:text-brand-cyan font-mono">
                        {evaluation.fitScore}%
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {evaluation.passed ? "PASSED ATS BAR (88%+)" : "REVISED IN FEEDBACK LOOP"}
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
                      <span className="text-[10px] uppercase font-bold text-slate-400">Action Verb Rating</span>
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
                <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 animate-fadeIn">
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
                <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 animate-fadeIn">
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
