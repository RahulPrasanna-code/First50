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
} from "lucide-react";

interface PitchStudioProps {
  profile: UserProfile;
  onSaveToPipeline: (app: Partial<Application>) => void;
}

export function PitchStudio({ profile, onSaveToPipeline }: PitchStudioProps) {
  const [activeTab, setActiveTab] = useState<"instant" | "analyzer">("instant");

  // Tab 1 state: Instant Template Pitch
  const [recipientName, setRecipientName] = useState<string>("Arun");
  const [targetCompany, setTargetCompany] = useState<string>("Stripe");
  const [targetRoleId, setTargetRoleId] = useState<string>("SDE-2 Core Backend (#6192831)");
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
  const [jdCompany, setJdCompany] = useState<string>("Razorpay");
  const [jdRoleTitle, setJdRoleTitle] = useState<string>("Software Development Engineer II - Core Payments");
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
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Module Title & Tab Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              High-Signal HM Pitch Studio & Deep JD Analyzer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate punchy, metric-backed pitches for Engineering Managers before submitting portal applications.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab("instant")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "instant"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Instant Template Pitch</span>
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "analyzer"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient / EM Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Arun"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Company
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Stripe, Razorpay"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Job ID
              </label>
              <input
                type="text"
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                placeholder="e.g. SDE-2 Backend (#6192831)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Generated Pitch Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-400" />
                LinkedIn Connection Note (Max 300 Chars)
              </span>

              {/* Live Character Counter */}
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full border ${
                    instantLength <= 280
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : instantLength <= 300
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {instantLength} / 300 characters
                </span>

                <button
                  onClick={handleCopyInstant}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3 py-1 text-xs font-bold transition-all shadow-md"
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

            <p className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              "{generatedTemplatePitch}"
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Why this works: Cites 2.1B+ scale, 90% latency reduction & B.Tech 9.1 CGPA.</span>
              <a
                href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
                  `Engineering Manager ${targetCompany}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Find EMs at {targetCompany || "Company"} on LinkedIn</span>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
              <input
                type="text"
                value={jdCompany}
                onChange={(e) => setJdCompany(e.target.value)}
                placeholder="e.g. Razorpay, Postman"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                value={jdRoleTitle}
                onChange={(e) => setJdRoleTitle(e.target.value)}
                placeholder="e.g. Software Development Engineer II"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Raw Job Description Text
            </label>
            <textarea
              rows={6}
              value={rawJdText}
              onChange={(e) => setRawJdText(e.target.value)}
              placeholder="Paste the full job description here (responsibilities, required skills, YoE requirements)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {analysisError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleAnalyzeJD}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>{isAnalyzing ? "Running Gemini Deep Analysis..." : "Analyze with Gemini AI"}</span>
            </button>
            <span className="text-xs text-slate-500">Evaluates Fit Score, YoE Gate, ATS Keywords & Pitches</span>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="mt-6 space-y-5 rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5">
              {/* Score & YoE Gate Header */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Fit Score */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 font-mono text-xl font-black text-emerald-400">
                    {analysisResult.fitScore}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Overall Profile Fit
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Evaluated against Rahul's Java, AWS, KEDA & PostgreSQL distributed systems stack.
                    </p>
                  </div>
                </div>

                {/* YoE Gate Check */}
                <div
                  className={`flex items-center gap-3 rounded-xl border p-4 ${
                    analysisResult.yoeGatePassed
                      ? "border-emerald-500/30 bg-emerald-950/20"
                      : "border-amber-500/30 bg-amber-950/20"
                  }`}
                >
                  <div className="shrink-0">
                    {analysisResult.yoeGatePassed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="h-6 w-6 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider ${
                        analysisResult.yoeGatePassed ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      YoE Gate Check: {analysisResult.yoeGatePassed ? "Passed (2+ YoE)" : "YoE Caution"}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                      {analysisResult.yoeGateDetails}
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing ATS Keywords */}
              {analysisResult.missingKeywords.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Missing ATS Keywords to Add to Resume for this JD:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300 font-mono border border-amber-500/20"
                      >
                        +{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI LinkedIn Connection Pitch (<300 chars) */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                    <Linkedin className="h-3.5 w-3.5 text-blue-400" />
                    Customized LinkedIn Note ({analysisResult.linkedinPitch.length}/300 chars)
                  </span>
                  <button
                    onClick={handleCopyAiPitch}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-emerald-400"
                  >
                    {copiedPitch ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Pitch</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  "{analysisResult.linkedinPitch}"
                </p>
              </div>

              {/* Cold Email to Hiring Manager */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-emerald-400" />
                    120-Word Cold Email to Hiring Manager
                  </span>
                  <button
                    onClick={handleCopyAiEmail}
                    className="flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-emerald-400"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-sans text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                  {analysisResult.coldEmail}
                </pre>
              </div>

              {/* Save to Pipeline Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={handleSaveAnalyzedToPipeline}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 text-xs shadow-lg shadow-emerald-600/20 transition-all"
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
