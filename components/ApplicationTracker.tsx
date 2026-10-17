"use client";

import React, { useState } from "react";
import { Application, ApplicationStatus } from "@/types";
import { isPast72Hours, getHoursAgo } from "@/lib/utils";
import {
  Layers,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  User,
  ShieldCheck,
  XCircle,
  X,
} from "lucide-react";

interface ApplicationTrackerProps {
  applications: Application[];
  onSaveApplication: (app: Application) => void;
  onDeleteApplication: (appId: string) => void;
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
  onShowToast?: (message: string) => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  "HM DM Sent",
  "Applied (<4h)",
  "Referred",
  "OA / Screening",
  "Interviewing",
  "Offer",
  "Rejected",
];

export function ApplicationTracker({
  applications,
  onSaveApplication,
  onDeleteApplication,
  onUpdateStatus,
  onShowToast,
}: ApplicationTrackerProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [resilienceToast, setResilienceToast] = useState<string | null>(null);

  // New Application Modal State
  const [newCompany, setNewCompany] = useState("");
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newJobId, setNewJobId] = useState("");
  const [newLocation, setNewLocation] = useState<Application["location"]>("Bengaluru");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("HM DM Sent");
  const [newContact, setNewContact] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const triggerResilienceLoop = (company: string) => {
    const msg = `🛡️ Resilience Telemetry Logged: 1 strike recorded toward your weekly quota of 25. Rejection is just telemetry for ${company}—redirecting momentum to your next high-ROI target!`;
    setResilienceToast(msg);
    if (onShowToast) onShowToast(msg);
    setTimeout(() => setResilienceToast(null), 5000);
  };

  const handleCopyNudge = async (app: Application) => {
    const contact = app.contactName ? app.contactName.split(" ")[0] : "there";
    const nudge = `Hi ${contact}, following up on my note regarding the ${app.roleTitle} position at ${app.company}. Still very keen on contributing to the backend platform with my experience in scaling Java microservices to 2.1B+ communications. Hope you have a great week ahead!`;

    try {
      await navigator.clipboard.writeText(nudge);
      setCopiedAppId(app.id);
      setTimeout(() => setCopiedAppId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = (app: Application, status: ApplicationStatus) => {
    onUpdateStatus(app.id, status);
    if (status === "Rejected") {
      triggerResilienceLoop(app.company);
    }
  };

  const handleMarkGhostedRecovery = (app: Application) => {
    onUpdateStatus(app.id, "Rejected");
    triggerResilienceLoop(app.company);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRoleTitle) return;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      company: newCompany,
      roleTitle: newRoleTitle,
      jobIdOrUrl: newJobId || "Direct",
      location: newLocation,
      status: newStatus,
      contactName: newContact || "Engineering Team",
      appliedDate: new Date().toISOString(),
      followUpDueDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      pitchUsed: "",
      notes: newNotes,
    };

    onSaveApplication(newApp);
    setShowAddModal(false);
    // Reset form
    setNewCompany("");
    setNewRoleTitle("");
    setNewJobId("");
    setNewContact("");
    setNewNotes("");
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "follow-up") {
      const isDue =
        (app.status === "HM DM Sent" || app.status === "Referred") &&
        isPast72Hours(app.appliedDate);
      return isDue;
    }
    return app.status === filterStatus;
  });

  const followUpDueCount = applications.filter(
    (a) => (a.status === "HM DM Sent" || a.status === "Referred") && isPast72Hours(a.appliedDate)
  ).length;

  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case "Offer":
        return "border-emerald-300 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold";
      case "Interviewing":
        return "border-purple-300 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-semibold";
      case "OA / Screening":
        return "border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "Referred":
        return "border-teal-300 dark:border-teal-500/40 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300";
      case "HM DM Sent":
        return "border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300";
      case "Applied (<4h)":
        return "border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-brand-indigo dark:text-brand-cyan";
      case "Rejected":
        return "border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark text-slate-500 dark:text-slate-400";
      default:
        return "border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* Resilience Telemetry Toast Notification */}
      {resilienceToast && (
        <div className="rounded-2xl border border-indigo-200 dark:border-cyan-500/40 bg-indigo-50/90 dark:bg-[#0C1728] p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-md flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 text-brand-indigo dark:text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Resilience Recovery Loop Activated</div>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">{resilienceToast}</p>
            </div>
          </div>
          <button
            onClick={() => setResilienceToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-indigo dark:text-brand-cyan" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Application Pipeline & 72-Hour Nudge Radar
            </h2>
            {followUpDueCount > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                <AlertTriangle className="h-3 w-3" />
                {followUpDueCount} Follow-Up{followUpDueCount > 1 ? "s" : ""} Due
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Automated tracking with 72-hour trigger: alerts you to send high-signal follow-ups when HM pitches or referrals sit unread.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 font-bold px-3.5 py-2 text-xs shadow-xs hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Log Application</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <button
          onClick={() => setFilterStatus("all")}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            filterStatus === "all"
              ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
              : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          All ({applications.length})
        </button>

        <button
          onClick={() => setFilterStatus("follow-up")}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            filterStatus === "follow-up"
              ? "bg-rose-600 dark:bg-rose-500 text-white shadow-xs"
              : "border border-rose-300 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/10"
          }`}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>72h Due ({followUpDueCount})</span>
        </button>

        {STATUS_OPTIONS.map((status) => {
          const count = applications.filter((a) => a.status === status).length;
          if (count === 0 && filterStatus !== status) return null;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === status
                  ? "bg-brand-indigo dark:bg-brand-cyan text-white dark:text-slate-950 shadow-xs"
                  : "bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications Cards */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="rounded-2xl p-10 text-center border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-indigo-50 dark:bg-[#0C1728] text-brand-indigo dark:text-brand-cyan mb-3 border border-indigo-200 dark:border-cyan-500/30">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Application Pipeline is Empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              As you apply to roles or send HM pitches, click &quot;Log Application&quot; above or use &quot;Save to Pipeline&quot; from the Morning Radar or Pitch Studio. The 72-hour nudge radar will automatically track follow-up deadlines for you.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const isDue =
              (app.status === "HM DM Sent" || app.status === "Referred") &&
              isPast72Hours(app.appliedDate);
            const hoursAgo = getHoursAgo(app.appliedDate);

            return (
              <div
                key={app.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                  isDue
                    ? "border-rose-300 dark:border-rose-500/50 bg-rose-50/40 dark:bg-rose-950/10 shadow-xs"
                    : "border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-brand-indigo/30 dark:hover:border-brand-cyan/30"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left Column: Company, Role, Contact */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{app.company}</span>
                      <span className="rounded bg-subsurface-light dark:bg-subsurface-dark px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-hairline-light dark:border-hairline-dark">
                        {app.location}
                      </span>
                      {app.jobIdOrUrl && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {app.jobIdOrUrl}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{app.roleTitle}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {app.contactName || "No contact specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Applied {hoursAgo}h ago ({new Date(app.appliedDate).toLocaleDateString()})
                      </span>
                    </div>

                    {app.notes && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-subsurface-light dark:bg-subsurface-dark p-2.5 rounded-xl border border-hairline-light dark:border-hairline-dark font-mono">
                        {app.notes}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Status Dropdown & 72h Nudge Action */}
                  <div className="flex flex-col items-end gap-2.5">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold focus:outline-none ${getStatusBadgeStyle(
                          app.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                            {opt}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="rounded-lg p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition"
                        title="Delete application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* 72h Follow-Up Due Alert, 1-Click Copy Nudge & Recovery Loop */}
                    {isDue && (
                      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-500/40 bg-rose-50/80 dark:bg-rose-500/10 px-3 py-1.5 text-xs text-rose-800 dark:text-rose-300">
                        <span className="flex items-center gap-1 font-bold">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          72h Nudge Due
                        </span>

                        <button
                          onClick={() => handleCopyNudge(app)}
                          className="flex items-center gap-1 rounded-lg bg-rose-200/60 dark:bg-rose-500/20 px-2 py-0.5 text-[11px] font-bold text-rose-900 dark:text-rose-200 hover:bg-rose-200 transition"
                        >
                          {copiedAppId === app.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-300">Nudge Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Nudge</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleMarkGhostedRecovery(app)}
                          className="flex items-center gap-1 rounded-lg border border-rose-300 dark:border-rose-500/30 bg-white dark:bg-[#070E1A] px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
                          title="Mark as Ghosted/Rejected and log resilience telemetry"
                        >
                          <ShieldCheck className="h-3 w-3 text-rose-500" />
                          <span>Log Recovery Strike</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl p-6 border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Log New Application / Referral</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Razorpay"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder="e.g. SDE-2 Backend"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job ID or Link</label>
                  <input
                    type="text"
                    value={newJobId}
                    onChange={(e) => setNewJobId(e.target.value)}
                    placeholder="RZP-991"
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value as Application["location"])}
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person / EM Name
                </label>
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="e.g. Arun Kumar (EM)"
                  className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Referral submitted via Workday; pitch emphasized 2.1B+ scale..."
                  className="w-full rounded-xl border border-hairline-light dark:border-hairline-dark bg-subsurface-light dark:bg-subsurface-dark px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-indigo dark:focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-hairline-light dark:border-hairline-dark">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-indigo dark:bg-brand-cyan hover:opacity-95 px-4 py-2 text-xs font-bold text-white dark:text-slate-950 shadow-xs transition"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
