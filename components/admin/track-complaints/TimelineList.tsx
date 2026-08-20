"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function TimelineList({
  technicianGroups,
  basePath = "",
}: {
  technicianGroups: TechnicianGroup[];
  basePath?: string;
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
        <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">
          Adjust search query or status filter to locate technician records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {technicianGroups.map((tech) => {
        const assignedCount = tech.tickets.filter((t) => t.status === "Assigned").length;
        const inProgressCount = tech.tickets.filter((t) => t.status === "In Progress").length;
        const completedCount = tech.tickets.filter(
          (t) => t.status === "Completed" || t.status === "Verified" || t.status === "Closed"
        ).length;

        // Current active ticket (In Progress or Assigned)
        const activeTicket =
          tech.tickets.find((t) => t.status === "In Progress") ||
          tech.tickets.find((t) => t.status === "Assigned");

        // Previous / history tickets worked on (excluding the active ticket)
        const previousTickets = tech.tickets.filter((t) => t.id !== activeTicket?.id);
        const isExpanded = expandedTechIds.has(tech.id);

        return (
          <div
            key={tech.id}
            className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 hover:shadow-md transition-shadow"
          >
            {/* 1. Technician Profile Info Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#464554]/20 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#8083ff] to-[#4edea3] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#8083ff]/20 shrink-0">
                  {tech.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {tech.name}
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Technician
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-0.5">
                    {tech.email} • {tech.phone || "No phone listed"} • {tech.dept || "Maintenance"}
                  </p>
                </div>
              </div>

              {/* Status Summary Pill Counters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  Assigned: {assignedCount}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  In Progress: {inProgressCount}
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  Completed: {completedCount}
                </span>
              </div>
            </div>

            {/* 2. Current Ticket Working On (Compact 1-2 Line Active Ticket Card) */}
            {activeTicket ? (
              <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 sm:p-4 text-xs space-y-2.5">
                {/* Header Row: Working On Label, Ticket Link, Badges, Deadline & View Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                      <Icon name="engineering" className="text-amber-500 animate-pulse text-sm" />
                      Working On:
                    </span>
                    <Link
                      href={`${basePath}/view-complaints/${activeTicket.id}`}
                      className="font-mono font-black text-xs text-primary dark:text-[#c0c1ff] bg-white dark:bg-[#131b2e] px-2.5 py-0.5 rounded-lg border border-amber-500/30 hover:underline hover:scale-105 transition-all shadow-xs"
                      title="Click to view complaint details"
                    >
                      #{activeTicket.ticketNumber ?? "-"}
                    </Link>
                    <StatusBadge status={activeTicket.status} />
                    <PriorityBadge priority={activeTicket.priority} />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const dl = getDeadlineInfo(
                        activeTicket.assignedAt,
                        activeTicket.assignedDate,
                        activeTicket.status
                      );
                      return (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${dl.badgeClass}`}>
                          <Icon name="timer" className="text-xs" />
                          {dl.timeLeftText}
                        </span>
                      );
                    })()}

                    {basePath && (
                      <Link
                        href={`${basePath}/view-complaints/${activeTicket.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-black hover:bg-amber-400 transition-colors shadow-xs shrink-0"
                      >
                        <Icon name="visibility" className="text-xs" />
                        View Active Ticket
                      </Link>
                    )}
                  </div>
                </div>

                {/* Info Row: Category & Location | Description | Assigned Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#908fa0] block">
                      Category & Location
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white truncate block">
                      {activeTicket.category} • {activeTicket.location}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#908fa0] block">
                      Description
                    </span>
                    <span className="text-slate-700 dark:text-[#c7c4d7] truncate block" title={activeTicket.description}>
                      {activeTicket.description || "No description provided."}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#908fa0] block">
                      Assigned Date
                    </span>
                    <span className="text-slate-700 dark:text-[#c7c4d7] font-semibold block">
                      {activeTicket.assignedDate || "Recently assigned"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-[#131b2e]/40 border border-slate-200/60 dark:border-[#464554]/10 rounded-2xl p-3.5 text-xs text-slate-500 dark:text-[#908fa0] flex items-center gap-2">
                <Icon name="check_circle" className="text-emerald-500 text-base" />
                <span>No active ticket currently in progress. All assigned tasks completed!</span>
              </div>
            )}

            {/* 3. Dropdown Card Trigger for Previous Tickets Worked On */}
            <div className="space-y-3 pt-1">
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
                    <Icon name="history" className="text-base" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-extrabold tracking-tight block">
                      Previous Tickets Worked On
                    </span>
                    <span className="text-[10px] opacity-75">
                      Click to {isExpanded ? "hide" : "show"} previous ticket history list
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      isExpanded
                        ? "bg-primary/20 text-[#c0c1ff] border border-primary/30"
                        : "bg-slate-200/80 dark:bg-[#222a3d] text-slate-800 dark:text-[#dae2fd]"
                    }`}
                  >
                    {previousTickets.length} {previousTickets.length === 1 ? "Ticket" : "Tickets"}
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

              {/* 4. Dropdown Card Content: List of Previous Tickets */}
              {isExpanded && (
                <div className="space-y-3 pt-2 pl-2 border-l-2 border-slate-200 dark:border-[#464554]/30 ml-3">
                  {previousTickets.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-[#131b2e]/40 border border-slate-200/60 dark:border-[#464554]/10 rounded-xl p-4 text-xs text-slate-400 text-center">
                      No previous tickets recorded for this technician.
                    </div>
                  ) : (
                    previousTickets.map((ticket) => {
                      return (
                        <div
                          key={ticket.id}
                          className="bg-slate-50 dark:bg-[#131b2e]/60 border border-slate-200/60 dark:border-[#464554]/10 rounded-2xl p-4 space-y-3 hover:border-slate-300 dark:hover:border-[#464554]/30 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/40 dark:border-[#464554]/10 pb-2.5">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[10px] font-bold uppercase text-slate-400">
                                Complaint No:
                              </span>
                              <Link
                                href={`${basePath}/view-complaints/${ticket.id}`}
                                className="font-mono font-bold text-primary dark:text-[#c0c1ff] text-xs hover:underline"
                              >
                                #{ticket.ticketNumber ?? "-"}
                              </Link>
                              <StatusBadge status={ticket.status} />
                              <PriorityBadge priority={ticket.priority} />
                            </div>
                            {basePath && (
                              <Link
                                href={`${basePath}/view-complaints/${ticket.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 dark:bg-[#8083ff] text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
                              >
                                <Icon name="visibility" className="text-xs" />
                                View
                              </Link>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Category</span>
                              <p className="font-bold text-slate-800 dark:text-[#dae2fd]">
                                {ticket.category}
                              </p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-slate-400 block text-[10px]">Description</span>
                              <p className="text-slate-700 dark:text-[#c7c4d7] line-clamp-2">
                                {ticket.description || "No description provided."}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

