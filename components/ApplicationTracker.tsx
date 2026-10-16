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
} from "lucide-react";

interface ApplicationTrackerProps {
  applications: Application[];
  onSaveApplication: (app: Application) => void;
  onDeleteApplication: (appId: string) => void;
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
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
}: ApplicationTrackerProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Application Modal State
  const [newCompany, setNewCompany] = useState("");
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newJobId, setNewJobId] = useState("");
  const [newLocation, setNewLocation] = useState<Application["location"]>("Bengaluru");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("HM DM Sent");
  const [newContact, setNewContact] = useState("");
  const [newNotes, setNewNotes] = useState("");

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

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case "Offer":
        return "border-emerald-500/50 bg-emerald-500/20 text-emerald-300 font-bold";
      case "Interviewing":
        return "border-purple-500/40 bg-purple-500/10 text-purple-300 font-semibold";
      case "OA / Screening":
        return "border-blue-500/40 bg-blue-500/10 text-blue-300";
      case "Referred":
        return "border-teal-500/40 bg-teal-500/10 text-teal-300";
      case "HM DM Sent":
        return "border-amber-500/40 bg-amber-500/10 text-amber-300";
      case "Applied (<4h)":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "Rejected":
        return "border-slate-700 bg-slate-800 text-slate-500";
      default:
        return "border-slate-700 bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Stats Bar */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Application Pipeline & 72-Hour Nudge Radar
            </h2>
            {followUpDueCount > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                {followUpDueCount} Follow-Up{followUpDueCount > 1 ? "s" : ""} Due!
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Automated tracking with 72-hour trigger: alerts you to send high-signal follow-ups when HM pitches or referrals sit unread.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3.5 py-2 text-xs shadow-lg shadow-emerald-600/20 transition-all"
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
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filterStatus === "all"
              ? "bg-slate-700 text-white"
              : "bg-slate-900/60 text-slate-400 hover:text-white"
          }`}
        >
          All ({applications.length})
        </button>

        <button
          onClick={() => setFilterStatus("follow-up")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            filterStatus === "follow-up"
              ? "border border-amber-500/40 bg-amber-500/20 text-amber-300"
              : "border border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10"
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
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                filterStatus === status
                  ? "bg-slate-700 text-white"
                  : "bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mb-3 border border-slate-700">
              <Layers className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Application Pipeline is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              As you apply to roles or send HM pitches, click "Log Application" above or use "Save to Pipeline" from the Morning Radar or Pitch Studio. The 72-hour nudge radar will automatically track follow-up deadlines for you.
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
                className={`glass-panel rounded-2xl p-4 border transition-all ${
                  isDue
                    ? "border-amber-500/50 bg-amber-950/10 amber-glow"
                    : "border-slate-800/90 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Left Column: Company, Role, Contact */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-base">{app.company}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                        {app.location}
                      </span>
                      {app.jobIdOrUrl && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {app.jobIdOrUrl}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-medium text-slate-200">{app.roleTitle}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        {app.contactName || "No contact specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        Applied {hoursAgo}h ago ({new Date(app.appliedDate).toLocaleDateString()})
                      </span>
                    </div>

                    {app.notes && (
                      <p className="mt-2 text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 font-mono">
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
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none ${getStatusBadgeStyle(
                          app.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="rounded-lg p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* 72h Follow-Up Due Alert & 1-Click Copy */}
                    {isDue && (
                      <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300">
                        <span className="flex items-center gap-1 font-bold">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          72h Nudge Due!
                        </span>

                        <button
                          onClick={() => handleCopyNudge(app)}
                          className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-200 hover:bg-amber-500/30 transition-colors"
                        >
                          {copiedAppId === app.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-300">Nudge Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Nudge</span>
                            </>
                          )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Log New Application / Referral</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Razorpay"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    placeholder="e.g. SDE-2 Backend"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job ID or Link</label>
                  <input
                    type="text"
                    value={newJobId}
                    onChange={(e) => setNewJobId(e.target.value)}
                    placeholder="RZP-991"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Person / EM Name
                </label>
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="e.g. Arun Kumar (EM)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Referral submitted via Workday; pitch emphasized 2.1B+ scale..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-600/20"
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
