"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="First50 Logo Icon"
    >
      <defs>
        {/* Light Mode Gradient: Electric Indigo to Violet */}
        <linearGradient id="f50-light-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Dark Mode Gradient: Arctic Cyan to Ocean Blue */}
        <linearGradient id="f50-dark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Radar Ring Glow */}
        <linearGradient id="f50-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Rounded Backdrop Squircle */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        className="fill-brand-indigo/10 dark:fill-brand-cyan/15 stroke-brand-indigo/30 dark:stroke-brand-cyan/40"
        strokeWidth="1.5"
      />

      {/* Outer Radar Sweep Orbit Arc */}
      <circle
        cx="20"
        cy="20"
        r="13"
        stroke="url(#f50-ring-grad)"
        strokeWidth="1.5"
        strokeDasharray="28 8"
        strokeLinecap="round"
      />

      {/* Supersonic Forward Arrow (The "First Strike" vector) */}
      <path
        d="M13 14L27 20L13 26L17 20L13 14Z"
        className="fill-brand-indigo dark:fill-brand-cyan"
      />

      {/* Center Strike Core Dot */}
      <circle
        cx="23"
        cy="20"
        r="2"
        className="fill-white dark:fill-[#060C16]"
      />
    </svg>
  );
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  };

  const textMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon className={sizeMap[size]} />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-slate-900 dark:text-slate-100 ${textMap[size]}`}>
            First<span className="text-brand-indigo dark:text-brand-cyan">50</span>
          </span>
        </div>
      )}
    </div>
  );
}
