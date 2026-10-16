"use client";

import React, { useState } from "react";
import { DeepPrepTopic } from "@/types";
import { ROTATING_PREP_TOPICS } from "@/data/seed";
import {
  Code2,
  Cpu,
  ExternalLink,
  BookOpen,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Building,
} from "lucide-react";

interface DeepPrepStudioProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCompletePrep: () => void;
  embedded?: boolean;
}

export function DeepPrepStudio({ isOpen, onClose, onCompletePrep, embedded = false }: DeepPrepStudioProps) {
  // Determine current day of week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayIndex = new Date().getDay();
  const todayDayName = days[currentDayIndex];

  const [selectedDay, setSelectedDay] = useState<string>(todayDayName);
  const [activeTopic, setActiveTopic] = useState<DeepPrepTopic>(
    ROTATING_PREP_TOPICS.find((t) => t.dayOfWeek.toLowerCase() === todayDayName.toLowerCase()) ||
      ROTATING_PREP_TOPICS[0]
  );

  // Gemini on-demand generation state
  const [customKeyword, setCustomKeyword] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [completedNotice, setCompletedNotice] = useState<boolean>(false);

  if (!embedded && !isOpen) return null;

  const handleSelectDay = (dayName: string) => {
    setSelectedDay(dayName);
    const found = ROTATING_PREP_TOPICS.find((t) => t.dayOfWeek.toLowerCase() === dayName.toLowerCase());
    if (found) {
      setActiveTopic(found);
    }
  };

  const handleGenerateCustom = async (keywordPrompt: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: keywordPrompt || customKeyword || "Distributed Systems" }),
      });
      const data = await res.json();
      if (data.success && data.prep) {
        setActiveTopic(data.prep);
        setSelectedDay("Custom AI");
      }
    } catch (err) {
      console.error("Failed to generate custom prep:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkComplete = () => {
    onCompletePrep();
    setCompletedNotice(true);
    setTimeout(() => {
      setCompletedNotice(false);
      if (onClose && !embedded) onClose();
    }, 1200);
  };

  const getDifficultyColor = (diff: DeepPrepTopic["dsaDifficulty"]) => {
    switch (diff) {
      case "Hard":
        return "border-red-500/40 bg-red-500/10 text-red-400";
      case "Medium":
        return "border-amber-500/40 bg-amber-500/10 text-amber-400";
      default:
        return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
    }
  };

  const content = (
    <div className={`glass-panel w-full ${embedded ? "" : "max-w-4xl my-8 max-h-[92vh] overflow-y-auto"} rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-2xl`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Daily Deep Prep Studio
              </h2>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono text-purple-300 font-bold border border-purple-500/20">
                08:30 – 09:15 AM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Curated DSA LeetCode targets + Distributed Systems patterns mapped to Tier-1 SDE-2 interview bars.
            </p>
          </div>
        </div>

        {onClose && !embedded && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

        {/* Day Selector Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex flex-wrap items-center gap-1.5">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => {
              const isToday = d.toLowerCase() === todayDayName.toLowerCase();
              const isSelected = selectedDay.toLowerCase() === d.toLowerCase();

              return (
                <button
                  key={d}
                  onClick={() => handleSelectDay(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-900/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{d.slice(0, 3)}</span>
                  {isToday && <span className="ml-1 text-[9px] text-emerald-400 font-bold">•</span>}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400">
            Selected: <strong className="text-white">{selectedDay}</strong>
          </div>
        </div>

        {/* 2-Column Grid: DSA on Left, Distributed Systems on Right */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* ========================================================
              PART A: DSA PROBLEM OF THE DAY
          ======================================================== */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400">
                  <Code2 className="h-4 w-4" />
                  DSA Target of the Day
                </span>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold ${getDifficultyColor(activeTopic.dsaDifficulty)}`}>
                  {activeTopic.dsaDifficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{activeTopic.dsaTitle}</h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  Pattern: {activeTopic.dsaPattern}
                </span>
              </div>

              {/* Key Insight Box */}
              <div className="rounded-xl border border-purple-500/20 bg-purple-950/10 p-3 mb-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-300 mb-1">
                  <Lightbulb className="h-3.5 w-3.5 text-purple-400" />
                  <span>Key Algorithmic Insight & Edge Cases:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {activeTopic.dsaKeyInsight}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Target Time: 25 mins</span>
              <a
                href={activeTopic.dsaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-1.5 text-xs shadow-md shadow-purple-600/20 transition-all"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* ========================================================
              PART B: DISTRIBUTED SYSTEMS PATTERN
          ======================================================== */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Cpu className="h-4 w-4" />
                  Distributed Systems Pattern
                </span>
                <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {activeTopic.distSysCategory}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{activeTopic.distSysTitle}</h3>

              {/* Architectural Breakdown */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {activeTopic.distSysSummary}
              </p>

              {/* Fidelity Connection */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3 mb-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-1">
                  <Building className="h-3.5 w-3.5" />
                  <span>How to Cite in Interviews (Fidelity Experience):</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {activeTopic.fidelityConnection}
                </p>
              </div>

              {/* Interview Tip */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 mb-0.5">
                  <HelpCircle className="h-3 w-3" />
                  <span>SDE-2 Interview Pro-Tip:</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {activeTopic.interviewTip}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Reading: ~10 mins</span>
              <a
                href={activeTopic.distSysReadingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-1.5 text-xs transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                <span>Open Reading Material</span>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Gemini On-Demand Topic Generator Bar */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              Need a targeted topic right now? (Powered by Gemini 3.8 Flash)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {[
              "Kafka Consumer Groups & Lag",
              "Redis Distributed Locks & Redlock",
              "Consistent Hashing & DynamoDB",
              "Dynamic Programming (0/1 Knapsack)",
              "Graph Cycle Detection & Bipartite",
              "Database Deadlocks & MVCC",
            ].map((kw) => (
              <button
                key={kw}
                onClick={() => handleGenerateCustom(kw)}
                disabled={isGenerating}
                className="rounded-lg bg-slate-800 hover:bg-purple-900/40 hover:text-purple-300 text-slate-300 border border-slate-700/80 px-2.5 py-1 text-[11px] transition-colors disabled:opacity-50"
              >
                + {kw}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
              placeholder="Or type any topic (e.g. Rate Limiting, Trie, Cassandra)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={() => handleGenerateCustom(customKeyword)}
              disabled={isGenerating || !customKeyword.trim()}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 text-xs transition-all disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Generating..." : "Generate Target"}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          {completedNotice ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Check className="h-4 w-4" />
              Deep Prep marked complete in Daily Routine!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Complete your prep block to maintain your daily sprint streak.
            </span>
          )}

          <div className="flex items-center gap-2">
            {onClose && !embedded && (
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
            )}
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Today's Prep Complete</span>
            </button>
          </div>
        </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      {content}
    </div>
  );
}
