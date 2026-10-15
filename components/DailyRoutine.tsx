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
} from "lucide-react";

interface DailyRoutineProps {
  tasks: DailyRoutineTask[];
  onToggleTask: (taskId: string) => void;
  onResetDay: () => void;
  onNavigateTab: (tabId: "radar" | "strike" | "pitch" | "pipeline") => void;
}

export function DailyRoutine({
  tasks,
  onToggleTask,
  onResetDay,
  onNavigateTab,
}: DailyRoutineProps) {
  const getTaskIcon = (category: DailyRoutineTask["category"]) => {
    switch (category) {
      case "prep":
        return <Code2 className="h-4 w-4 text-purple-400" />;
      case "strike":
        return <Zap className="h-4 w-4 text-emerald-400" />;
      case "refresh":
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case "dm":
        return <Send className="h-4 w-4 text-blue-400" />;
      case "office":
        return <Briefcase className="h-4 w-4 text-slate-400" />;
      case "pipeline":
        return <Layers className="h-4 w-4 text-cyan-400" />;
      default:
        return <Zap className="h-4 w-4 text-emerald-400" />;
    }
  };

  const handleActionClick = (task: DailyRoutineTask) => {
    if (task.actionUrl) {
      window.open(task.actionUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (task.category === "strike") {
      onNavigateTab("strike");
    } else if (task.category === "dm") {
      onNavigateTab("pitch");
    } else if (task.category === "pipeline") {
      onNavigateTab("pipeline");
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-800">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide">
              Daily Shift Protocol
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              11 AM – 8 PM Shift Tailored
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict time-blocked execution to bypass 500+ applicant queues before office shift.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDay}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Sprint</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`group relative flex flex-col justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
              task.completed
                ? "border-emerald-500/30 bg-emerald-950/20 opacity-80"
                : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60"
            }`}
          >
            <div>
              {/* Header: Timeblock & Checkbox */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400">
                  {getTaskIcon(task.category)}
                  {task.timeBlock}
                </span>

                <button
                  type="button"
                  aria-label="Toggle task completion"
                  className="text-slate-400 transition-transform group-hover:scale-110"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400" />
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <h3
                className={`text-sm font-semibold transition-colors ${
                  task.completed ? "text-slate-400 line-through" : "text-white"
                }`}
              >
                {task.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Quick Action Button */}
            {task.actionLabel && (
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(task);
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
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
