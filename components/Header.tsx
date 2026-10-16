"use client";

import React, { useState, useEffect } from "react";
import { formatISTDate, formatISTTime } from "@/lib/utils";
import { UserProfile, UserStreak } from "@/types";
import { signInWithGoogle, signOutUser, isFirebaseConfigured } from "@/lib/firebase";
import { User } from "firebase/auth";
import {
  Flame,
  Bell,
  BellRing,
  User as UserIcon,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";

interface HeaderProps {
  profile: UserProfile;
  streak: UserStreak;
  completedTasksCount: number;
  totalTasksCount: number;
  onOpenProfile: () => void;
  authUser: User | null;
  onAuthChange?: (user: User | null) => void;
}

export function Header({
  profile,
  streak,
  completedTasksCount,
  totalTasksCount,
  onOpenProfile,
  authUser,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(9);
  const [notificationsGranted, setNotificationsGranted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatISTTime(now));
      setCurrentDate(formatISTDate(now));

      // Get IST hour
      const istHours = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      }).format(now);
      setCurrentHour(parseInt(istHours, 10));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsGranted(Notification.permission === "granted");
    }
  }, []);

  const handleRequestNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsGranted(permission === "granted");
      if (permission === "granted") {
        new Notification("⚡ First50 Radar Active", {
          body: "Push alerts enabled for 8:30 AM ATS discovery and 72-hour follow-ups.",
          icon: "/icons/icon-192.png",
        });
      }
    }
  };

  const isMorningSprint = currentHour >= 8 && currentHour < 11;
  const isOfficeShift = currentHour >= 11 && currentHour < 20;

  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: Brand & Sprint Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 font-mono text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20">
            F50
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                First<span className="text-emerald-400">50</span>
              </h1>
              <span className="hidden text-xs text-slate-400 sm:inline">|</span>
              <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                Job Hunt Command Center
              </span>
            </div>

            {/* Time-sensitive dynamic sprint status */}
            <div className="flex items-center gap-2 text-xs">
              {isMorningSprint ? (
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <Zap className="h-3 w-3 animate-pulse" />
                  PRIME MORNING SPRINT (08:30 – 10:30 AM IST)
                </span>
              ) : isOfficeShift ? (
                <span className="flex items-center gap-1.5 font-medium text-blue-400">
                  <Clock className="h-3 w-3" />
                  CORE OFFICE SHIFT (11:00 AM – 08:00 PM IST)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 font-medium text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  EVENING PIPELINE TRIAGE & PREP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Progress */}
        <div className="flex items-center gap-6">
          {/* IST Clock */}
          <div className="hidden rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-center md:block">
            <div className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
              {currentTime || "08:30:00 AM IST"}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">{currentDate}</div>
          </div>

          {/* Daily Progress */}
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Daily Sprint
              </div>
              <div className="font-mono text-xs font-bold text-white">
                {completedTasksCount}/{totalTasksCount} ({progressPercent}%)
              </div>
            </div>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span className="font-mono text-xs font-bold">{streak.currentStreak}d Streak</span>
          </div>
        </div>

        {/* Right: Actions, Push Permission & User Profile */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <button
            onClick={handleRequestNotification}
            title={notificationsGranted ? "Radar notifications enabled" : "Enable morning radar push notifications"}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              notificationsGranted
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-700"
            }`}
          >
            {notificationsGranted ? (
              <>
                <BellRing className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Alerts On</span>
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden sm:inline">Enable Push</span>
              </>
            )}
          </button>

          {/* User Auth & Profile Control */}
          {authUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:border-emerald-500 hover:bg-slate-800"
              >
                <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold overflow-hidden">
                  {authUser.photoURL ? (
                    <img src={authUser.photoURL} alt="User" className="h-6 w-6 object-cover" />
                  ) : (
                    <span>{authUser.displayName?.charAt(0) || "R"}</span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-slate-900"></span>
                </div>
                <div className="hidden text-left lg:block">
                  <div className="font-semibold leading-tight text-white max-w-[130px] truncate">
                    {authUser.displayName || profile.name}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    Cloud Synced
                  </div>
                </div>
              </button>

              <button
                onClick={signOutUser}
                title="Sign out of Google"
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Profile</span>
              </button>

              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 shadow-md shadow-emerald-500/10 transition-all"
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
                <span>Google Sign-In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
