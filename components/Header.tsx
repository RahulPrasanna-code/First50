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

          {/* User Profile & Account (Unified - no duplicate buttons) */}
          {authUser ? (
            <button
              onClick={onOpenProfile}
              title="Open Profile & Sync Settings"
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
              <div className="hidden text-left sm:block">
                <div className="font-semibold leading-tight text-white max-w-[130px] truncate">
                  {authUser.displayName || profile.name}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Cloud Synced
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              title="Open Profile & Cloud Sync"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-all"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-slate-300">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <div className="hidden text-left sm:block">
                <div className="font-semibold leading-tight text-white">
                  {profile.name.split(" ")[0]}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Profile & Sync
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
