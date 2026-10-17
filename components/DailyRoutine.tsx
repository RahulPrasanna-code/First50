"use client";

import React from "react";
import { DailyRoutineTask } from "@/types";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  RotateCcw,
  Zap,
  Code2,
  Send,
  Briefcase,
  Layers,
  Sparkles,
  BatteryCharging,
} from "lucide-react";

interface DailyRoutineProps {
  tasks: DailyRoutineTask[];
  onToggleTask: (taskId: string) => void;
  onResetDay: () => void;
  onNavigateTab: (tabId: "radar" | "strike" | "pitch" | "pipeline" | "brag" | "prep") => void;
  onOpenPrepStudio?: () => void;
  energyLevel?: "high" | "med" | "low";
  onEnergyChange?: (level: "high" | "med" | "low") => void;
}

export function DailyRoutine({
  tasks,
  onToggleTask,
  onResetDay,
  onNavigateTab,
  onOpenPrepStudio,
  energyLevel = "high",
  onEnergyChange,
}: DailyRoutineProps) {
  const getTaskIcon = (category: DailyRoutineTask["category"]) => {
    switch (category) {
      case "prep":
        return <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case "strike":
        return <Zap className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />;
      case "refresh":
        return <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "dm":
        return <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "office":
        return <Briefcase className="h-4 w-4 text-slate-500 dark:text-slate-400" />;
      case "pipeline":
        return <Layers className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <Zap className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />;
    }
  };

  const handleActionClick = (task: DailyRoutineTask) => {
    if (task.actionUrl) {
      window.open(task.actionUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (task.category === "prep") {
      onNavigateTab("prep");
      if (onOpenPrepStudio) onOpenPrepStudio();
    } else if (task.category === "office") {
      onNavigateTab("brag");
    } else if (task.category === "strike") {
      onNavigateTab("strike");
    } else if (task.category === "dm") {
      onNavigateTab("pitch");
    } else if (task.category === "pipeline") {
      onNavigateTab("pipeline");
    }
  };

  // Filter or prioritize tasks based on Energy Level
  const visibleTasks = tasks.filter((t) => {
    if (energyLevel === "low") {
      // In Low Mode: Only show 09:15 AM First Strike
      return t.category === "strike";
    }
    if (energyLevel === "med") {
      // In Med Mode: Strike, Naukri refresh, and DM pitch
      return t.category === "strike" || t.category === "refresh" || t.category === "dm";
    }
    return true; // High Mode: All tasks
  });

  const completedCount = visibleTasks.filter((t) => t.completed).length;

  return (
    <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 sm:p-6 shadow-xs transition-colors">
      
      {/* Card Header: Title & Energy Level Switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-hairline-light dark:border-hairline-dark">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Daily Work Plan (IST)
            </h2>
            <span className="rounded-full bg-indigo-50 dark:bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
              {completedCount} / {visibleTasks.length} Completed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {energyLevel === "low"
              ? "Zero-Guilt Mode: Just 1 high-impact action today to keep momentum 100% alive."
              : energyLevel === "med"
              ? "Core Focus Mode: 3 essential actions prioritized before office work."
              : "Strict time-blocked execution to bypass 500+ applicant queues before office shift."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* In-Card Energy Level Selector */}
          {onEnergyChange && (
            <div className="flex items-center gap-1 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-1 text-xs">
              <span className="hidden sm:inline px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">Energy:</span>
              <button
                onClick={() => onEnergyChange("high")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  energyLevel === "high"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                ⚡ High
              </button>
              <button
                onClick={() => onEnergyChange("med")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  energyLevel === "med"
                    ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                🔋 Med
              </button>
              <button
                onClick={() => onEnergyChange("low")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  energyLevel === "low"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                🪫 Low
              </button>
            </div>
          )}

          <button
            onClick={onResetDay}
            className="flex items-center gap-1.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-subsurface-light dark:hover:bg-slate-700 transition"
            title="Reset today's checks"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Low Energy Mode Guilt-Free Message Banner */}
      {energyLevel === "low" && (
        <div className="mb-4 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <BatteryCharging className="h-4 w-4" />
            <span>Low Energy Mode Active</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            Heavy day-job sprint? No problem. Non-essential tasks are paused. Complete just <strong>09:15 AM Fast Strike</strong> below and your day is a 100% win. Daily streak maintained! 🔥
          </p>
        </div>
      )}

      {/* Tasks Grid (Touch target ≥ 48px) */}
      <div className={`grid gap-3.5 ${energyLevel === "low" ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"}`}>
        {visibleTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer min-h-[110px] ${
              task.completed
                ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/20 opacity-80"
                : "border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40"
            }`}
          >
            <div>
              {/* Header: Timeblock & Checkbox */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-brand-indigo dark:text-brand-cyan">
                  {getTaskIcon(task.category)}
                  {task.timeBlock}
                </span>

                <button
                  type="button"
                  aria-label="Toggle task completion"
                  className="transition-transform group-hover:scale-110 p-1"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400 dark:text-slate-600 group-hover:text-brand-indigo dark:group-hover:text-brand-cyan" />
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <h3
                className={`text-sm font-semibold transition-colors ${
                  task.completed ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {task.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Quick Action Button */}
            {task.actionLabel && (
              <div className="mt-3 pt-2.5 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(task);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-brand-indigo dark:text-brand-cyan hover:underline"
                >
                  <span>{task.actionLabel}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
