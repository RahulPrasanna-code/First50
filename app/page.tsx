"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DailyRoutine } from "@/components/DailyRoutine";
import { MorningRadar } from "@/components/MorningRadar";
import { Past4HoursStrike } from "@/components/Past4HoursStrike";
import { PitchStudio } from "@/components/PitchStudio";
import { ApplicationTracker } from "@/components/ApplicationTracker";
import { ProfileModal } from "@/components/ProfileModal";
import { BragSheet } from "@/components/BragSheet";
import { DeepPrepStudio } from "@/components/DeepPrepStudio";
import {
  UserProfile,
  UserStreak,
  DailyRoutineTask,
  ScrapedJob,
  Application,
  ApplicationStatus,
  BragItem,
} from "@/types";
import {
  getProfile,
  saveProfile,
  getStreak,
  updateStreak,
  getDailyRoutine,
  saveDailyRoutine,
  getScrapedJobs,
  saveScrapedJobs,
  updateScrapedJobStatus,
  getApplications,
  saveApplication,
  deleteApplication,
  getBragSheet,
  saveBragItem,
  deleteBragItem,
} from "@/lib/storage";
import { getTodayKeyIST, isPast72Hours } from "@/lib/utils";
import { subscribeToAuth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { SEED_PROFILE, ROTATING_PREP_TOPICS } from "@/data/seed";
import {
  Radar,
  Zap,
  Send,
  Layers,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Award,
  Code2,
  Cpu,
  BookOpen,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<User | null>(null);

  // Core Data State
  const [profile, setProfile] = useState<UserProfile>(SEED_PROFILE);
  const [streak, setStreak] = useState<UserStreak>({
    currentStreak: 1,
    lastCompletedDate: "",
    longestStreak: 1,
  });
  const [routineTasks, setRoutineTasks] = useState<DailyRoutineTask[]>([]);
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJob[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [bragItems, setBragItems] = useState<BragItem[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<"radar" | "strike" | "pitch" | "pipeline" | "brag" | "prep">("radar");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isPrepStudioOpen, setIsPrepStudioOpen] = useState<boolean>(false);
  const [isRoutineCollapsed, setIsRoutineCollapsed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Register PWA Service Worker & Load Initial Data
  useEffect(() => {
    setMounted(true);

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Service Worker registration failed:", err);
      });
    }

    const unsubscribe = subscribeToAuth((user) => {
      setAuthUser(user);
      loadAllData(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  const loadAllData = async (userId?: string | null) => {
    const today = getTodayKeyIST();
    try {
      const [loadedProfile, loadedStreak, loadedTasks, loadedJobs, loadedApps, loadedBrag] = await Promise.all([
        getProfile(userId),
        getStreak(userId),
        getDailyRoutine(today, userId),
        getScrapedJobs(userId),
        getApplications(userId),
        getBragSheet(userId),
      ]);

      setProfile(loadedProfile);
      setStreak(loadedStreak);
      setRoutineTasks(loadedTasks);
      setScrapedJobs(loadedJobs);
      setApplications(loadedApps);
      setBragItems(loadedBrag);
    } catch (e) {
      console.error("Error loading application data:", e);
    }
  };

  const handleSaveBragItem = async (item: BragItem) => {
    const updated = await saveBragItem(item, authUser?.uid);
    setBragItems(updated);
    showToast("STAR Production Story saved to Brag Sheet!");
  };

  const handleDeleteBragItem = async (id: string) => {
    const updated = await deleteBragItem(id, authUser?.uid);
    setBragItems(updated);
    showToast("Story removed from Brag Sheet.");
  };

  // Routine task toggling
  const handleToggleTask = async (taskId: string) => {
    const today = getTodayKeyIST();
    const updated = routineTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setRoutineTasks(updated);
    await saveDailyRoutine(today, updated, authUser?.uid);

    // Check if all completed to increment streak
    const allDone = updated.every((t) => t.completed);
    if (allDone && streak.lastCompletedDate !== today) {
      const newStreak: UserStreak = {
        currentStreak: streak.currentStreak + 1,
        lastCompletedDate: today,
        longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
      };
      setStreak(newStreak);
      await updateStreak(newStreak, authUser?.uid);
      showToast("🎉 Perfect sprint! All 6 daily tasks completed. Streak increased!");
    }
  };

  const handleResetDay = async () => {
    const today = getTodayKeyIST();
    const reset = routineTasks.map((t) => ({ ...t, completed: false }));
    setRoutineTasks(reset);
    await saveDailyRoutine(today, reset, authUser?.uid);
    showToast("Sprint tasks reset for a fresh run.");
  };

  // ATS Scanner Trigger
  const handleScanNow = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/cron/morning-radar", {
        method: "POST",
      });
      const data = await res.json();
      if (data.jobs && Array.isArray(data.jobs)) {
        setScrapedJobs(data.jobs);
        await saveScrapedJobs(data.jobs, authUser?.uid);
        showToast(`⚡ Scanned ${data.jobs.length} fresh roles across Greenhouse & Lever!`);
      }
    } catch (err) {
      console.error("Scan failed:", err);
      showToast("Scan finished with cached fallback results.");
    } finally {
      setIsScanning(false);
    }
  };

  // Job Status & Pipeline Actions
  const handleUpdateJobStatus = async (jobId: string, status: ScrapedJob["status"]) => {
    const updated = await updateScrapedJobStatus(jobId, status, authUser?.uid);
    setScrapedJobs(updated);
  };

  const handleSaveScrapedJobToPipeline = async (job: ScrapedJob) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      company: job.company,
      roleTitle: job.title,
      jobIdOrUrl: job.applyUrl,
      location: job.location.includes("Chennai") ? "Chennai" : "Bengaluru",
      status: "HM DM Sent",
      contactName: `Engineering Manager (${job.company})`,
      appliedDate: new Date().toISOString(),
      followUpDueDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      pitchUsed: job.aiPitch,
      notes: `Scanned from ${job.source}. Match Score: ${job.matchScore}%.`,
    };

    const updated = await saveApplication(newApp, authUser?.uid);
    setApplications(updated);
    showToast(`Added ${job.company} (${job.title}) to your 72h Follow-Up Pipeline!`);
  };

  const handleSaveCustomToPipeline = async (partialApp: Partial<Application>) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      company: partialApp.company || "Target Company",
      roleTitle: partialApp.roleTitle || "Backend Software Engineer",
      jobIdOrUrl: partialApp.jobIdOrUrl || "Direct",
      location: partialApp.location || "Bengaluru",
      status: partialApp.status || "HM DM Sent",
      contactName: partialApp.contactName || "Engineering Manager",
      appliedDate: new Date().toISOString(),
      followUpDueDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      pitchUsed: partialApp.pitchUsed || "",
      notes: partialApp.notes || "",
    };

    const updated = await saveApplication(newApp, authUser?.uid);
    setApplications(updated);
    showToast(`Saved to Application Pipeline!`);
  };

  const handleDeleteApplication = async (appId: string) => {
    const updated = await deleteApplication(appId, authUser?.uid);
    setApplications(updated);
    showToast("Application removed from tracker.");
  };

  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    const updatedApp = { ...app, status };
    const updatedList = await saveApplication(updatedApp, authUser?.uid);
    setApplications(updatedList);
  };

  const handleSaveProfile = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await saveProfile(newProfile, authUser?.uid);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f19] text-emerald-400 font-mono text-sm">
        Initializing First50 Command Center...
      </div>
    );
  }

  const completedTasksCount = routineTasks.filter((t) => t.completed).length;
  const followUpDueCount = applications.filter(
    (a) => (a.status === "HM DM Sent" || a.status === "Referred") && isPast72Hours(a.appliedDate)
  ).length;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[new Date().getDay()];
  const todayPrepTopic =
    ROTATING_PREP_TOPICS.find((t) => t.dayOfWeek.toLowerCase() === currentDayName.toLowerCase()) ||
    ROTATING_PREP_TOPICS[0];
  const isTodayPrepCompleted = routineTasks.find((t) => t.id === "task-1-prep")?.completed ?? false;

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 pb-16 selection:bg-emerald-500/30">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/95 px-4 py-3 text-xs font-bold text-emerald-400 shadow-2xl backdrop-blur-md transition-all animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Command Center Header */}
      <Header
        profile={profile}
        streak={streak}
        completedTasksCount={completedTasksCount}
        totalTasksCount={routineTasks.length}
        onOpenProfile={() => setIsProfileOpen(true)}
        authUser={authUser}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Daily Routine Collapse / Expand Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shift Architecture (08:30 AM – 09:00 PM IST)
            </span>
            <button
              onClick={() => setIsRoutineCollapsed(!isRoutineCollapsed)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <span>{isRoutineCollapsed ? "Show Daily Routine" : "Hide Checklist"}</span>
              {isRoutineCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>

          {!isRoutineCollapsed && (
            <DailyRoutine
              tasks={routineTasks}
              onToggleTask={handleToggleTask}
              onResetDay={handleResetDay}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenPrepStudio={() => setActiveTab("prep")}
            />
          )}
        </div>

        {/* Today's Daily Deep Prep Spotlight Block */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/25 via-slate-900 to-slate-900/90 p-4 sm:p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-md">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">
                    Today&apos;s Deep Prep Target ({currentDayName})
                  </span>
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-purple-300 font-bold border border-purple-500/30">
                    08:30 – 09:15 AM IST
                  </span>
                  {isTodayPrepCompleted && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      Sprint Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Targeted SDE-2 DSA problem & Distributed Systems architecture pattern for today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("prep")}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-1.5 text-xs shadow-md shadow-purple-600/20 transition-all"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Launch Prep Studio</span>
              </button>
              {!isTodayPrepCompleted && (
                <button
                  onClick={() => {
                    handleToggleTask("task-1-prep");
                    showToast("🔥 Daily Deep Prep marked complete! Sprint updated.");
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Done</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 pt-2 border-t border-slate-800/80">
            {/* Left: DSA Problem */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-purple-400" />
                    DSA: {todayPrepTopic.dsaTitle}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 rounded">
                    {todayPrepTopic.dsaDifficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {todayPrepTopic.dsaKeyInsight}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Pattern: {todayPrepTopic.dsaPattern}</span>
                <a
                  href={todayPrepTopic.dsaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 font-medium"
                >
                  Solve on LeetCode <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Right: Distributed Systems */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                    Dist. System: {todayPrepTopic.distSysTitle}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 border border-slate-700 bg-slate-800 px-1.5 py-0.2 rounded">
                    {todayPrepTopic.distSysCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {todayPrepTopic.fidelityConnection}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Tier-1 SDE-2 Bar</span>
                <a
                  href={todayPrepTopic.distSysReadingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-medium"
                >
                  Read Material <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
          <nav className="flex flex-wrap gap-1 sm:gap-2">
            {/* Tab 1: Morning Radar */}
            <button
              onClick={() => setActiveTab("radar")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "radar"
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Radar className="h-4 w-4" />
              <span>Morning Job Radar</span>
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                {scrapedJobs.length}
              </span>
            </button>

            {/* Tab 2: 9:15 AM Past 4 Hours Strike */}
            <button
              onClick={() => setActiveTab("strike")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "strike"
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>9:15 AM Fast Strike</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300">
                f_TPR
              </span>
            </button>

            {/* Tab 3: Daily Deep Prep Studio */}
            <button
              onClick={() => setActiveTab("prep")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "prep"
                  ? "border border-purple-500/40 bg-purple-500/10 text-purple-400 shadow-md shadow-purple-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Code2 className="h-4 w-4 text-purple-400" />
              <span>Daily Deep Prep</span>
              <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-mono text-purple-300">
                SDE-2
              </span>
            </button>

            {/* Tab 4: HM Pitch Studio */}
            <button
              onClick={() => setActiveTab("pitch")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "pitch"
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Send className="h-4 w-4" />
              <span>HM Pitch Studio</span>
              <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-mono text-purple-300">
                AI
              </span>
            </button>

            {/* Tab 5: Application Pipeline */}
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "pipeline"
                  ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>72h Pipeline Tracker</span>
              {followUpDueCount > 0 && (
                <span className="flex items-center gap-0.5 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-400 border border-amber-500/40">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {followUpDueCount}
                </span>
              )}
            </button>

            {/* Tab 6: Interview Brag Sheet */}
            <button
              onClick={() => setActiveTab("brag")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "brag"
                  ? "border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-md shadow-amber-500/10"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span>Interview Brag Sheet</span>
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                {bragItems.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Contents */}
        <section>
          {activeTab === "radar" && (
            <MorningRadar
              jobs={scrapedJobs}
              onScanNow={handleScanNow}
              isScanning={isScanning}
              onSaveToPipeline={handleSaveScrapedJobToPipeline}
              onUpdateJobStatus={handleUpdateJobStatus}
            />
          )}

          {activeTab === "strike" && <Past4HoursStrike />}

          {activeTab === "prep" && (
            <DeepPrepStudio
              embedded={true}
              onCompletePrep={() => {
                handleToggleTask("task-1-prep");
                showToast("🔥 Daily Deep Prep completed! Sprint progress updated.");
              }}
            />
          )}

          {activeTab === "pitch" && (
            <PitchStudio
              profile={profile}
              onSaveToPipeline={handleSaveCustomToPipeline}
            />
          )}

          {activeTab === "pipeline" && (
            <ApplicationTracker
              applications={applications}
              onSaveApplication={async (app) => {
                const updated = await saveApplication(app, authUser?.uid);
                setApplications(updated);
                showToast(`Logged application for ${app.company}`);
              }}
              onDeleteApplication={handleDeleteApplication}
              onUpdateStatus={handleUpdateApplicationStatus}
            />
          )}

          {activeTab === "brag" && (
            <BragSheet
              items={bragItems}
              onSaveItem={handleSaveBragItem}
              onDeleteItem={handleDeleteBragItem}
            />
          )}
        </section>
      </div>

      {/* Engineer Profile & AI Context Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        authUser={authUser}
      />

      {/* Daily Deep Prep Studio Modal */}
      <DeepPrepStudio
        isOpen={isPrepStudioOpen}
        onClose={() => setIsPrepStudioOpen(false)}
        onCompletePrep={() => {
          handleToggleTask("task-1-prep");
          showToast("🔥 Daily Deep Prep completed! Sprint progress updated.");
        }}
      />
    </main>
  );
}
