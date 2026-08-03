"use client";

import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Complaint } from "@/app/dashboard/page";

export default function ComplaintInfoCard({
  complaint,
  isAdmin,
  onApprove,
  onReject,
  onVerify,
  onReopen,
  updatingStatus,
}: {
  complaint: Complaint;
  isAdmin?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onVerify?: () => void;
  onReopen?: () => void;
  updatingStatus?: boolean;
}) {
  const normalizedStatus = (complaint.status || "").toLowerCase();
  const isPendingStatus = normalizedStatus.includes("pending");
  const isCompletedStatus = normalizedStatus.includes("completed") || normalizedStatus.includes("resolved");

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm dark:vibrant-shadow space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#464554]/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
              Ticket #{complaint.id}
            </h1>
            <PriorityBadge priority={complaint.priority} />
          </div>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1 font-mono">
            Logged on {complaint.date || "N/A"}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 dark:text-[#908fa0] uppercase tracking-wider block">
            Category
          </span>
          <p className="font-bold text-slate-800 dark:text-[#dae2fd]">
            {complaint.category}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 dark:text-[#908fa0] uppercase tracking-wider block">
            Location
          </span>
          <p className="font-bold text-slate-800 dark:text-[#dae2fd]">
            {complaint.location}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#464554]/10">
        <span className="text-[10px] font-mono text-slate-400 dark:text-[#908fa0] uppercase tracking-wider block">
          Issue Description
        </span>
        <div className="text-xs text-slate-700 dark:text-[#c7c4d7] leading-relaxed bg-slate-50 dark:bg-[#131b2e]/60 p-4 rounded-2xl border border-slate-100 dark:border-[#464554]/10">
          {complaint.description}
        </div>
      </div>

      {/* Technician & Completion Metadata */}
      {(complaint.technicianName || complaint.completionPhotoUrl) && (
        <div className="pt-2 border-t border-slate-100 dark:border-[#464554]/10 space-y-3">
          {complaint.technicianName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-400 dark:text-[#908fa0]">Assigned Staff:</span>
              <span className="font-bold text-slate-800 dark:text-[#dae2fd]">{complaint.technicianName}</span>
            </div>
          )}
          {complaint.completionPhotoUrl && (
            <div className="text-xs text-slate-700 dark:text-[#c7c4d7] pt-3 mt-3 border-t border-primary/10 dark:border-[#8083ff]/10">
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#908fa0] block mb-2">Completion Photo</span>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 w-full max-w-xs relative group">
                <img 
                  src={complaint.completionPhotoUrl} 
                  alt="Completion Photo" 
                  className="w-full h-auto object-contain bg-slate-100 dark:bg-[#171f33]" 
                />
                <a 
                  href={complaint.completionPhotoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-white font-bold text-xs bg-slate-900/80 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <Icon name="open_in_new" className="text-sm" />
                    Open Image
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Quick Action Controls Bar */}
      {((isPendingStatus && (onApprove || onReject)) || (isCompletedStatus && (onVerify || onReopen))) && (
        <div className="pt-4 border-t border-slate-100 dark:border-[#464554]/10 space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#908fa0] block">
            Admin Action Controls
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {/* Show Approve & Reject ONLY for Pending complaints */}
            {isPendingStatus && (
              <>
                {onApprove && (
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={onApprove}
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Icon name="check_circle" className="text-base" />
                    <span>Approve Ticket</span>
                  </button>
                )}

                {onReject && (
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={onReject}
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    <Icon name="cancel" className="text-base" />
                    <span>Reject Ticket</span>
                  </button>
                )}
              </>
            )}

            {/* Show Mark Verified (Close) & Change Status to In Progress for Completed complaints */}
            {isCompletedStatus && (
              <>
                {onVerify && (
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={onVerify}
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00355f] hover:bg-[#0f4c81] dark:bg-[#8083ff] dark:hover:bg-[#686bff] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <Icon name="verified" className="text-base" />
                    <span>Mark Verified (Close)</span>
                  </button>
                )}

                {onReopen && (
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={onReopen}
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                  >
                    <Icon name="restart_alt" className="text-base" />
                    <span>Reopen: In Progress</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
