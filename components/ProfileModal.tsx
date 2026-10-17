"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
import { signInWithGoogle, signOutUser } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  MapPin,
  Code,
  Award,
  Clock,
  Save,
  Check,
  Cloud,
  LogOut,
  RefreshCw,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  authUser?: FirebaseUser | null;
}

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  authUser,
}: ProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGoogleAction = async (action: "signin" | "switch" | "signout") => {
    setIsAuthLoading(true);
    try {
      if (action === "signout") {
        await signOutUser();
      } else {
        await signInWithGoogle();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-5 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-cyan-500/10 text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Engineer Profile & AI Context
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Context provided to Gemini AI to compute match scores, ATS keywords, and HM pitches.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cloud Account & Sync Card */}
        <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-4 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-indigo/15 dark:bg-brand-cyan/20 text-brand-indigo dark:text-brand-cyan font-bold overflow-hidden border border-indigo-200 dark:border-cyan-500/30">
                {authUser?.photoURL ? (
                  <img src={authUser.photoURL} alt="User" className="h-10 w-10 object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {authUser ? (authUser.displayName || "Google User") : "Local Storage Mode"}
                  </span>
                  {authUser ? (
                    <span className="rounded-full bg-indigo-50 dark:bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono text-brand-indigo dark:text-brand-cyan border border-indigo-200 dark:border-cyan-500/30 font-semibold">
                      Cloud Synced
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 font-semibold">
                      Local Device Only
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {authUser
                    ? authUser.email
                    : "Sign in with Google to sync your job radar, pipeline, and brag sheet across all your devices."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {authUser ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleGoogleAction("switch")}
                    disabled={isAuthLoading}
                    className="flex items-center gap-1.5 rounded-xl border border-hairline-light dark:border-hairline-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-subsurface-light dark:hover:bg-slate-700 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isAuthLoading ? "animate-spin" : ""}`} />
                    <span>Switch Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoogleAction("signout")}
                    disabled={isAuthLoading}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition disabled:opacity-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleGoogleAction("signin")}
                  disabled={isAuthLoading}
                  className="flex items-center gap-2 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-3.5 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition disabled:opacity-50"
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
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity & Current Role */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Company, Total Experience, Education */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Role & Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Experience
              </label>
              <input
                type="text"
                value={formData.totalExperience}
                onChange={(e) => setFormData({ ...formData, totalExperience: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Education & CGPA
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
            />
          </div>

          {/* Shift Hours & Target Compensation */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Shift</label>
              <input
                type="text"
                value={formData.shiftHours}
                onChange={(e) => setFormData({ ...formData, shiftHours: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Baseline CTC
              </label>
              <input
                type="text"
                value={formData.currentCompensation}
                onChange={(e) => setFormData({ ...formData, currentCompensation: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Compensation
              </label>
              <input
                type="text"
                value={formData.targetCompensation}
                onChange={(e) => setFormData({ ...formData, targetCompensation: e.target.value })}
                className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-brand-indigo dark:text-brand-cyan font-bold focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          {/* Core Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Core Tech Stack (Comma separated)
            </label>
            <textarea
              rows={2}
              value={formData.skills.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none font-mono"
            />
          </div>

          {/* Quantified Achievements */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Top Quantified Achievements (Cited in AI Pitch Generation)
            </label>
            <div className="space-y-2">
              {formData.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-xs text-brand-indigo dark:text-brand-cyan mt-2 font-bold">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={ach}
                    onChange={(e) => {
                      const updated = [...formData.achievements];
                      updated[idx] = e.target.value;
                      setFormData({ ...formData, achievements: updated });
                    }}
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark p-2 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-hairline-light dark:border-hairline-dark">
            {savedNotice ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                Profile saved and synced!
              </span>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Changes persist locally and sync to Cloud Firestore when signed in.
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan px-5 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs hover:opacity-95 transition"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
