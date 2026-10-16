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
  Tag,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
  Briefcase,
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
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Production Brag Sheet & SDE-2 Interview Story Bank
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              STAR Format Engine
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 max-w-3xl">
            Pre-loaded with your 5 core Fidelity achievements (2.1B+ scale, 90% latency cut, 67% DB insert speedup). Log new wins during your 11 AM – 8 PM shift to crush behavioral and system design interview rounds.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
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
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-white border border-transparent"
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
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 transition-all cursor-pointer"
              onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-400 border border-emerald-500/20 font-bold">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-emerald-300 font-bold border border-slate-700">
                      ⚡ {item.metric}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white pt-1">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyResumeBullet(item, e)}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                    title="Copy 1-line bullet for resume"
                  >
                    {copiedId === `resume-${item.id}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Bullet Copied</span>
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
                    className="flex items-center gap-1 rounded-lg bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all"
                    title="Copy full STAR response for interview"
                  >
                    {copiedId === `star-${item.id}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Answer Copied</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copy STAR Answer</span>
                      </>
                    )}
                  </button>

                  <span className="text-slate-500 p-1">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </div>
              </div>

              {/* STAR Breakdown (Expandable) */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                  {/* STAR 4-box grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                      <div className="font-mono text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                        [S] Situation
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.situation}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                      <div className="font-mono text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                        [T] Task
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.task}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                      <div className="font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        [A] Action Taken
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.action}</p>
                    </div>

                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                      <div className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                        [R] Quantified Result
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.result}</p>
                    </div>
                  </div>

                  {/* Complete STAR Answer preview */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Polished Interview Oral Answer
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      "{item.starSummary}"
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {item.id.startsWith("brag-") && item.id.length > 15 && (
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-700 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-1">Log Production Win (STAR Engine)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Capture your real-time engineering wins during your Fidelity shift to turn into interview stories.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Optimized Kafka consumer group lag during market opens"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Quantified Metric (e.g. 50% Latency Drop, 10M Statements)
                </label>
                <input
                  type="text"
                  required
                  value={newMetric}
                  onChange={(e) => setNewMetric(e.target.value)}
                  placeholder="e.g. Cut consumer lag by 80% and unblocked 5M events"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">[S] Situation</label>
                  <textarea
                    rows={2}
                    required
                    value={newSituation}
                    onChange={(e) => setNewSituation(e.target.value)}
                    placeholder="What was the problem or system bottleneck?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">[T] Task</label>
                  <textarea
                    rows={2}
                    required
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What were you tasked with achieving?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">[A] Action Taken</label>
                  <textarea
                    rows={2}
                    required
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder="What specific architectural or code changes did you implement?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">[R] Result</label>
                  <textarea
                    rows={2}
                    required
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    placeholder="What was the business or technical outcome?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Java 21, Kafka, Redis, AWS"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-600/20"
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
