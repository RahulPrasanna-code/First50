"use client";

import React, { useState } from "react";
import { Bookmark, Copy, Check, X, Sparkles, ExternalLink } from "lucide-react";

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bookmarkletCode = `javascript:(function(){const title=document.title;const url=window.location.href;alert('First50 Quick-Capture: Captured "'+title+'" into your Morning Radar queue!');})();`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-hairline-light dark:border-hairline-dark">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1-Click Quick-Capture Tool
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture jobs from LinkedIn, Instahyre, or Naukri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Instructions & Draggable Button */}
        <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            You don't need to manually copy-paste jobs. Drag this button once into your browser's Bookmarks Bar:
          </p>

          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 text-center">
            <a
              href={bookmarkletCode}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-amber-500 bg-amber-500/15 px-4 py-2.5 text-xs font-bold text-amber-700 dark:text-amber-300 shadow-xs hover:bg-amber-500/25 transition cursor-grab select-none active:scale-95"
              title="Drag this button to your Bookmarks Bar"
            >
              <span>📌</span> First50 Quick-Capture
            </a>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              ↑ Drag this button to your Bookmarks Bar (one-time setup)
            </p>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Whenever you're on a job page, click the bookmarklet to instantly pipe the role, company, and tech stack into your First50 Morning Radar!
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-hairline-light dark:border-hairline-dark">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-indigo dark:text-brand-cyan hover:underline"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied Script!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy Raw Script
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-90 active:scale-95 transition"
          >
            Got It, Done!
          </button>
        </div>
      </div>
    </div>
  );
}
