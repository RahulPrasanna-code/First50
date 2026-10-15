export interface UserProfile {
  name: string;
  email: string;
  currentRole: string;
  company: string;
  totalExperience: string;
  education: string;
  shiftHours: string;
  targetRoles: string[];
  targetLocations: string[];
  currentCompensation: string;
  targetCompensation: string;
  skills: string[];
  achievements: string[];
}

export interface UserStreak {
  currentStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
  longestStreak: number;
}

export interface DailyRoutineTask {
  id: string;
  timeBlock: string;
  title: string;
  description: string;
  completed: boolean;
  category: "prep" | "strike" | "refresh" | "dm" | "office" | "pipeline";
  actionLabel?: string;
  actionUrl?: string;
}

export interface DailyRoutineDay {
  date: string; // YYYY-MM-DD
  tasks: DailyRoutineTask[];
}

export interface ScrapedJob {
  id: string;
  company: string;
  title: string;
  location: string;
  source: "Greenhouse" | "Lever" | "Direct";
  applyUrl: string;
  postedAt: string;
  matchScore: number; // 0-100
  matchingSkills: string[];
  missingKeywords: string[];
  aiPitch: string; // <300 chars
  status: "new" | "saved" | "applied" | "dismissed";
}

export type ApplicationStatus =
  | "HM DM Sent"
  | "Applied (<4h)"
  | "Referred"
  | "OA / Screening"
  | "Interviewing"
  | "Offer"
  | "Rejected";

export interface Application {
  id: string;
  company: string;
  roleTitle: string;
  jobIdOrUrl: string;
  location: "Bengaluru" | "Chennai" | "Remote" | string;
  status: ApplicationStatus;
  contactName: string;
  appliedDate: string; // ISO string
  followUpDueDate: string; // ISO string (appliedDate + 72h)
  pitchUsed: string;
  notes: string;
}

export interface JDAnalysisResult {
  fitScore: number;
  yoeGatePassed: boolean;
  yoeGateDetails: string;
  matchingHighlights: string[];
  missingKeywords: string[];
  linkedinPitch: string;
  coldEmail: string;
}
