"use client";

import React, { useState } from "react";
import { BragItem } from "@/types";
import {
  Award,
  Sparkles,
  Copy,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface BragSheetProps {
  items: BragItem[];
  onSaveItem: (item: BragItem) => void;
  onDeleteItem: (id: string) => void;
}

export function BragSheet({ items, onSaveItem, onDeleteItem }: BragSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(items[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New item form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<BragItem["category"]>("Performance");
  const [newMetric, setNewMetric] = useState("");
  const [newSituation, setNewSituation] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newResult, setNewResult] = useState("");
  const [newTags, setNewTags] = useState("");

  const handleCopyStar = async (item: BragItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.starSummary);
      setCopiedId(`star-${item.id}`);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyResumeBullet = async (item: BragItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.resumeBullet);
      setCopiedId(`resume-${item.id}`);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMetric) return;

    const star = `When faced with ${newSituation}, my task was to ${newTask}. I ${newAction}, which resulted in ${newResult}.`;
    const bullet = `${newTitle}: ${newResult} by ${newAction}.`;

    const newItem: BragItem = {
      id: `brag-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      metric: newMetric,
      situation: newSituation,
      task: newTask,
      action: newAction,
      result: newResult,
      starSummary: star,
      resumeBullet: bullet,
      tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      dateAdded: new Date().toISOString().split("T")[0],
    };

    onSaveItem(newItem);
    setShowAddModal(false);
    // Reset form
    setNewTitle("");
    setNewMetric("");
    setNewSituation("");
    setNewTask("");
    setNewAction("");
    setNewResult("");
    setNewTags("");
  };

  const categories = ["All", "Scaling", "Performance", "Database", "Resilience", "Cloud Architecture"];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <Award className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Production Brag Sheet & Technical Interview Story Bank
            </h2>
            <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              STAR Format Engine
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
            Pre-loaded with your core Fidelity achievements (2.1B+ scale, 90% latency cut, 67% DB insert speedup). Log new wins during your office shift to crush behavioral and system design interview rounds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Log New Production Win</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === cat
                ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs font-bold"
                : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {cat} ({cat === "All" ? items.length : items.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Brag Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedItemId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition cursor-pointer"
              onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 font-bold">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/30">
                      ⚡ {item.metric}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 pt-1">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyResumeBullet(item, e)}
                    className="flex items-center gap-1 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-cyan transition"
                    title="Copy 1-line bullet for resume"
                  >
                    {copiedId === `resume-${item.id}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Bullet Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Resume Bullet</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={(e) => handleCopyStar(item, e)}
                    className="flex items-center gap-1 rounded-xl bg-brand-indigo/10 dark:bg-brand-cyan/15 border border-brand-indigo/30 dark:border-cyan-500/30 px-2.5 py-1 text-xs font-bold text-brand-indigo dark:text-brand-cyan hover:opacity-90 transition"
                    title="Copy full STAR response for interview"
                  >
                    {copiedId === `star-${item.id}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Answer Copied</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Copy STAR Answer</span>
                      </>
                    )}
                  </button>

                  <span className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </div>
              </div>

              {/* STAR Breakdown (Expandable) */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-hairline-light dark:border-hairline-dark space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                  {/* STAR 4-box grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <div className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                        [S] Situation
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.situation}</p>
                    </div>

                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <div className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                        [T] Task
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.task}</p>
                    </div>

                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <div className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                        [A] Action Taken
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.action}</p>
                    </div>

                    <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3">
                      <div className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                        [R] Quantified Result
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.result}</p>
                    </div>
                  </div>

                  {/* Complete STAR Answer preview */}
                  <div className="rounded-xl border border-indigo-200 dark:border-cyan-500/20 bg-indigo-50/60 dark:bg-[#070E1A] p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-brand-indigo dark:text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Polished Interview Oral Answer
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed bg-white dark:bg-[#0C1728] p-2.5 rounded-lg border border-hairline-light dark:border-hairline-dark">
                      &ldquo;{item.starSummary}&rdquo;
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-subsurface-light dark:bg-subsurface-dark px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 font-mono border border-hairline-light dark:border-hairline-dark"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {item.id.startsWith("brag-") && item.id.length > 15 && (
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Item</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Win Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Log Production Win (STAR Engine)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Capture real-time engineering wins during your Fidelity shift to turn into interview stories.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Optimized Kafka consumer group lag during market opens"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="Scaling">Scaling</option>
                    <option value="Performance">Performance</option>
                    <option value="Database">Database</option>
                    <option value="Resilience">Resilience</option>
                    <option value="Cloud Architecture">Cloud Architecture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Quantified Metric (e.g. 50% Latency Drop, 10M Statements)
                </label>
                <input
                  type="text"
                  required
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  placeholder="e.g. Cut consumer lag by 80% and unblocked 5M events"
                  className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-brand-indigo dark:text-brand-cyan font-bold focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">[S] Situation</label>
                  <textarea
                    rows={2}
                    required
                    value={newSituation}
                    onChange={(e) => setNewSituation(e.target.value)}
                    placeholder="What was the problem or system bottleneck?"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">[T] Task</label>
                  <textarea
                    rows={2}
                    required
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What were you tasked with achieving?"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">[A] Action Taken</label>
                  <textarea
                    rows={2}
                    required
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder="What specific architectural or code changes did you implement?"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">[R] Result</label>
                  <textarea
                    rows={2}
                    required
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    placeholder="What was the business or technical outcome?"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Java 21, Kafka, Redis, AWS"
                  className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-hairline-light dark:border-hairline-dark">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-indigo dark:bg-brand-cyan hover:opacity-95 px-5 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs transition"
                >
                  Save to Brag Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
