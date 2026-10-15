import { db, isFirebaseConfigured } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  UserProfile,
  UserStreak,
  DailyRoutineTask,
  Application,
  ScrapedJob,
} from "@/types";
import {
  SEED_PROFILE,
  DEFAULT_DAILY_TASKS,
  INITIAL_APPLICATIONS,
  INITIAL_SCRAPED_JOBS,
} from "@/data/seed";
import { getTodayKeyIST } from "./utils";

const STORAGE_KEYS = {
  PROFILE: "first50_user_profile",
  STREAK: "first50_user_streak",
  ROUTINE_PREFIX: "first50_routine_",
  JOBS: "first50_scraped_jobs",
  APPLICATIONS: "first50_applications",
};

// Check if running on client
const isClient = typeof window !== "undefined";

function getLocal<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// ==========================================
// 1. PROFILE
// ==========================================
export async function getProfile(userId?: string | null): Promise<UserProfile> {
  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()?.profile) {
        return snap.data().profile as UserProfile;
      }
    } catch (e) {
      console.warn("Firestore getProfile failed, fallback to local:", e);
    }
  }
  return getLocal<UserProfile>(STORAGE_KEYS.PROFILE, SEED_PROFILE);
}

export async function saveProfile(
  profile: UserProfile,
  userId?: string | null
): Promise<void> {
  setLocal(STORAGE_KEYS.PROFILE, profile);
  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId);
      await setDoc(ref, { profile }, { merge: true });
    } catch (e) {
      console.warn("Firestore saveProfile failed:", e);
    }
  }
}

// ==========================================
// 2. STREAK
// ==========================================
const DEFAULT_STREAK: UserStreak = {
  currentStreak: 7,
  lastCompletedDate: getTodayKeyIST(),
  longestStreak: 12,
};

export async function getStreak(userId?: string | null): Promise<UserStreak> {
  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()?.streak) {
        return snap.data().streak as UserStreak;
      }
    } catch (e) {
      console.warn("Firestore getStreak failed, fallback to local:", e);
    }
  }
  return getLocal<UserStreak>(STORAGE_KEYS.STREAK, DEFAULT_STREAK);
}

export async function updateStreak(
  streak: UserStreak,
  userId?: string | null
): Promise<void> {
  setLocal(STORAGE_KEYS.STREAK, streak);
  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId);
      await setDoc(ref, { streak }, { merge: true });
    } catch (e) {
      console.warn("Firestore updateStreak failed:", e);
    }
  }
}

// ==========================================
// 3. DAILY ROUTINE
// ==========================================
export async function getDailyRoutine(
  dateKey: string,
  userId?: string | null
): Promise<DailyRoutineTask[]> {
  const localKey = `${STORAGE_KEYS.ROUTINE_PREFIX}${dateKey}`;

  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId, "dailyRoutine", dateKey);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data()?.tasks) {
        return snap.data().tasks as DailyRoutineTask[];
      }
    } catch (e) {
      console.warn("Firestore getDailyRoutine failed, fallback to local:", e);
    }
  }

  const localTasks = getLocal<DailyRoutineTask[] | null>(localKey, null);
  if (localTasks && Array.isArray(localTasks) && localTasks.length > 0) {
    return localTasks;
  }

  // Initialize with default tasks
  setLocal(localKey, DEFAULT_DAILY_TASKS);
  return DEFAULT_DAILY_TASKS;
}

export async function saveDailyRoutine(
  dateKey: string,
  tasks: DailyRoutineTask[],
  userId?: string | null
): Promise<void> {
  const localKey = `${STORAGE_KEYS.ROUTINE_PREFIX}${dateKey}`;
  setLocal(localKey, tasks);

  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId, "dailyRoutine", dateKey);
      await setDoc(ref, { date: dateKey, tasks }, { merge: true });
    } catch (e) {
      console.warn("Firestore saveDailyRoutine failed:", e);
    }
  }
}

// ==========================================
// 4. SCRAPED JOBS
// ==========================================
export async function getScrapedJobs(userId?: string | null): Promise<ScrapedJob[]> {
  if (isFirebaseConfigured && db && userId) {
    try {
      const colRef = collection(db, "users", userId, "scrapedJobs");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as ScrapedJob);
      }
    } catch (e) {
      console.warn("Firestore getScrapedJobs failed, fallback to local:", e);
    }
  }

  const localJobs = getLocal<ScrapedJob[] | null>(STORAGE_KEYS.JOBS, null);
  if (localJobs && Array.isArray(localJobs)) {
    return localJobs;
  }

  setLocal(STORAGE_KEYS.JOBS, INITIAL_SCRAPED_JOBS);
  return INITIAL_SCRAPED_JOBS;
}

export async function saveScrapedJobs(
  jobs: ScrapedJob[],
  userId?: string | null
): Promise<void> {
  setLocal(STORAGE_KEYS.JOBS, jobs);

  if (isFirebaseConfigured && db && userId) {
    try {
      for (const job of jobs) {
        const ref = doc(db, "users", userId, "scrapedJobs", job.id);
        await setDoc(ref, job, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore saveScrapedJobs failed:", e);
    }
  }
}

export async function updateScrapedJobStatus(
  jobId: string,
  status: ScrapedJob["status"],
  userId?: string | null
): Promise<ScrapedJob[]> {
  const currentJobs = await getScrapedJobs(userId);
  const updated = currentJobs.map((j) =>
    j.id === jobId ? { ...j, status } : j
  );
  await saveScrapedJobs(updated, userId);
  return updated;
}

// ==========================================
// 5. APPLICATIONS
// ==========================================
export async function getApplications(userId?: string | null): Promise<Application[]> {
  if (isFirebaseConfigured && db && userId) {
    try {
      const colRef = collection(db, "users", userId, "applications");
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Application);
      }
    } catch (e) {
      console.warn("Firestore getApplications failed, fallback to local:", e);
    }
  }

  const localApps = getLocal<Application[] | null>(STORAGE_KEYS.APPLICATIONS, null);
  if (localApps && Array.isArray(localApps)) {
    return localApps;
  }

  setLocal(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  return INITIAL_APPLICATIONS;
}

export async function saveApplication(
  application: Application,
  userId?: string | null
): Promise<Application[]> {
  const currentApps = await getApplications(userId);
  const existingIdx = currentApps.findIndex((a) => a.id === application.id);
  let updated: Application[];
  if (existingIdx >= 0) {
    updated = [...currentApps];
    updated[existingIdx] = application;
  } else {
    updated = [application, ...currentApps];
  }

  setLocal(STORAGE_KEYS.APPLICATIONS, updated);

  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId, "applications", application.id);
      await setDoc(ref, application, { merge: true });
    } catch (e) {
      console.warn("Firestore saveApplication failed:", e);
    }
  }

  return updated;
}

export async function deleteApplication(
  applicationId: string,
  userId?: string | null
): Promise<Application[]> {
  const currentApps = await getApplications(userId);
  const updated = currentApps.filter((a) => a.id !== applicationId);
  setLocal(STORAGE_KEYS.APPLICATIONS, updated);

  if (isFirebaseConfigured && db && userId) {
    try {
      const ref = doc(db, "users", userId, "applications", applicationId);
      await deleteDoc(ref);
    } catch (e) {
      console.warn("Firestore deleteApplication failed:", e);
    }
  }

  return updated;
}
