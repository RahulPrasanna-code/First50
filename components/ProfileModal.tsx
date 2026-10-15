"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
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
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: ProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-slate-700 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Engineer Profile & AI Context
              </h2>
              <p className="text-xs text-slate-400">
                Context provided to Gemini AI to compute match scores, ATS keywords, and HM pitches.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity & Current Role */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Company, Total Experience, Education */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Role & Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Experience
              </label>
              <input
                type="text"
                value={formData.totalExperience}
                onChange={(e) => setFormData({ ...formData, totalExperience: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Education & CGPA
            </label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Shift Hours & Target Compensation */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Shift</label>
              <input
                type="text"
                value={formData.shiftHours}
                onChange={(e) => setFormData({ ...formData, shiftHours: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Baseline CTC
              </label>
              <input
                type="text"
                value={formData.currentCompensation}
                onChange={(e) => setFormData({ ...formData, currentCompensation: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Compensation
              </label>
              <input
                type="text"
                value={formData.targetCompensation}
                onChange={(e) => setFormData({ ...formData, targetCompensation: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Core Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          {/* Quantified Achievements */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Top Quantified Achievements (Cited in AI Pitch Generation)
            </label>
            <div className="space-y-2">
              {formData.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-xs text-emerald-400 mt-1 font-bold">
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
                    className="w-full rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {savedNotice ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Check className="h-4 w-4" />
                Profile saved and synced!
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Changes persist locally and sync to Cloud Firestore when signed in.
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-600/20"
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
