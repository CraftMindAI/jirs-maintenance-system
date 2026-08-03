"use client";

import Icon from "@/components/ui/Icon";
import { Complaint } from "@/app/dashboard/page";

const STEPS = [
  {
    key: "Pending",
    label: "Pending",
    subtitle: "Submitted & Queued",
    icon: "pending_actions",
    description: "Complaint logged into system and awaiting admin verification.",
  },
  {
    key: "Approved",
    label: "Approved",
    subtitle: "Verified by Admin",
    icon: "check_circle",
    description: "Complaint verified and approved for maintenance dispatch.",
  },
  {
    key: "Rejected",
    label: "Rejected",
    subtitle: "Ticket Declined",
    icon: "cancel",
    description: "Complaint ticket was reviewed and rejected by administration.",
  },
  {
    key: "Assigned",
    label: "Technician Assigned",
    subtitle: "Staff Allocated",
    icon: "assignment_ind",
    description: "Technician assigned to inspect and resolve issue.",
  },
  {
    key: "In Progress",
    label: "In Progress",
    subtitle: "Work Ongoing",
    icon: "build",
    description: "Maintenance work is actively being carried out on site.",
  },
  {
    key: "Completed",
    label: "Completed",
    subtitle: "Work Done",
    icon: "task_alt",
    description: "Maintenance work completed by technician.",
  },
  {
    key: "Closed",
    label: "Closed",
    subtitle: "Admin Verified",
    icon: "verified",
    description: "Admin reviewed completion evidence and officially closed ticket.",
  },
];

const STANDARD_STEPS = ["Pending", "Approved", "Assigned", "In Progress", "Completed", "Closed"];
const REJECTED_STEPS = ["Pending", "Rejected"];

export default function ComplaintTrackDetailsCard({ complaint }: { complaint: Complaint }) {
  const currentStatus = complaint.status || "Pending";
  const isRejected = currentStatus === "Rejected";

  const displaySteps = isRejected
    ? STEPS.filter((s) => REJECTED_STEPS.includes(s.key))
    : STEPS.filter((s) => STANDARD_STEPS.includes(s.key));

  const normStatus = currentStatus === "Verified" ? "Closed" : currentStatus;
  const activeIdx = isRejected ? 1 : Math.max(0, STANDARD_STEPS.indexOf(normStatus));

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm dark:vibrant-shadow space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#464554]/10 pb-4">
        <div className="flex items-center gap-2">
          <Icon name="alt_route" className={`text-xl ${isRejected ? "text-rose-600 dark:text-[#ff516a]" : "text-emerald-600 dark:text-[#00a572]"}`} />
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-[#dae2fd]">
            Live Track & Status Timeline
          </h3>
        </div>
        <span className={`text-[10px] font-mono px-3 py-1 rounded-full border shadow-sm font-bold ${
          isRejected
            ? "text-rose-600 dark:text-[#ff516a] bg-rose-500/15 border-rose-500/30"
            : "text-emerald-600 dark:text-[#4edea3] bg-emerald-500/15 border-emerald-500/30"
        }`}>
          Current: {currentStatus}
        </span>
      </div>

      {isRejected && (
        <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-rose-700 dark:text-[#ffb2b7] font-bold">
          <Icon name="cancel" className="text-xl text-rose-600 dark:text-[#ff516a]" />
          <span>This complaint ticket has been rejected by administration.</span>
        </div>
      )}

      {/* Horizontal Progress Bar for Large Screens */}
      <div className="hidden md:block py-6 px-2">
        <div className="flex items-start justify-between relative">
          {displaySteps.map((step, idx) => {
            const isReached = idx <= activeIdx;
            const isCurrent = idx === activeIdx;
            const isLast = idx === displaySteps.length - 1;
            const lineIsFilled = idx < activeIdx;

            const isStepRejected = isRejected && step.key === "Rejected";

            return (
              <div key={idx} className="flex-1 flex items-center relative">
                {/* Step Node */}
                <div className="flex flex-col items-center gap-2.5 text-center shrink-0 w-28 mx-auto z-10">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isStepRejected
                        ? "bg-rose-600 dark:bg-[#ff516a] border-rose-600 dark:border-[#ff516a] text-white shadow-lg shadow-rose-600/50 ring-4 ring-rose-600/20"
                        : isReached
                        ? "bg-emerald-600 dark:bg-[#00a572] border-emerald-600 dark:border-[#00a572] text-white shadow-lg shadow-emerald-600/50 ring-4 ring-emerald-600/20"
                        : "bg-slate-100 dark:bg-[#131b2e] border-slate-200 dark:border-[#464554]/30 text-slate-400 dark:text-[#908fa0]"
                    } ${isCurrent && !isStepRejected ? "scale-110 ring-4 ring-emerald-600/30" : ""}`}
                  >
                    {idx < activeIdx && !isStepRejected ? (
                      <Icon name="check" className="text-sm font-black text-white" />
                    ) : (
                      <Icon name={step.icon} className="text-base" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span
                      className={`text-[11px] font-bold block ${
                        isStepRejected
                          ? "text-rose-600 dark:text-[#ff516a]"
                          : isReached
                          ? "text-emerald-700 dark:text-[#4edea3]"
                          : "text-slate-500 dark:text-[#908fa0]"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-[#908fa0] block">
                      {step.subtitle}
                    </span>
                  </div>
                </div>

                {/* Connecting Line between steps */}
                {!isLast && (
                  <div
                    className={`absolute left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] top-[20px] -translate-y-1/2 h-[3px] transition-all duration-500 rounded-full z-0 ${
                      lineIsFilled
                        ? isRejected
                          ? "bg-rose-600 dark:bg-[#ff516a] shadow-[0_0_8px_#ff516a]"
                          : "bg-emerald-600 dark:bg-[#00a572] shadow-[0_0_8px_#00a572]"
                        : "bg-slate-200 dark:bg-[#131b2e]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Detailed Timeline Steps */}
      <div className="space-y-4 pt-2">
        {displaySteps.map((step, idx) => {
          const isReached = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          const isLast = idx === displaySteps.length - 1;
          const isStepRejected = isRejected && step.key === "Rejected";

          return (
            <div key={idx} className="flex items-start gap-4 relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-4 top-9 bottom-0 w-[2px] ${
                    idx < activeIdx
                      ? isRejected
                        ? "bg-rose-600 dark:bg-[#ff516a]"
                        : "bg-emerald-600 dark:bg-[#00a572]"
                      : "bg-slate-200 dark:bg-[#131b2e]"
                  }`}
                />
              )}

              {/* Status Circle Button */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs shrink-0 z-10 transition-all duration-300 ${
                  isStepRejected
                    ? "bg-rose-600 dark:bg-[#ff516a] border-rose-600 dark:border-[#ff516a] text-white shadow-lg shadow-rose-600/40"
                    : isReached
                    ? "bg-emerald-600 dark:bg-[#00a572] border-emerald-600 dark:border-[#00a572] text-white shadow-lg shadow-emerald-600/40"
                    : "bg-slate-100 dark:bg-[#131b2e] border-slate-200 dark:border-[#464554]/30 text-slate-400 dark:text-[#908fa0]"
                }`}
              >
                <Icon name={idx < activeIdx && !isStepRejected ? "check" : step.icon} className="text-sm" />
              </div>

              {/* Status Details Card */}
              <div
                className={`flex-1 p-4 rounded-2xl border transition-all ${
                  isStepRejected
                    ? "bg-rose-500/10 dark:bg-[#ff516a]/15 border-rose-500/30 dark:border-[#ff516a]/40 shadow-md"
                    : isCurrent
                    ? "bg-emerald-500/10 dark:bg-[#00a572]/15 border-emerald-500/30 dark:border-[#00a572]/40 shadow-md"
                    : isReached
                    ? "bg-slate-50 dark:bg-[#131b2e]/80 border-emerald-500/20 dark:border-[#00a572]/20"
                    : "bg-slate-50/50 dark:bg-[#131b2e]/30 border-slate-200 dark:border-[#464554]/10 opacity-60"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4
                    className={`font-bold text-xs ${
                      isStepRejected
                        ? "text-rose-600 dark:text-[#ff516a]"
                        : isReached
                        ? "text-emerald-700 dark:text-[#4edea3]"
                        : "text-slate-800 dark:text-[#dae2fd]"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <span
                    className={`text-[10px] font-mono ${
                      isStepRejected
                        ? "text-rose-600 dark:text-[#ff516a]"
                        : isReached
                        ? "text-emerald-700 dark:text-[#4edea3]"
                        : "text-slate-400 dark:text-[#908fa0]"
                    }`}
                  >
                    {step.key === "Pending" && (complaint.date || "Date Logged")}
                    {step.key === "Assigned" && complaint.technicianName && `Assigned: ${complaint.assignedDate || "Today"}`}
                    {isCurrent && " (Active Stage)"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-[#c7c4d7] mt-1 leading-relaxed">
                  {step.key === "Assigned" && complaint.technicianName
                    ? `Assigned to ${complaint.technicianName} (${complaint.technicianPhone || "Phone unavailable"}).`
                    : step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
