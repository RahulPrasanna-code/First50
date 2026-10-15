import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatISTTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatISTDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getTodayKeyIST(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return parts; // Returns YYYY-MM-DD
}

export function isPast72Hours(appliedDateIso: string): boolean {
  try {
    const appliedTime = new Date(appliedDateIso).getTime();
    const now = Date.now();
    const diffHours = (now - appliedTime) / (1000 * 60 * 60);
    return diffHours >= 72;
  } catch {
    return false;
  }
}

export function getHoursAgo(isoString: string): number {
  try {
    const time = new Date(isoString).getTime();
    return Math.max(0, Math.floor((Date.now() - time) / (1000 * 60 * 60)));
  } catch {
    return 0;
  }
}

export function buildLinkedInSearchUrl(params: {
  keywords?: string;
  location?: "Bengaluru" | "Chennai" | "India" | string;
  timeRange?: "r3600" | "r14400" | "r86400" | "r604800"; // 1h, 4h, 24h, 1w
  experienceLevel?: string; // "2,3" for Entry/Associate/Mid
}): string {
  const {
    keywords = "Java Backend OR Spring Boot OR Distributed Systems",
    location = "Bengaluru",
    timeRange = "r14400",
    experienceLevel = "2,3",
  } = params;

  const url = new URL("https://www.linkedin.com/jobs/search/");
  url.searchParams.set("keywords", keywords);
  url.searchParams.set("location", location);
  url.searchParams.set("f_TPR", timeRange);
  if (experienceLevel) {
    url.searchParams.set("f_E", experienceLevel);
  }
  return url.toString();
}
