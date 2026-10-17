"use client";

import React, { useState } from "react";
import { Logo, LogoIcon } from "@/components/Logo";
import { useTheme } from "@/lib/ThemeContext";
import {
  Radar,
  Zap,
  Send,
  Layers,
  Award,
  Code2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Cpu,
  Flame,
  Sun,
  Moon,
  Laptop,
  Check,
  Bookmark,
  Bell,
  Terminal,
  Circle,
  BatteryCharging,
} from "lucide-react";

interface LandingPageProps {
  onExploreDemo: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onExploreDemo, onSignIn }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeMiniTab, setActiveMiniTab] = useState<"radar" | "routine" | "diff">("radar");
  const [mockLowEnergy, setMockLowEnergy] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    "task-1": true,
    "task-2": false,
  });

  const toggleMockTask = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-slate-100 selection:bg-brand-indigo/20 dark:selection:bg-cyan-500/20 transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-hairline-light dark:border-hairline-dark bg-white/90 dark:bg-[#070E1A]/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          
          {/* Logo with New Modern Mark */}
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50 dark:bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-indigo dark:text-brand-cyan">
              v2.4 Command Center
            </span>
          </div>

          {/* Right Navigation & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Sun/Moon) */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#0C1728] text-slate-700 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-cyan transition shadow-2xs active:scale-95"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={onExploreDemo}
              className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-brand-indigo dark:hover:border-brand-cyan shadow-2xs"
            >
              Try Live Demo
            </button>

            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-4 py-1.5 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition active:scale-95"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 lg:pt-20 lg:pb-24">
        {/* Soft Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(79,70,229,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(6,182,212,0.14),rgba(0,0,0,0))]"></div>

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/80 dark:bg-cyan-500/10 px-4 py-1 text-xs font-bold text-brand-indigo dark:text-brand-cyan shadow-2xs backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The First-50 Rule: Recruiter ATS Queue Bypass System</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-slate-900 dark:text-slate-100">
            Bypass the 500+ Queue.{" "}
            <span className="block mt-1 bg-gradient-to-r from-brand-indigo via-purple-600 to-brand-cyan dark:from-brand-cyan dark:via-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Land Your Next Career Offer.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The intelligent career command center built to help anyone land faster. By asking the right questions, First50 personalizes your search, uncovers fresh opportunities before the crowd arrives, and structures a calm daily routine that turns job hunting into consistent progress.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onSignIn}
              className="flex items-center gap-2.5 rounded-2xl bg-brand-indigo dark:bg-brand-cyan px-6 py-3.5 text-sm font-bold text-white dark:text-slate-950 shadow-md hover:opacity-95 transition-all hover:scale-[1.02] active:scale-95"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Get Started with Google</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="flex items-center gap-2 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 shadow-xs transition-all hover:border-brand-indigo dark:hover:border-brand-cyan hover:scale-[1.02] active:scale-95"
            >
              <span>Explore Interactive Demo</span>
              <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] text-brand-indigo dark:text-brand-cyan font-mono font-semibold">
                No Sign-in
              </span>
            </button>
          </div>

          {/* Social Proof & Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              100% Free & Open-First
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-indigo dark:text-brand-cyan" />
              Tailored by Asking the Right Questions
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              Zero-Guilt Daily Habit Engine
            </span>
          </div>
        </div>

        {/* =========================================================================
            CUTE DESKTOP WINDOW FRAME SHOWCASE
            With macOS Chrome, Micro-Pills & Interactive Workspace
        ========================================================================= */}
        <div className="relative mx-auto mt-12 max-w-5xl">
          
          {/* Cute Floating Micro-Desktop Badge 1 (Top Left) */}
          <div className="hidden lg:flex absolute -left-6 top-10 z-20 items-center gap-2 rounded-2xl border border-indigo-200 dark:border-cyan-500/30 bg-white/95 dark:bg-[#0C1728]/95 p-3 shadow-xl backdrop-blur-md animate-bounce duration-1000">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-indigo/15 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Strike Parameter</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">f_TPR=r14400 (&lt;4h)</div>
            </div>
          </div>

          {/* Cute Floating Micro-Desktop Badge 2 (Top Right) */}
          <div className="hidden lg:flex absolute -right-6 top-16 z-20 items-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-white/95 dark:bg-[#0C1728]/95 p-3 shadow-xl backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Resilience Recovery</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">Quota: 19/25 Strikes 🔥</div>
            </div>
          </div>

          {/* Cute Floating Micro-Desktop Badge 3 (Bottom Left) */}
          <div className="hidden lg:flex absolute -left-8 bottom-12 z-20 items-center gap-2 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-white/95 dark:bg-[#0C1728]/95 p-3 shadow-xl backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
              <Bookmark className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400">1-Click Quick-Capture</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">LinkedIn · Instahyre</div>
            </div>
          </div>

          {/* The Desktop Application Frame */}
          <div className="overflow-hidden rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xl transition-colors">
            
            {/* macOS Chrome Header Bar */}
            <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-[#08111D] px-4 py-3">
              {/* Traffic Lights */}
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 shadow-xs"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500 shadow-xs"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-xs"></span>
                <span className="ml-2 font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  First50 Command Center — IST Mode
                </span>
              </div>

              {/* Desktop Search / Command Pill */}
              <div className="flex items-center gap-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#0C1728] px-3 py-1 text-[11px] text-slate-500 dark:text-slate-400 shadow-2xs">
                <Radar className="h-3 w-3 text-brand-indigo dark:text-brand-cyan" />
                <span className="font-mono">Search jobs, EMs, or DSA targets... ⌘K</span>
              </div>

              {/* Live Status Pill */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-indigo dark:text-brand-cyan">
                <span className="h-2 w-2 rounded-full bg-brand-indigo dark:bg-brand-cyan"></span>
                <span>09:15 AM IST</span>
              </div>
            </div>

            {/* Desktop Navigation Pill Ribbon */}
            <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] px-4 py-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setActiveMiniTab("radar")}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
                    activeMiniTab === "radar"
                      ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark"
                  }`}
                >
                  <Radar className="h-3.5 w-3.5" />
                  <span>Morning Radar</span>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">6</span>
                </button>
                <button
                  onClick={() => setActiveMiniTab("routine")}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
                    activeMiniTab === "routine"
                      ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Daily Work Plan</span>
                </button>
                <button
                  onClick={() => setActiveMiniTab("diff")}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
                    activeMiniTab === "diff"
                      ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-subsurface-light dark:hover:bg-subsurface-dark"
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Match Diff Splicer</span>
                </button>
              </div>

              {/* Energy Level Selector (Interactive Mini Demo) */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-0.5 text-[11px]">
                <span className="px-1.5 text-slate-500 dark:text-slate-400">Energy:</span>
                <button
                  onClick={() => setMockLowEnergy(false)}
                  className={`rounded-lg px-2 py-0.5 font-bold transition ${
                    !mockLowEnergy
                      ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  ⚡ High (6)
                </button>
                <button
                  onClick={() => setMockLowEnergy(true)}
                  className={`rounded-lg px-2 py-0.5 font-bold transition ${
                    mockLowEnergy
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  🪫 Low Mode (1)
                </button>
              </div>
            </div>

            {/* Desktop Canvas Workspace */}
            <div className="p-5 sm:p-6 text-left">
              {activeMiniTab === "radar" && (
                <div className="grid gap-4 md:grid-cols-2 items-start">
                  {/* Instahyre Card 1: Swiggy */}
                  <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Swiggy</span>
                          <span className="rounded bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-hairline-light dark:border-hairline-dark">
                            Bengaluru
                          </span>
                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                            ₹36L - ₹48L
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          Software Development Engineer II (Core Platform)
                        </h4>
                      </div>
                      <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-center font-mono">
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">96%</span>
                        <div className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Match</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ Java 21</span>
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ Kafka</span>
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ PostgreSQL</span>
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ KEDA</span>
                    </div>

                    <div className="pt-2 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Scanned 18 mins ago</span>
                      <button
                        onClick={onExploreDemo}
                        className="flex items-center gap-1 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3 py-1 text-[11px] font-bold text-white dark:text-slate-950 shadow-xs"
                      >
                        <span>1-Click Strike</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Instahyre Card 2: Razorpay */}
                  <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 space-y-3 shadow-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Razorpay</span>
                          <span className="rounded bg-white dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-hairline-light dark:border-hairline-dark">
                            Bengaluru / Remote
                          </span>
                          <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                            ₹38L - ₹52L
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          Backend Engineer II (High-Throughput Ledger)
                        </h4>
                      </div>
                      <div className="rounded-xl border border-indigo-300 dark:border-cyan-500/40 bg-indigo-50 dark:bg-cyan-500/10 px-2.5 py-1 text-center font-mono">
                        <span className="text-xs font-black text-brand-indigo dark:text-brand-cyan">94%</span>
                        <div className="text-[9px] uppercase font-bold text-brand-indigo dark:text-brand-cyan">Match</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ Distributed Ledger</span>
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ Redis Cluster</span>
                      <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 font-medium text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">✓ Microservices</span>
                    </div>

                    <div className="pt-2 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Scanned 42 mins ago</span>
                      <button
                        onClick={onExploreDemo}
                        className="flex items-center gap-1 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3 py-1 text-[11px] font-bold text-white dark:text-slate-950 shadow-xs"
                      >
                        <span>1-Click Strike</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeMiniTab === "routine" && (
                <div className="space-y-3">
                  {mockLowEnergy && (
                    <div className="rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <BatteryCharging className="h-4 w-4 shrink-0" />
                      <span>Zero-Guilt Mode Active: Heavy office day? Just complete 09:15 AM Fast Strike. Streak maintained!</span>
                    </div>
                  )}

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div
                      onClick={() => toggleMockTask("task-1")}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                        checkedItems["task-1"]
                          ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20"
                          : "border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold text-brand-indigo dark:text-brand-cyan">08:30 – 09:15 AM</span>
                        <div className={`text-xs font-semibold ${checkedItems["task-1"] ? "line-through text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                          Daily Technical Deep Prep Drill
                        </div>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 ${checkedItems["task-1"] ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`} />
                    </div>

                    <div
                      onClick={() => toggleMockTask("task-2")}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                        checkedItems["task-2"]
                          ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20"
                          : "border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold text-brand-indigo dark:text-brand-cyan">09:15 – 09:45 AM</span>
                        <div className={`text-xs font-semibold ${checkedItems["task-2"] ? "line-through text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>
                          First-50 Fast Strike (Past 4 Hours)
                        </div>
                      </div>
                      <Circle className={`h-5 w-5 ${checkedItems["task-2"] ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`} />
                    </div>
                  </div>
                </div>
              )}

              {activeMiniTab === "diff" && (
                <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-4 space-y-3 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <div className="flex items-center justify-between pb-2 border-b border-hairline-light dark:border-hairline-dark">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Inline Match Diff Splicer Preview
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">3x Reply Rate Formula</span>
                  </div>

                  <div>
                    Hi Arun, saw your team scaling{" "}
                    <span className="diff-req font-bold">Swiggy&apos;s Core Platform</span>. I&apos;m a Software Engineer running{" "}
                    <span className="diff-req font-bold">Java/K8s microservices</span> processing{" "}
                    <span className="diff-proof font-bold">2.1B+ annual communications</span>—recently{" "}
                    <span className="diff-proof font-bold">cut batch latency 90% via KEDA + partitioned PostgreSQL</span>. Role aligns closely with my{" "}
                    <span className="diff-req font-bold">AWS/distributed systems</span> work. Before I apply on the portal, would you be open to passing my CV to the HM?
                  </div>

                  <div className="pt-2 flex flex-wrap gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-brand-indigo dark:text-brand-cyan font-bold">
                      <span className="h-2 w-2 rounded-full bg-brand-indigo dark:bg-brand-cyan"></span>
                      Target Tech Need
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Real Injected Production Proof
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* The 6-Step IST Shift Protocol Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 border-t border-hairline-light dark:border-hairline-dark">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50 dark:bg-cyan-500/10 px-3 py-0.5 text-xs font-bold text-brand-indigo dark:text-brand-cyan font-mono">
            CAREER ACCELERATION PROTOCOL
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            The Proven Shift Architecture (08:30 AM – 09:00 PM IST)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Stop sending random midnight applications that get buried under 500 resumes. Strike early when recruiters log in and start reviewing their queue.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-brand-indigo dark:text-brand-cyan flex items-center gap-1.5">
                <Code2 className="h-4 w-4" />
                08:30 – 09:15 AM
              </span>
              <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-brand-indigo dark:text-brand-cyan">
                Prep Block
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">Daily Deep Prep Studio</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Target high-yield interview questions, technical concepts, and domain design patterns before your daily workday begins.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-brand-indigo dark:text-brand-cyan flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                09:15 – 09:45 AM
              </span>
              <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-brand-indigo dark:text-brand-cyan">
                First Strike
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">First-50 Fast Strike</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Launch pre-configured early-bird searches (<code className="text-brand-indigo dark:text-brand-cyan font-bold">f_TPR=r14400</code>) tailored to your target locations. Apply before roles hit 50 applicants for an 8x response rate.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                09:55 – 10:00 AM
              </span>
              <span className="rounded bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-700 dark:text-amber-300">
                Algorithm
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">Naukri Algorithm Refresh</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Update 1 skill or tweak your headline right at 09:55 AM so you rank #1 in Indian recruiter &quot;Recently Updated Candidates&quot; searches at 10:00 AM.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-brand-indigo dark:text-brand-cyan flex items-center gap-1.5">
                <Send className="h-4 w-4" />
                10:00 – 10:30 AM
              </span>
              <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-brand-indigo dark:text-brand-cyan">
                Outreach
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">3 Direct Outreach Pitches</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Send concise, personalized pitches directly to decision-makers and hiring managers before applying on portals. Lead with proof of impact.
            </p>
          </div>

          {/* Step 5 */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                11:00 AM – 08:00 PM
              </span>
              <span className="rounded bg-subsurface-light dark:bg-subsurface-dark px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-400 border border-hairline-light dark:border-hairline-dark">
                Workplace
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">Office Shift & Brag Sheet</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Execute your regular office day. When you optimize a query or fix a production issue, log it into your private STAR brag sheet so you have fresh stories for interviews.
            </p>
          </div>

          {/* Step 6 */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-5 hover:border-brand-indigo/40 dark:hover:border-brand-cyan/40 shadow-xs transition">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-brand-indigo dark:text-brand-cyan flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                08:30 – 09:00 PM
              </span>
              <span className="rounded bg-indigo-50 dark:bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-brand-indigo dark:text-brand-cyan">
                Pipeline
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">72h Referral Follow-up</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Review your application pipeline. The 72-hour alert flags referral requests or hiring manager DMs awaiting polite follow-ups, ensuring zero leads fall through cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive: STAR Story Bank */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 border-t border-hairline-light dark:border-hairline-dark">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50 dark:bg-cyan-500/10 px-3 py-1 text-xs font-bold text-brand-indigo dark:text-brand-cyan font-mono">
              <Award className="h-3.5 w-3.5" />
              INTERVIEW BRAG SHEET & STORY BANK
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl tracking-tight">
              Turn Daily Work Wins Into High-Scoring STAR Answers.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Never get tongue-tied in system design or behavioral rounds. Log production wins in full STAR format (Situation, Task, Action, Result) with metrics. Copy pre-formatted interview answers or resume bullets with a single click.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-slate-100">1-Click STAR Answers:</strong> Formats technical deep dives into clean 90-second spoken narratives for hiring manager rounds.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-slate-100">1-Click Resume Bullets:</strong> Generates metric-focused, ATS-friendly action bullets ready to paste into customized resumes.
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-3">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Sample STAR Story Card
              </span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/30">
                50M+ Events/Day
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Event-Driven Payment Ingestion Architecture</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Decoupled synchronous checkout APIs from payment settlement workflows using Kafka clusters with idempotency keys.
              </p>
            </div>
            <div className="rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-3 text-[11px] text-slate-800 dark:text-slate-200 font-mono leading-relaxed">
              &ldquo;When transaction bursts overwhelmed our gateway, I re-architected the pipeline into an event-driven Kafka topology with deduplication, scaling capacity to 50M+ events daily with zero transaction loss.&rdquo;
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Tags: #Kafka, #DistributedSystems, #Java</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1-Click Copy Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-hairline-light dark:border-hairline-dark bg-gradient-to-b from-subsurface-light to-white dark:from-[#08111D] dark:to-[#060C16] px-4 py-16 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex justify-center">
            <LogoIcon className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl tracking-tight">
            Start Landing High-Velocity Career Offers.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Personalize your target criteria, track your follow-up pipeline, and master daily preparation without giving up your day job.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-2xl bg-brand-indigo dark:bg-brand-cyan px-6 py-3 text-sm font-bold text-white dark:text-slate-950 shadow-md hover:opacity-95 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Get Started with Google</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] px-6 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:border-brand-indigo dark:hover:border-brand-cyan transition shadow-2xs active:scale-95"
            >
              Explore Live Demo First
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline-light dark:border-hairline-dark px-4 py-6 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>First50 Command Center &middot; Privacy First Architecture &middot; Cloud Synced on Google Cloud Firestore</p>
      </footer>
    </div>
  );
}
