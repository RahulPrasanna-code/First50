"use client";

import React, { useState } from "react";
import { buildLinkedInSearchUrl } from "@/lib/utils";
import {
  Zap,
  ExternalLink,
  Target,
  Sliders,
  Clock,
} from "lucide-react";

export function Past4HoursStrike() {
  const [customKeywords, setCustomKeywords] = useState<string>(
    "Java Backend OR Spring Boot OR Distributed Systems"
  );
  const [customLocation, setCustomLocation] = useState<string>("Bengaluru");
  const [customTimeWindow, setCustomTimeWindow] = useState<"r3600" | "r14400" | "r86400" | "r604800">(
    "r14400"
  );
  const [customExpLevel, setCustomExpLevel] = useState<string>("2,3");

  const PRESET_QUERIES = [
    {
      title: "Bengaluru Java / Distributed Systems (Past 4 Hours)",
      desc: "Top Tier FinTech & Product GCCs in Bangalore posted this morning.",
      location: "Bengaluru",
      keywords: "Java Backend OR Spring Boot OR Distributed Systems",
      timeRange: "r14400" as const,
      exp: "2,3",
      tag: "Prime BLR Strike",
    },
    {
      title: "Chennai Java / AWS Microservices (Past 4 Hours)",
      desc: "Cloud platform & backend roles in Chennai (Amazon, Paypal, Chargebee, GCCs).",
      location: "Chennai",
      keywords: "Java Backend OR Microservices OR AWS",
      timeRange: "r14400" as const,
      exp: "2,3",
      tag: "Prime MAA Strike",
    },
    {
      title: "All-India Tier-1 Software Engineer & Backend (Past 24 Hours)",
      desc: "Fresh Software Engineer lateral openings nationwide before recruiter queue hits 300+.",
      location: "India",
      keywords: "Software Engineer OR Backend Engineer",
      timeRange: "r86400" as const,
      exp: "2,3",
      tag: "Tier-1 Lateral",
    },
    {
      title: "Instahyre Direct Match Opportunities",
      desc: "Curated AI outbound opportunities matching your profile and target stack.",
      url: "https://www.instahyre.com/candidate/opportunities/?matching=true",
      tag: "Instahyre Radar",
    },
  ];

  const handleLaunchPreset = (preset: (typeof PRESET_QUERIES)[0]) => {
    if ("url" in preset && preset.url) {
      window.open(preset.url, "_blank", "noopener,noreferrer");
      return;
    }

    const url = buildLinkedInSearchUrl({
      keywords: preset.keywords,
      location: preset.location,
      timeRange: preset.timeRange,
      experienceLevel: preset.exp,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLaunchCustom = () => {
    const url = buildLinkedInSearchUrl({
      keywords: customKeywords,
      location: customLocation,
      timeRange: customTimeWindow,
      experienceLevel: customExpLevel,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const generatedCustomUrl = buildLinkedInSearchUrl({
    keywords: customKeywords,
    location: customLocation,
    timeRange: customTimeWindow,
    experienceLevel: customExpLevel,
  });

  return (
    <div className="space-y-6">
      {/* Strategy Banner */}
      <div className="relative overflow-hidden rounded-2xl p-5 border border-indigo-200 dark:border-cyan-500/30 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 dark:from-[#0C1728] dark:via-[#091220] dark:to-[#070E1A] shadow-xs transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-indigo/15 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan">
                <Zap className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                The 09:15 AM &quot;Past 4 Hours&quot; Fast Strike
              </h2>
              <span className="rounded-full bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
                f_TPR=r14400
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Applying more than 4 hours after a JD goes live puts you behind 500+ applicants. Recruiters in India log in between <strong>9:45 AM and 10:15 AM IST</strong> to screen the top of their ATS queue. Launching these pre-configured hidden filters guarantees your CV is in the <strong>First 50</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-3 text-xs shadow-2xs">
            <Clock className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Target Strike Window</div>
              <div className="font-mono font-bold text-brand-indigo dark:text-brand-cyan">09:15 AM – 09:45 AM IST</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset 1-Click Strike Launchers */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Target className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
            1-Click Strike Launchers
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Opens direct search with hidden parameters</span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {PRESET_QUERIES.map((preset, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="rounded-md bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
                    {preset.tag}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {"timeRange" in preset ? (preset.timeRange === "r14400" ? "< 4 Hours" : "< 24 Hours") : "Curated"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{preset.title}</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{preset.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-end">
                <button
                  onClick={() => handleLaunchPreset(preset)}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 px-3.5 py-1.5 text-xs font-bold transition shadow-xs hover:opacity-95"
                >
                  <span>Launch Strike Search</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Strike URL Builder */}
      <div className="rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Custom Strike URL Builder</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Keywords */}
          <div className="col-span-full lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Search Keywords & Boolean Query
            </label>
            <div className="relative">
              <input
                type="text"
                value={customKeywords}
                onChange={(e) => setCustomKeywords(e.target.value)}
                placeholder="e.g. Java Backend OR Spring Boot OR Distributed Systems"
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCustomKeywords("Java Backend OR Spring Boot OR Distributed Systems")}
                className="rounded-lg bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 hover:opacity-80"
              >
                + Java/Distributed
              </button>
              <button
                type="button"
                onClick={() => setCustomKeywords("AWS Cloud Platform OR Kubernetes OR KEDA")}
                className="rounded-lg bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 hover:opacity-80"
              >
                + AWS/K8s/KEDA
              </button>
              <button
                type="button"
                onClick={() => setCustomKeywords("Software Engineer OR Backend Engineer")}
                className="rounded-lg bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 hover:opacity-80"
              >
                + Backend Software Engineer
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <select
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
            >
              <option value="Bengaluru">Bengaluru, India</option>
              <option value="Chennai">Chennai, India</option>
              <option value="India">All India</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Time Window */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Time Window (LinkedIn Hidden Param)
            </label>
            <select
              value={customTimeWindow}
              onChange={(e) => setCustomTimeWindow(e.target.value as any)}
              className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-brand-indigo dark:text-brand-cyan font-mono font-semibold focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
            >
              <option value="r3600">Past 1 Hour (f_TPR=r3600)</option>
              <option value="r14400">Past 4 Hours (f_TPR=r14400) ★ Recommended</option>
              <option value="r86400">Past 24 Hours (f_TPR=r86400)</option>
              <option value="r604800">Past 1 Week (f_TPR=r604800)</option>
            </select>
          </div>
        </div>

        {/* Live URL & Launch Action */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline-light dark:border-hairline-dark">
          <div className="max-w-xl truncate text-[11px] font-mono text-slate-400">
            {generatedCustomUrl}
          </div>

          <button
            onClick={handleLaunchCustom}
            className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan hover:opacity-95 text-white dark:text-slate-950 px-4 py-2 text-xs font-bold shadow-xs transition"
          >
            <span>Launch Configured Strike</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
