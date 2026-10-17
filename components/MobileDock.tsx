"use client";

import React from "react";
import { Radar, Zap, Code2, Send, Award, User as UserIcon } from "lucide-react";

interface MobileDockProps {
  activeTab: "radar" | "strike" | "pitch" | "pipeline" | "brag" | "prep";
  onTabChange: (tab: "radar" | "strike" | "pitch" | "pipeline" | "brag" | "prep") => void;
  onOpenProfile: () => void;
}

export function MobileDock({ activeTab, onTabChange, onOpenProfile }: MobileDockProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-hairline-light dark:border-hairline-dark bg-white/95 dark:bg-[#091220]/95 backdrop-blur-lg px-4 py-2 md:hidden flex items-center justify-around text-[10px] font-medium safe-bottom shadow-lg"
      aria-label="Mobile Navigation Dock"
    >
      {/* Tab 1: Radar */}
      <button
        onClick={() => onTabChange("radar")}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === "radar"
            ? "font-bold text-brand-indigo dark:text-brand-cyan"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Radar className="h-5 w-5" />
        <span>Radar</span>
      </button>

      {/* Tab 2: Strike */}
      <button
        onClick={() => onTabChange("strike")}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === "strike"
            ? "font-bold text-brand-indigo dark:text-brand-cyan"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Zap className="h-5 w-5" />
        <span>Strike</span>
      </button>

      {/* Tab 3: Deep Prep */}
      <button
        onClick={() => onTabChange("prep")}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === "prep"
            ? "font-bold text-brand-indigo dark:text-brand-cyan"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Code2 className="h-5 w-5" />
        <span>Deep Prep</span>
      </button>

      {/* Tab 4: Pitches */}
      <button
        onClick={() => onTabChange("pitch")}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === "pitch"
            ? "font-bold text-brand-indigo dark:text-brand-cyan"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        }`}
      >
        <Send className="h-5 w-5" />
        <span>Pitches</span>
      </button>

      {/* Tab 5: Profile / Settings */}
      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
      >
        <UserIcon className="h-5 w-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
}
