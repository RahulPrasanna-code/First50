"use client";

import React, { useState } from "react";
import { UserProfile, JDAnalysisResult, Application } from "@/types";
import {
  Send,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  BookmarkPlus,
  RefreshCw,
  FileText,
  Mail,
  Linkedin,
  ShieldAlert,
  Code,
  Eye,
} from "lucide-react";

interface PitchStudioProps {
  profile: UserProfile;
  onSaveToPipeline: (app: Partial<Application>) => void;
}

export function PitchStudio({ profile, onSaveToPipeline }: PitchStudioProps) {
  const [activeTab, setActiveTab] = useState<"instant" | "analyzer">("instant");
  const [showDiffView, setShowDiffView] = useState<boolean>(true);

  // Tab 1 state: Instant Template Pitch
  const [recipientName, setRecipientName] = useState<string>("");
  const [targetCompany, setTargetCompany] = useState<string>("");
  const [targetRoleId, setTargetRoleId] = useState<string>("");
  const [copiedInstant, setCopiedInstant] = useState<boolean>(false);

  // Generate dynamic template pitch
  const generatedTemplatePitch = `Hi ${recipientName || "[Name]"}, saw your team scaling ${
    targetCompany || "[Company]"
  }'s backend platform. I'm a Software Engineer at Fidelity (B.Tech IT '24, 9.1 CGPA) running Java/K8s microservices processing 2.1B+ annual communications—recently cut batch latency 90% via KEDA + partitioned PostgreSQL. Role ${
    targetRoleId || "[Job ID]"
  } aligns closely with my AWS/distributed systems work. Before I apply on the portal, would you be open to dropping a quick referral or passing my CV to the HM?`;

  const instantLength = generatedTemplatePitch.length;

  const handleCopyInstant = async () => {
    try {
      await navigator.clipboard.writeText(generatedTemplatePitch);
      setCopiedInstant(true);
      setTimeout(() => setCopiedInstant(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Tab 2 state: Gemini Deep JD Analyzer
  const [jdCompany, setJdCompany] = useState<string>("");
  const [jdRoleTitle, setJdRoleTitle] = useState<string>("");
  const [rawJdText, setRawJdText] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<JDAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [savedToPipeline, setSavedToPipeline] = useState<boolean>(false);

  const handleAnalyzeJD = async () => {
    if (!rawJdText.trim()) {
      setAnalysisError("Please paste a Job Description before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch("/api/ai/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: rawJdText,
          company: jdCompany,
          roleTitle: jdRoleTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze Job Description");
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setAnalysisError(err.message || "An error occurred while analyzing the JD.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyAiPitch = async () => {
    if (!analysisResult?.linkedinPitch) return;
    await navigator.clipboard.writeText(analysisResult.linkedinPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleCopyAiEmail = async () => {
    if (!analysisResult?.coldEmail) return;
    await navigator.clipboard.writeText(analysisResult.coldEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSaveAnalyzedToPipeline = () => {
    if (!analysisResult) return;
    onSaveToPipeline({
      company: jdCompany,
      roleTitle: jdRoleTitle,
      jobIdOrUrl: "Analyzed JD",
      location: "Bengaluru",
      status: "HM DM Sent",
      contactName: `Engineering Manager (${jdCompany})`,
      pitchUsed: analysisResult.linkedinPitch,
      notes: `Fit Score: ${analysisResult.fitScore}%. Missing ATS Keywords: ${analysisResult.missingKeywords.join(", ")}`,
    });
    setSavedToPipeline(true);
    setTimeout(() => setSavedToPipeline(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 sm:p-6 shadow-xs space-y-6 transition-colors">
      {/* Module Title & Tab Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline-light dark:border-hairline-dark pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-brand-indigo dark:text-brand-cyan" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              High-Signal HM Pitch Studio & Deep JD Analyzer
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate punchy, metric-backed pitches for Engineering Managers before submitting portal applications.
          </p>
        </div>

        <div className="flex rounded-xl bg-subsurface-light dark:bg-subsurface-dark p-1 border border-hairline-light dark:border-hairline-dark">
          <button
            onClick={() => setActiveTab("instant")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "instant"
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Instant Template Pitch</span>
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "analyzer"
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Gemini Deep JD Analyzer</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: INSTANT TEMPLATE PITCH (<300 CHARS)
      ========================================================================= */}
      {activeTab === "instant" && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recipient / EM Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Arun"
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Company
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Stripe, Razorpay"
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role / Job ID
              </label>
              <input
                type="text"
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                placeholder="e.g. SDE-2 Backend (#6192831)"
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Generated Pitch Box */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-500" />
                LinkedIn Connection Note (Max 300 Chars)
              </span>

              {/* View Switcher: Raw Text vs Spliced Diff */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-subsurface-light dark:bg-subsurface-dark p-0.5 border border-hairline-light dark:border-hairline-dark">
                  <button
                    type="button"
                    onClick={() => setShowDiffView(true)}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      showDiffView
                        ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Match Diff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDiffView(false)}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      !showDiffView
                        ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Code className="h-3 w-3" />
                    <span>Raw Text</span>
                  </button>
                </div>

                {/* Live Character Counter */}
                <span
                  className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    instantLength <= 280
                      ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : instantLength <= 300
                      ? "border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                  }`}
                >
                  {instantLength} / 300
                </span>

                <button
                  onClick={handleCopyInstant}
                  className="flex items-center gap-1 rounded-xl bg-brand-indigo dark:bg-brand-cyan hover:opacity-95 text-white dark:text-slate-950 px-3 py-1.5 text-xs font-bold transition shadow-xs active:scale-95"
                >
                  {copiedInstant ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Note</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Pitch Body: Diff Highlighting vs Clean Text */}
            {showDiffView ? (
              <div className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-subsurface-light dark:bg-subsurface-dark p-3.5 rounded-xl border border-hairline-light dark:border-hairline-dark">
                Hi {recipientName || "[Name]"}, saw your team scaling{" "}
                <span className="diff-req font-bold">{targetCompany || "[Company]"}&apos;s backend platform</span>. I&apos;m a Software Engineer at Fidelity (B.Tech IT &apos;24, 9.1 CGPA) running{" "}
                <span className="diff-req font-bold">Java/K8s microservices</span> processing{" "}
                <span className="diff-proof font-bold">2.1B+ annual communications</span>—recently{" "}
                <span className="diff-proof font-bold">cut batch latency 90% via KEDA + partitioned PostgreSQL</span>. Role {targetRoleId || "[Job ID]"} aligns closely with my{" "}
                <span className="diff-req font-bold">AWS/distributed systems</span> work. Before I apply on the portal, would you be open to dropping a quick referral or passing my CV to the HM?
              </div>
            ) : (
              <p className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-subsurface-light dark:bg-subsurface-dark p-3.5 rounded-xl border border-hairline-light dark:border-hairline-dark select-all">
                &ldquo;{generatedTemplatePitch}&rdquo;
              </p>
            )}

            {/* Diff Splicer Legend & LinkedIn Quick Link */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-hairline-light dark:border-hairline-dark">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-brand-indigo dark:text-brand-cyan font-semibold">
                  <span className="h-2 w-2 rounded-full bg-brand-indigo dark:bg-brand-cyan"></span>
                  Target Tech Stack (Requirement)
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Fidelity Production Metric (Proof)
                </span>
              </div>
              <a
                href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
                  `Engineering Manager ${targetCompany}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-indigo dark:text-brand-cyan hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Find EMs at {targetCompany || "Target Company"} on LinkedIn</span>
                <Send className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GEMINI DEEP JD ANALYZER
      ========================================================================= */}
      {activeTab === "analyzer" && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
              <input
                type="text"
                value={jdCompany}
                onChange={(e) => setJdCompany(e.target.value)}
                placeholder="e.g. Razorpay, Postman"
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                value={jdRoleTitle}
                onChange={(e) => setJdRoleTitle(e.target.value)}
                placeholder="e.g. Software Development Engineer II"
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Raw Job Description Text
            </label>
            <textarea
              rows={6}
              value={rawJdText}
              onChange={(e) => setRawJdText(e.target.value)}
              placeholder="Paste the full job description here (responsibilities, required skills, YoE requirements)..."
              className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
            />
          </div>

          {analysisError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleAnalyzeJD}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-5 py-2.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition-all disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "Running Gemini Deep Analysis..." : "Analyze with Gemini AI"}</span>
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">Evaluates Fit Score, YoE Gate, ATS Keywords & Pitches</span>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="mt-6 space-y-5 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-5 shadow-xs">
              {/* Score & YoE Gate Header */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Fit Score */}
                <div className="flex items-center gap-4 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-indigo/30 dark:border-cyan-500/30 bg-indigo-50 dark:bg-cyan-500/10 font-mono text-xl font-black text-brand-indigo dark:text-brand-cyan">
                    {analysisResult.fitScore}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Overall Profile Fit
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      Evaluated against Rahul&apos;s Java, AWS, KEDA & PostgreSQL distributed systems stack.
                    </p>
                  </div>
                </div>

                {/* YoE Gate Check */}
                <div
                  className={`flex items-center gap-3 rounded-xl border p-4 ${
                    analysisResult.yoeGatePassed
                      ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-amber-300 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20"
                  }`}
                >
                  <div className="shrink-0">
                    {analysisResult.yoeGatePassed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider ${
                        analysisResult.yoeGatePassed ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      YoE Gate Check: {analysisResult.yoeGatePassed ? "Passed (2+ YoE)" : "YoE Caution"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                      {analysisResult.yoeGateDetails}
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing ATS Keywords */}
              {analysisResult.missingKeywords.length > 0 && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 mb-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Missing ATS Keywords to Add to Resume for this JD:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 text-xs text-amber-900 dark:text-amber-300 font-mono border border-amber-200 dark:border-amber-500/20"
                      >
                        +{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI LinkedIn Connection Pitch (<300 chars) */}
              <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-brand-indigo dark:text-brand-cyan">
                    <Linkedin className="h-3.5 w-3.5 text-blue-500" />
                    Customized LinkedIn Note ({analysisResult.linkedinPitch.length}/300 chars)
                  </span>
                  <button
                    onClick={handleCopyAiPitch}
                    className="flex items-center gap-1 rounded bg-white dark:bg-slate-800 border border-hairline-light dark:border-hairline-dark px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-cyan transition"
                  >
                    {copiedPitch ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Pitch</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-[#070E1A] p-2.5 rounded-lg border border-hairline-light dark:border-hairline-dark">
                  &ldquo;{analysisResult.linkedinPitch}&rdquo;
                </p>
              </div>

              {/* Cold Email to Hiring Manager */}
              <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-brand-indigo dark:text-brand-cyan" />
                    120-Word Cold Email to Hiring Manager
                  </span>
                  <button
                    onClick={handleCopyAiEmail}
                    className="flex items-center gap-1 rounded bg-white dark:bg-slate-800 border border-hairline-light dark:border-hairline-dark px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-cyan transition"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-sans text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-[#070E1A] p-3 rounded-lg border border-hairline-light dark:border-hairline-dark whitespace-pre-wrap leading-relaxed">
                  {analysisResult.coldEmail}
                </pre>
              </div>

              {/* Save to Pipeline Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={handleSaveAnalyzedToPipeline}
                  className="flex items-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 font-bold px-4 py-2 text-xs shadow-xs hover:opacity-95 transition"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span>{savedToPipeline ? "Saved to Application Pipeline!" : "Save to Application Pipeline"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
