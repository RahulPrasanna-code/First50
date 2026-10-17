"use client";

import React, { useState, useEffect } from "react";
import { formatISTDate, formatISTTime } from "@/lib/utils";
import { UserProfile, UserStreak } from "@/types";
import { User } from "firebase/auth";
import { useTheme } from "@/lib/ThemeContext";
import { LogoIcon } from "@/components/Logo";
import {
  Flame,
  Bell,
  BellRing,
  User as UserIcon,
  Sun,
  Moon,
  Bookmark,
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
  onOpenQuickCapture?: () => void;
  energyLevel?: "high" | "med" | "low";
  onEnergyChange?: (level: "high" | "med" | "low") => void;
}

export function Header({
  profile,
  streak,
  completedTasksCount,
  totalTasksCount,
  onOpenProfile,
  authUser,
  onOpenQuickCapture,
  energyLevel = "high",
  onEnergyChange,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(9);
  const [notificationsGranted, setNotificationsGranted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatISTTime(now));
      setCurrentDate(formatISTDate(now));

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
        new Notification("First50 Radar Active", {
          body: "Push alerts enabled for 09:15 AM strike and 72-hour follow-ups.",
          icon: "/icons/icon-192.png",
        });
      }
    }
  };

  const isMorningSprint = currentHour >= 8 && currentHour < 11;
  const isOfficeShift = currentHour >= 11 && currentHour < 20;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline-light dark:border-hairline-dark bg-white/95 dark:bg-[#091220]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
        
        {/* Left: Brand Mark & Steady Sprint Badge (NO BLINKING) */}
        <div className="flex items-center gap-3">
          <LogoIcon className="h-9 w-9 shrink-0" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                First<span className="text-brand-indigo dark:text-brand-cyan">50</span>
              </h1>
              
              {/* Steady Status Pill */}
              <span className="flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50 dark:bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-indigo dark:text-brand-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-indigo dark:bg-brand-cyan"></span>
                {isMorningSprint ? "09:15 AM SPRINT" : isOfficeShift ? "OFFICE FOCUS" : "EVENING TRIAGE"}
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Minimalist Career Command Center · {currentTime || "09:15 AM IST"}
            </p>
          </div>
        </div>

        {/* Center: Energy Level Switcher (Luminous Light Mode, no dull greys) */}
        {onEnergyChange && (
          <div className="hidden lg:flex items-center gap-1 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#070E1A] p-1 text-xs shadow-2xs">
            <span className="px-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">Energy:</span>
            <button
              onClick={() => onEnergyChange("high")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                energyLevel === "high"
                  ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Full 6-Task Daily Shift Protocol"
            >
              ⚡ High (6)
            </button>
            <button
              onClick={() => onEnergyChange("med")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                energyLevel === "med"
                  ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Core 3 Tasks Only (Strike, Naukri, Pitch)"
            >
              🔋 Med (3)
            </button>
            <button
              onClick={() => onEnergyChange("low")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                energyLevel === "low"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title="Zero-Guilt Minimum (1 High-ROI Action)"
            >
              🪫 Low (1)
            </button>
          </div>
        )}

        {/* Right: Discrete Quick Capture, Streak, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Discrete Quick-Capture Tool Button (Fix for Bookmarklet) */}
          {onOpenQuickCapture && (
            <button
              onClick={onOpenQuickCapture}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/80 dark:bg-cyan-500/10 px-2.5 py-1.5 text-xs font-semibold text-brand-indigo dark:text-brand-cyan hover:bg-indigo-100 dark:hover:bg-cyan-500/20 transition shadow-2xs active:scale-95"
              title="1-Click Quick-Capture tool for LinkedIn and Instahyre"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick Capture</span>
            </button>
          )}

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-slate-800 bg-amber-50 dark:bg-slate-900 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-2xs">
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="font-mono">{streak.currentStreak}d Streak</span>
          </div>

          {/* Theme Switcher Toggle (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#0C1728] text-slate-700 dark:text-slate-300 hover:text-brand-indigo dark:hover:text-brand-cyan transition shadow-2xs active:scale-95"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* User Profile & Account (Unified - no duplicate buttons) */}
          {authUser ? (
            <button
              onClick={onOpenProfile}
              title="Open Profile & Settings"
              className="flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-cyan-500/30 bg-indigo-50/50 dark:bg-[#0C1728] px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 transition hover:border-brand-indigo dark:hover:border-brand-cyan"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-indigo/15 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan font-bold text-xs overflow-hidden">
                {authUser.photoURL ? (
                  <img src={authUser.photoURL} alt="User" className="h-7 w-7 object-cover" />
                ) : (
                  <span>{authUser.displayName?.charAt(0) || "R"}</span>
                )}
              </div>
              <div className="hidden text-left md:block">
                <div className="font-semibold leading-tight text-slate-900 dark:text-slate-100 max-w-[110px] truncate">
                  {authUser.displayName || profile.name}
                </div>
                <div className="text-[10px] text-brand-indigo dark:text-brand-cyan font-mono">
                  Synced
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              title="Sign in with Google"
              className="flex items-center gap-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-[#0C1728] px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-indigo dark:hover:border-brand-cyan transition"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
