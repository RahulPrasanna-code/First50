"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
import { User } from "firebase/auth";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Briefcase,
  MapPin,
  Code2,
  DollarSign,
  Award,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  authUser: User;
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingModal({ isOpen, authUser, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState<string>(authUser.displayName || "");
  const [email] = useState<string>(authUser.email || "");
  const [currentRole, setCurrentRole] = useState<string>("Software Engineer");
  const [company, setCompany] = useState<string>("");
  const [totalExperience, setTotalExperience] = useState<string>("2+ Years");
  const [shiftHours, setShiftHours] = useState<string>("10:00 AM – 7:00 PM IST");
  const [targetRoles, setTargetRoles] = useState<string[]>([
    "SDE-2",
    "Backend Software Engineer",
    "Distributed Systems Engineer",
  ]);
  const [targetLocations, setTargetLocations] = useState<string[]>([
    "Bengaluru, India",
    "Remote",
  ]);
  const [currentCompensation, setCurrentCompensation] = useState<string>("15 LPA Base");
  const [targetCompensation, setTargetCompensation] = useState<string>("25 to 40 LPA");
  const [skills, setSkills] = useState<string[]>([
    "Java",
    "Spring Boot",
    "Distributed Systems",
    "Kafka",
    "PostgreSQL",
    "Redis",
    "AWS",
    "Kubernetes",
    "REST APIs",
  ]);
  const [achievements, setAchievements] = useState<string[]>([
    "Architected high-throughput backend microservices sustaining production workloads with 99.99% availability.",
    "Reduced API latency and optimized database queries to scale system throughput under peak traffic.",
  ]);

  if (!isOpen) return null;

  const toggleLocation = (loc: string) => {
    if (targetLocations.includes(loc)) {
      setTargetLocations(targetLocations.filter((l) => l !== loc));
    } else {
      setTargetLocations([...targetLocations, loc]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UserProfile = {
      name: name || "Software Engineer",
      email,
      currentRole,
      company: company || "Current Engineering Team",
      totalExperience,
      education: "B.Tech in Engineering / Computer Science",
      shiftHours,
      targetRoles,
      targetLocations,
      currentCompensation,
      targetCompensation,
      skills,
      achievements,
    };
    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950/95 p-6 sm:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
        {/* Header & Steps Indicator */}
        <div className="border-b border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              F50
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Welcome to First50 &middot; 60-Second Setup
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Personalize Your Job Hunt Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            We will calibrate your AI match score, morning radar filters, and customized cold pitches based on your targets.
          </p>

          {/* Progress Bar */}
          <div className="mt-4 flex items-center justify-between gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-emerald-500" : "bg-slate-800"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span className={step >= 1 ? "text-emerald-400 font-bold" : ""}>1. Role & Cities</span>
            <span className={step >= 2 ? "text-emerald-400 font-bold" : ""}>2. Tech Stack</span>
            <span className={step >= 3 ? "text-emerald-400 font-bold" : ""}>3. Target CTC</span>
          </div>
        </div>

        {/* ========================================================
            STEP 1: ROLE & LOCATIONS
        ======================================================== */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Preferred Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Sharma"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Role Title
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Company (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. FinTech / Enterprise SaaS"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Cities (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Bengaluru, India",
                  "Chennai, India",
                  "Hyderabad, India",
                  "Pune, India",
                  "Gurgaon, India",
                  "Remote",
                ].map((loc) => {
                  const selected = targetLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selected
                          ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white"
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      <span>{loc}</span>
                      {selected && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                <span>Continue to Tech Stack</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: TECH STACK & EXPERIENCE
        ======================================================== */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Years of Experience
                </label>
                <select
                  value={totalExperience}
                  onChange={(e) => setTotalExperience(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="1-2 Years">1–2 Years (SDE-1 / Early Career)</option>
                  <option value="2+ Years">2+ Years (SDE-2 Candidate)</option>
                  <option value="3-5 Years">3–5 Years (SDE-2 / Senior)</option>
                  <option value="5+ Years">5+ Years (Lead / Staff)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Work Shift Window
                </label>
                <input
                  type="text"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(e.target.value)}
                  placeholder="e.g. 10:00 AM – 7:00 PM IST"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Core Tech Stack & Systems (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Java",
                  "Spring Boot",
                  "Go",
                  "Python",
                  "Distributed Systems",
                  "Kafka",
                  "Redis",
                  "PostgreSQL",
                  "DynamoDB",
                  "AWS",
                  "Kubernetes",
                  "Docker",
                  "REST APIs",
                  "Microservices",
                  "SQL",
                  "CI/CD",
                ].map((skill) => {
                  const selected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                        selected
                          ? "border-purple-500/50 bg-purple-500/20 text-purple-300 font-semibold"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                      }`}
                    >
                      {skill} {selected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                <span>Continue to Goals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: COMPENSATION & TARGETS
        ======================================================== */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current CTC (Private to you)
                </label>
                <input
                  type="text"
                  value={currentCompensation}
                  onChange={(e) => setCurrentCompensation(e.target.value)}
                  placeholder="e.g. 15 LPA Base"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target CTC Goal
                </label>
                <input
                  type="text"
                  value={targetCompensation}
                  onChange={(e) => setTargetCompensation(e.target.value)}
                  placeholder="e.g. 28 to 45 LPA"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <Sparkles className="h-4 w-4" />
                <span>All Set! Your Private Command Center is Ready.</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your data is stored securely in your private cloud partition. You can update your profile, brag sheet, and targets anytime from the dashboard.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                <Check className="h-4 w-4" />
                <span>Launch My Command Center</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
