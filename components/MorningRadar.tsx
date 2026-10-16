"use client";

import React, { useState } from "react";
import { ScrapedJob, Application } from "@/types";
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
    if (score >= 90) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
    if (score >= 85) return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
    return "border-amber-500/40 bg-amber-500/10 text-amber-400";
  };

  return (
    <div className="space-y-4">
      {/* Action Header & ATS Scanner Controls */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radar className={`h-4 w-4 ${isScanning ? "animate-spin text-emerald-300" : ""}`} />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              8:30 AM Automated Morning Job Radar
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              Live ATS Poller + Gemini 2.5 Flash
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Directly scans unauthenticated JSON APIs from Greenhouse & Lever (Stripe, Razorpay, Cred, Postman, Chargebee, Rubrik) for fresh Backend roles before recruiters review portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onScanNow}
            disabled={isScanning}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Scanning ATS Boards..." : "Scan Live ATS Boards Now"}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Location:</span>
          <button
            onClick={() => setFilterLocation("all")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filterLocation === "all"
                ? "bg-slate-700 text-white"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            All Locations ({jobs.length})
          </button>
          <button
            onClick={() => setFilterLocation("bengaluru")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filterLocation === "bengaluru"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            Bengaluru
          </button>
          <button
            onClick={() => setFilterLocation("chennai")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filterLocation === "chennai"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            Chennai
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Match Fit:</span>
          <button
            onClick={() => setFilterScore(0)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              filterScore === 0 ? "bg-slate-700 text-white" : "bg-slate-900/60 text-slate-400"
            }`}
          >
            Any Score
          </button>
          <button
            onClick={() => setFilterScore(90)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
              filterScore === 90
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-900/60 text-slate-400"
            }`}
          >
            🔥 Top Tier (≥90%)
          </button>
        </div>
      </div>

      {/* Scraped Job Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredJobs.length === 0 ? (
          <div className="glass-panel col-span-full rounded-2xl p-10 text-center border border-slate-800">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Radar className={`h-7 w-7 ${isScanning ? "animate-spin text-emerald-300" : ""}`} />
            </div>
            <h3 className="text-base font-bold text-white">Radar Inbox is Clean</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No jobs in your morning radar inbox. Click below to poll unauthenticated public Greenhouse & Lever boards for fresh Bengaluru & Chennai backend roles.
            </p>
            <div className="mt-4">
              <button
                onClick={onScanNow}
                disabled={isScanning}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-60"
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
              className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-5 border border-slate-800"
            >
              <div>
                {/* Header Row: Company, Source, Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base tracking-tight">
                        {job.company}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase text-slate-400 border border-slate-700">
                        {job.source}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-200 leading-snug">
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
                    <span className="text-[9px] uppercase tracking-wider font-semibold">Fit</span>
                  </div>
                </div>

                {/* Metadata Row: Location & Scanned Time */}
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {job.postedAt}
                  </span>
                </div>

                {/* Matching Skills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>

                {/* Missing Keywords (ATS Alerts) */}
                {job.missingKeywords && job.missingKeywords.length > 0 && (
                  <div className="mt-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Missing ATS Keywords (Add to Resume/Pitch):</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.missingKeywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-300 font-mono"
                        >
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Tailored Pitch Preview */}
                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-400">
                      <Sparkles className="h-3 w-3" />
                      <span>AI HM Connection Pitch ({job.aiPitch.length}/300 chars)</span>
                    </span>
                    <button
                      onClick={() => handleCopyPitch(job)}
                      className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-emerald-400"
                    >
                      {copiedPitchId === job.id ? (
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
                  <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                    "{job.aiPitch}"
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleSave(job)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
                >
                  <BookmarkPlus className="h-3.5 w-3.5 text-slate-400" />
                  <span>{savedJobId === job.id ? "Saved to Pipeline!" : "Save to Pipeline"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyAndApply(job)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500"
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
