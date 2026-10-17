"use client";

import React from "react";
import { Radar, Zap, Code2, Send, Layers, Award, AlertTriangle } from "lucide-react";

interface DesktopNavProps {
  activeTab: "radar" | "strike" | "pitch" | "pipeline" | "brag" | "prep";
  onTabChange: (tab: "radar" | "strike" | "pitch" | "pipeline" | "brag" | "prep") => void;
  radarCount: number;
  pipelineCount: number;
  bragCount: number;
  followUpDueCount: number;
}

export function DesktopNav({
  activeTab,
  onTabChange,
  radarCount,
  pipelineCount,
  bragCount,
  followUpDueCount,
}: DesktopNavProps) {
  return (
    <nav
      className="hidden md:flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark bg-white/80 dark:bg-[#070E1A]/80 backdrop-blur-md px-4 sm:px-8 py-2 text-xs"
      aria-label="Desktop Tab Navigation"
    >
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {/* Tab 1: Morning Radar */}
        <button
          onClick={() => onTabChange("radar")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
            activeTab === "radar"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Radar className="h-4 w-4" />
          <span>Morning Radar</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
            activeTab === "radar"
              ? "bg-white/20 text-white dark:text-slate-950"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}>
            {radarCount}
          </span>
        </button>

        {/* Tab 2: 9:15 AM Fast Strike */}
        <button
          onClick={() => onTabChange("strike")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
            activeTab === "strike"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>9:15 AM Fast Strike</span>
          <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono ${
            activeTab === "strike"
              ? "bg-white/20 text-white dark:text-slate-950"
              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          }`}>
            f_TPR
          </span>
        </button>

        {/* Tab 3: Daily Deep Prep Studio */}
        <button
          onClick={() => onTabChange("prep")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
            activeTab === "prep"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Daily Deep Prep</span>
          <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono ${
            activeTab === "prep"
              ? "bg-white/20 text-white dark:text-slate-950"
              : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
          }`}>
            45m
          </span>
        </button>

        {/* Tab 4: HM Pitch Studio */}
        <button
          onClick={() => onTabChange("pitch")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
            activeTab === "pitch"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Send className="h-4 w-4" />
          <span>HM Pitch Studio</span>
          <span className={`rounded px-1.5 py-0.2 text-[9px] font-mono ${
            activeTab === "pitch"
              ? "bg-white/20 text-white dark:text-slate-950"
              : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
          }`}>
            AI
          </span>
        </button>

        {/* Tab 5: 72h Pipeline Tracker */}
        <button
          onClick={() => onTabChange("pipeline")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
            activeTab === "pipeline"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>72h Pipeline</span>
          {followUpDueCount > 0 && (
            <span className="flex items-center gap-0.5 rounded-full bg-rose-500/15 px-1.5 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-2.5 w-2.5" />
              {followUpDueCount} Due
            </span>
          )}
        </button>

        {/* Tab 6: STAR Brag Sheet */}
        <button
          onClick={() => onTabChange("brag")}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
            activeTab === "brag"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>STAR Brag Sheet</span>
          <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
            activeTab === "brag"
              ? "bg-white/20 text-white dark:text-slate-950"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}>
            {bragCount}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        <span>Auto-synced with IST Schedule</span>
      </div>
    </nav>
  );
}
