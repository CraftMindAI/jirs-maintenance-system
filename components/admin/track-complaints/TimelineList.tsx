"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Complaint } from "@/types/complaint";
import { getDeadlineInfo } from "@/utils/deadline";

export interface TechnicianGroup {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dept?: string;
  tickets: Complaint[];
}

const TIMELINE_STEPS = [
  { key: "Pending", label: "Submitted" },
  { key: "Approved", label: "Approved" },
  { key: "Assigned", label: "Assigned" },
  { key: "In Progress", label: "In Progress" },
  { key: "Completed", label: "Completed" },
  { key: "Closed", label: "Closed" },
];

const getStepStatus = (stepKey: string, currentStatus: string) => {
  const order = ["Pending", "Approved", "Assigned", "In Progress", "Completed", "Verified", "Closed"];
  let currentIdx = order.indexOf(currentStatus);
  if (currentIdx === -1) currentIdx = 0;
  
  let stepIdx = order.indexOf(stepKey);
  if (stepKey === "Closed" && (currentStatus === "Closed" || currentStatus === "Verified")) {
    return currentIdx >= order.indexOf("Verified") ? (currentStatus === "Closed" || currentStatus === "Verified" ? "completed" : "active") : "pending";
  }

  if (currentIdx > stepIdx) return "completed";
  if (currentIdx === stepIdx) return "active";
  return "pending";
};

export default function TimelineList({
  technicianGroups,
}: {
  technicianGroups: TechnicianGroup[];
}) {
  const [expandedTechIds, setExpandedTechIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (techId: string) => {
    setExpandedTechIds((prev) => {
      const next = new Set(prev);
      if (next.has(techId)) {
        next.delete(techId);
      } else {
        next.add(techId);
      }
      return next;
    });
  };

  if (technicianGroups.length === 0) {
    return (
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-8 md:p-16 text-center shadow-sm">
        <Icon name="engineering" className="text-4xl text-slate-400 dark:text-[#908fa0] mb-3 block mx-auto" />
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-[#dae2fd]">No Tracking Data Found</h3>
        <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">Adjust search query or status filter to locate technician records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Render Each Technician & All Their Tickets (Assigned, In Progress, Completed) */}
      {technicianGroups.map((tech) => {
        const assignedCount = tech.tickets.filter((t) => t.status === "Assigned").length;
        const inProgressCount = tech.tickets.filter((t) => t.status === "In Progress").length;
        const completedCount = tech.tickets.filter((t) => t.status === "Completed").length;

        // Active ticket (In Progress or Assigned)
        const activeTicket = tech.tickets.find((t) => t.status === "In Progress") || tech.tickets.find((t) => t.status === "Assigned");
        const isExpanded = expandedTechIds.has(tech.id);

        return (
          <div
            key={tech.id}
            className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 dark:vibrant-shadow"
          >
            {/* Technician Profile Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#464554]/20 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8083ff] to-[#4edea3] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-[#8083ff]/20 shrink-0">
                  {tech.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{tech.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-0.5">
                    {tech.email} • {tech.phone || "No phone listed"} • {tech.dept || "Maintenance"}
                  </p>
                </div>
              </div>

              {/* Status Counters */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                  Assigned: {assignedCount}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                  In Progress: {inProgressCount}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  Completed: {completedCount}
                </span>
              </div>
            </div>

            {/* Currently Working On Highlight Box */}
            {activeTicket ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                    <Icon name="engineering" className="text-amber-500 animate-pulse text-base" />
                    ⚡ Working On Right Now: <span className="font-mono text-slate-900 dark:text-white">{activeTicket.id}</span>
                  </div>
                  {(() => {
                    const dl = getDeadlineInfo(activeTicket.assignedAt, activeTicket.assignedDate, activeTicket.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${dl.badgeClass}`}>
                        <Icon name="timer" className="text-sm" />
                        3-Day Deadline: {dl.timeLeftText}
                      </span>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-[#908fa0] block">Category & Location</span>
                    <span className="font-bold text-slate-800 dark:text-white">{activeTicket.category} • {activeTicket.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#908fa0] block">Description</span>
                    <span className="text-slate-700 dark:text-[#c7c4d7] line-clamp-2">{activeTicket.description || "No description."}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#908fa0] block">Technician Remarks</span>
                    <span className="text-slate-700 dark:text-[#c7c4d7] italic">{activeTicket.remarks || "Work in progress..."}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-[#131b2e]/40 border border-slate-200/60 dark:border-[#464554]/10 rounded-2xl p-4 text-xs text-slate-500 dark:text-[#908fa0] flex items-center gap-2">
                <Icon name="check_circle" className="text-emerald-500 text-base" />
                No active pending tasks. Technician has completed all assigned tickets!
              </div>
            )}

            {/* List of All Tickets for this Technician */}
            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={() => toggleExpanded(tech.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
                  isExpanded
                    ? "bg-slate-900 text-white dark:bg-[#131b2e] dark:text-[#dae2fd] border-slate-800 dark:border-[#8083ff]/40 ring-2 ring-primary/20 dark:ring-[#8083ff]/20"
                    : "bg-slate-50 dark:bg-[#131b2e]/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#464554]/20 hover:bg-slate-100 dark:hover:bg-[#171f33]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black transition-colors ${
                      isExpanded
                        ? "bg-primary text-white dark:bg-[#8083ff] dark:text-slate-950"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-[#908fa0]"
                    }`}
                  >
                    <Icon name="assignment" className="text-base" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold font-display tracking-tight block">
                      All Tickets Handled By {tech.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-70">
                      Click to {isExpanded ? "collapse" : "expand"} ticket history
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-black ${
                      isExpanded
                        ? "bg-primary/20 text-[#c0c1ff] border border-primary/30"
                        : "bg-slate-200/80 dark:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd]"
                    }`}
                  >
                    {tech.tickets.length} {tech.tickets.length === 1 ? "Ticket" : "Tickets"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                      isExpanded ? "rotate-180 bg-white/10" : "bg-transparent"
                    }`}
                  >
                    <Icon name="expand_more" className="text-lg" />
                  </div>
                </div>
              </button>

              {isExpanded && tech.tickets.map((ticket) => {
                const deadline = getDeadlineInfo(ticket.assignedAt, ticket.assignedDate, ticket.status);
                return (
                  <div
                    key={ticket.id}
                    className="bg-slate-50 dark:bg-[#131b2e]/60 border border-slate-200/60 dark:border-[#464554]/10 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/40 dark:border-[#464554]/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-primary dark:text-[#c0c1ff] text-sm">
                          {ticket.id}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] ${deadline.badgeClass}`}>
                        <Icon name="timer" className="text-xs" />
                        {deadline.timeLeftText}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Category & Location</span>
                        <p className="font-bold text-slate-800 dark:text-[#dae2fd]">
                          {ticket.category} • <span className="font-normal text-slate-500">{ticket.location}</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Description</span>
                        <p className="text-slate-700 dark:text-[#c7c4d7] line-clamp-2">
                          {ticket.description || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Assigned Date & Remarks</span>
                        <p className="text-slate-700 dark:text-[#c7c4d7] italic">
                          {ticket.assignedDate || "Assigned"} • {ticket.remarks || "No remarks"}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="overflow-x-auto pt-2">
                      <div className="min-w-[500px] flex items-center justify-between relative px-2">
                        <div className="absolute top-[14px] left-8 right-8 h-[2px] bg-slate-200 dark:bg-[#131b2e] pointer-events-none" />

                        {TIMELINE_STEPS.map((step, idx) => {
                          const status = getStepStatus(step.key, ticket.status);
                          return (
                            <div key={idx} className="relative flex flex-col items-center gap-1.5 text-center z-10 w-20">
                              <span
                                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                                  status === "completed"
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : status === "active"
                                    ? "bg-primary dark:bg-[#8083ff] border-primary text-white scale-110 shadow-md"
                                    : "bg-white dark:bg-[#171f33] border-slate-300 dark:border-[#464554]/40 text-slate-400"
                                }`}
                              >
                                {status === "completed" ? "✓" : idx + 1}
                              </span>
                              <span
                                className={`text-[9px] font-mono uppercase tracking-wider ${
                                  status === "completed"
                                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                    : status === "active"
                                    ? "text-primary dark:text-[#c0c1ff] font-black"
                                    : "text-slate-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
