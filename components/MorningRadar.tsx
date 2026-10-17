"use client";

import React, { useState } from "react";
import { ScrapedJob } from "@/types";
import {
  Radar,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  BookmarkPlus,
  Flame,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  RefreshCw,
  DollarSign,
  Briefcase,
} from "lucide-react";

interface MorningRadarProps {
  jobs: ScrapedJob[];
  onScanNow: () => Promise<void>;
  isScanning: boolean;
  onSaveToPipeline: (job: ScrapedJob) => void;
  onUpdateJobStatus: (jobId: string, status: ScrapedJob["status"]) => void;
}

export function MorningRadar({
  jobs,
  onScanNow,
  isScanning,
  onSaveToPipeline,
  onUpdateJobStatus,
}: MorningRadarProps) {
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterScore, setFilterScore] = useState<number>(0);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [savedJobId, setSavedJobId] = useState<string | null>(null);

  const handleCopyPitch = async (job: ScrapedJob, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(job.aiPitch);
      setCopiedPitchId(job.id);
      setTimeout(() => setCopiedPitchId(null), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyAndApply = async (job: ScrapedJob) => {
    await handleCopyPitch(job);
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    onUpdateJobStatus(job.id, "applied");
  };

  const handleSave = (job: ScrapedJob) => {
    onSaveToPipeline(job);
    setSavedJobId(job.id);
    onUpdateJobStatus(job.id, "saved");
    setTimeout(() => setSavedJobId(null), 2500);
  };

  const filteredJobs = jobs.filter((job) => {
    if (filterLocation === "bengaluru") {
      if (!job.location.toLowerCase().includes("bengaluru") && !job.location.toLowerCase().includes("bangalore")) {
        return false;
      }
    } else if (filterLocation === "chennai") {
      if (!job.location.toLowerCase().includes("chennai")) return false;
    }
    if (filterScore > 0 && job.matchScore < filterScore) return false;
    return true;
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    if (score >= 85) return "border-indigo-300 dark:border-cyan-500/40 bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan";
    return "border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400";
  };

  const getEstimatedSalary = (company: string): string => {
    const compLower = company.toLowerCase();
    if (compLower.includes("stripe")) return "₹45L - ₹65L";
    if (compLower.includes("razorpay")) return "₹34L - ₹48L";
    if (compLower.includes("cred")) return "₹38L - ₹52L";
    if (compLower.includes("postman")) return "₹36L - ₹50L";
    if (compLower.includes("swiggy")) return "₹32L - ₹44L";
    if (compLower.includes("zepto")) return "₹35L - ₹46L";
    if (compLower.includes("uber")) return "₹48L - ₹68L";
    return "₹30L - ₹42L";
  };

  return (
    <div className="space-y-4">
      {/* Action Header & ATS Scanner Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
              <Radar className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              08:30 AM Automated Morning Job Radar
            </h2>
            <span className="rounded-full bg-indigo-50 dark:bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
              Instahyre × ATS Poller + Gemini 2.5
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Scans unauthenticated JSON APIs from Greenhouse & Lever (Stripe, Razorpay, Cred, Postman, Swiggy) for verified SDE-2 Backend roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onScanNow}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning ATS Boards..." : "Scan Live ATS Boards Now"}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Location:</span>
          <button
            onClick={() => setFilterLocation("all")}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
              filterLocation === "all"
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            All Locations ({jobs.length})
          </button>
          <button
            onClick={() => setFilterLocation("bengaluru")}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
              filterLocation === "bengaluru"
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Bengaluru
          </button>
          <button
            onClick={() => setFilterLocation("chennai")}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
              filterLocation === "chennai"
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Chennai
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Match Fit:</span>
          <button
            onClick={() => setFilterScore(0)}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${
              filterScore === 0
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            Any Score
          </button>
          <button
            onClick={() => setFilterScore(90)}
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${
              filterScore === 90
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            🔥 Top Tier (≥90%)
          </button>
        </div>
      </div>

      {/* Scraped Job Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full rounded-2xl p-10 text-center border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 mb-3">
              <Radar className={`h-7 w-7 ${isScanning ? "animate-spin" : ""}`} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Radar Inbox is Clean</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              No jobs in your morning radar inbox. Click below to poll unauthenticated public Greenhouse & Lever boards for fresh Bengaluru & Chennai backend roles.
            </p>
            <div className="mt-4">
              <button
                onClick={onScanNow}
                disabled={isScanning}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-5 py-2.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition-all disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Scanning Live ATS Boards..." : "Scan Live ATS Boards Now"}</span>
              </button>
            </div>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition"
            >
              <div>
                {/* Header Row: Company, Source, Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">
                        {job.company}
                      </span>
                      <span className="rounded bg-subsurface-light dark:bg-subsurface-dark px-2 py-0.5 text-[10px] font-mono uppercase text-slate-600 dark:text-slate-400 border border-hairline-light dark:border-hairline-dark">
                        {job.source}
                      </span>
                      {/* Instahyre-style Upfront Salary Tag */}
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                        {getEstimatedSalary(job.company)}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {job.title}
                    </h3>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className={`flex flex-col items-center justify-center rounded-xl border px-3 py-1 text-center font-mono ${getScoreBadgeColor(
                      job.matchScore
                    )}`}
                  >
                    <span className="text-xs font-black">{job.matchScore}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold">Match</span>
                  </div>
                </div>

                {/* Metadata Row: Location & Scanned Time */}
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {job.postedAt}
                  </span>
                </div>

                {/* Matching Skills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>

                {/* Missing Keywords (ATS Alerts) */}
                {job.missingKeywords && job.missingKeywords.length > 0 && (
                  <div className="mt-2.5 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-2.5">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Missing ATS Keywords (Add to Resume/Pitch):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.missingKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-amber-100 dark:bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-900 dark:text-amber-300 font-mono border border-amber-200 dark:border-amber-500/20"
                        >
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Tailored Pitch Preview */}
                <div className="mt-3 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-indigo dark:text-brand-cyan">
                      <Sparkles className="h-3 w-3" />
                      <span>AI HM Connection Pitch ({job.aiPitch.length}/300 chars)</span>
                    </span>
                    <button
                      onClick={() => handleCopyPitch(job)}
                      className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-indigo dark:hover:text-brand-cyan"
                    >
                      {copiedPitchId === job.id ? (
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
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed line-clamp-3">
                    &ldquo;{job.aiPitch}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSave(job)}
                  className="flex items-center gap-1.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-subsurface-light dark:hover:bg-slate-700 transition"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  <span>{savedJobId === job.id ? "Saved to Pipeline!" : "Save to Pipeline"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyAndApply(job)}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3 py-1.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition"
                  >
                    <span>Copy Pitch & Apply</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
