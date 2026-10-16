"use client";

import React from "react";
import { Sparkles, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";

interface GuestBannerProps {
  onSignIn: () => void;
  onBackToLanding: () => void;
}

export function GuestBanner({ onSignIn, onBackToLanding }: GuestBannerProps) {
  return (
    <aside aria-label="Guest preview banner" className="sticky top-0 z-50 border-b border-purple-500/30 bg-gradient-to-r from-purple-950/90 via-slate-900/95 to-slate-900/90 px-4 py-2 text-xs backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300 border border-purple-500/30">
            <Sparkles className="h-3 w-3 text-purple-400" />
            Guest Demo Mode
          </span>
          <span className="text-slate-300 text-[11px] sm:text-xs">
            Exploring with sanitized demo data. Changes stay in this browser only.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Landing Page</span>
          </button>

          <button
            onClick={onSignIn}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-[11px] font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
          >
            <UserCheck className="h-3 w-3" />
            <span>Sign In to Save Private Data</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
