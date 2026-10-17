"use client";

import React from "react";
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
} from "lucide-react";

interface LandingPageProps {
  onExploreDemo: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onExploreDemo, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 font-mono text-base font-black text-slate-950 shadow-lg shadow-emerald-500/20">
              F50
              <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">
                First<span className="text-emerald-400">50</span>
              </span>
              <span className="ml-2 hidden text-xs text-slate-400 sm:inline">
                Job Hunt Command Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onExploreDemo}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white"
            >
              Try Live Demo
            </button>

            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-400"
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
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Shift Architecture Strategy for SDE-2 & Backend Engineers</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-white">
            Bypass the 500+ Queue.{" "}
            <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Land Tier-1 SDE-2 Offers.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            The automated job command center designed for working engineers targeting{" "}
            <strong className="text-white">22–45+ LPA</strong> roles in Bengaluru and Chennai.
            Discover roles before portals publish, pitch Engineering Managers directly with AI, and prepare with daily SDE-2 distributed systems challenges.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onSignIn}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:from-emerald-400 hover:to-teal-400"
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
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 shadow-lg transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              <span>Explore Interactive Demo</span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-400 font-mono">
                No Sign-in Required
              </span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              100% Free & Open-First
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Private Firestore Data Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-400" />
              Daily Shift Discipline Engine
            </span>
          </div>
        </div>
      </section>

      {/* The Shift Architecture Protocol Breakdown */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The Proven Shift Architecture (08:30 AM – 09:00 PM IST)
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Stop sending random midnight resumes that get buried. Execute during recruiter active windows before your day job begins.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Code2 className="h-4 w-4" />
                08:30 – 09:15 AM
              </span>
              <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                Prep
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Deep Prep Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solve 1 targeted LeetCode problem + master 1 Distributed Systems pattern (Kafka lag, Redlock, Cache Invalidation) with direct reading material before morning sprint distractions.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                09:15 – 09:45 AM
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                Strike
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">First-50 Fast Strike</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Launch pre-configured past-4-hours (<code className="text-emerald-400">f_TPR=r14400</code>) searches across Bengaluru & Chennai. Apply before roles hit 50 applicants for an 8x response rate.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                09:55 – 10:00 AM
              </span>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                Algorithm
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Naukri Algorithm Refresh</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Update 1 skill or tweak your profile headline right at 9:55 AM so you rank #1 in Indian recruiter &quot;Recently Updated Candidates&quot; searches at 10:00 AM.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Send className="h-4 w-4" />
                10:00 – 10:30 AM
              </span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono text-blue-300">
                Outreach
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">3 Direct EM Pitches</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send personalized 75-word pitches directly to Engineering Managers or tech leads before applying on company portals. Cite exact metrics and production wins.
            </p>
          </div>

          {/* Step 5 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                11:00 AM – 08:00 PM
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                Workplace
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Office Shift & Brag Sheet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute your regular office day. When you optimize a query or fix a production issue, log it into your private STAR brag sheet so you have fresh stories for interviews.
            </p>
          </div>

          {/* Step 6 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                08:30 – 09:00 PM
              </span>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                Pipeline
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">72h Referral Follow-up</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review your application pipeline. The 72-hour alert flags referral requests or hiring manager DMs awaiting polite follow-ups, ensuring zero leads fall through cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300 font-mono">
              <Award className="h-3.5 w-3.5" />
              INTERVIEW BRAG SHEET & STORY BANK
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Turn Daily Work Wins Into High-Scoring STAR Answers.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Never get tongue-tied in system design or behavioral rounds. Log production wins in full STAR format (Situation, Task, Action, Result) with metrics. Copy pre-formatted interview answers or resume bullets with a single click.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-xs text-slate-300">
                  <strong className="text-white">1-Click STAR Answers:</strong> Formats technical deep dives into clean 90-second spoken narratives for hiring manager rounds.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-xs text-slate-300">
                  <strong className="text-white">1-Click Resume Bullets:</strong> Generates metric-focused, ATS-friendly action bullets ready to paste into customized resumes.
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Sample STAR Story Card
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                50M+ Events/Day
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Event-Driven Payment Ingestion Architecture</h4>
              <p className="text-xs text-slate-400 mt-1">
                Decoupled synchronous checkout APIs from payment settlement workflows using Kafka clusters with idempotency keys.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-300 font-mono">
              &quot;When transaction bursts overwhelmed our gateway, I re-architected the pipeline into an event-driven Kafka topology with deduplication, scaling capacity to 50M+ events daily with zero transaction loss.&quot;
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Tags: Kafka, Distributed Systems, Java</span>
              <span className="text-emerald-400 font-semibold">1-Click Copy Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900/40 to-slate-950 px-4 py-16 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Start Landing High-Velocity SDE-2 Interviews.
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Build your private job radar, track your follow-up pipeline, and master daily deep prep without giving up your day job.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
            >
              <span>Get Started with Google</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              Explore Live Demo First
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-4 py-6 sm:px-6 text-center text-xs text-slate-500">
        <p>First50 Command Center &middot; Privacy First Architecture &middot; Cloud Synced on Google Cloud Firestore</p>
      </footer>
    </div>
  );
}
