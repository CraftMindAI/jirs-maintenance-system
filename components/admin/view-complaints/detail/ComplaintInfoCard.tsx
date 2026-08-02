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
  updatingStatus,
}: {
  complaint: Complaint;
  isAdmin?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onVerify?: () => void;
  updatingStatus?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm dark:vibrant-shadow space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-[#464554]/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">
              Ticket #{complaint.id}
            </h1>
            <StatusBadge status={complaint.status} className="px-3 py-1 text-xs" />
          </div>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1 flex items-center gap-2">
            <Icon name="calendar_today" className="text-sm" />
            <span>Submitted on {complaint.date || "N/A"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-500 dark:text-[#908fa0]">Priority:</span>
          <PriorityBadge priority={complaint.priority} className="px-3 py-1 text-xs" />
        </div>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider block">
            Category
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] flex items-center gap-2">
            <Icon name="category" className="text-primary dark:text-[#8083ff]" />
            <span>{complaint.category}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider block">
            Campus Location
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] flex items-center gap-2">
            <Icon name="location_on" className="text-rose-500 dark:text-[#ffb2b7]" />
            <span>{complaint.location || "Unspecified"}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#464554]/10">
        <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider block">
          Issue Description
        </span>
        <div className="bg-slate-50 dark:bg-[#131b2e]/60 border border-slate-200 dark:border-[#464554]/10 rounded-2xl p-4 text-xs text-slate-700 dark:text-[#c7c4d7] leading-relaxed whitespace-pre-line">
          {complaint.description || "No description provided."}
        </div>
      </div>

      {/* Technician Assignment Details if any */}
      {(complaint.technicianName || complaint.remarks) && (
        <div className="bg-slate-50 dark:bg-[#131b2e]/90 border border-primary/20 dark:border-[#8083ff]/20 rounded-2xl p-4 space-y-3">
          <h4 className="font-display text-xs font-bold text-primary dark:text-[#c0c1ff] flex items-center gap-2">
            <Icon name="engineering" className="text-base text-primary dark:text-[#8083ff]" />
            Technician & Status Remarks
          </h4>

          {complaint.technicianName && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#908fa0] block">Assigned Technician</span>
                <span className="font-bold text-slate-900 dark:text-[#dae2fd]">{complaint.technicianName}</span>
              </div>
              {complaint.technicianPhone && (
                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-[#908fa0] block">Contact Phone</span>
                  <span className="font-semibold text-emerald-600 dark:text-[#4edea3]">{complaint.technicianPhone}</span>
                </div>
              )}
            </div>
          )}

          {complaint.remarks && (
            <div className="text-xs text-slate-700 dark:text-[#c7c4d7] pt-1">
              <span className="text-[10px] font-mono text-slate-500 dark:text-[#908fa0] block">Remarks</span>
              <p className="mt-0.5 italic">{complaint.remarks}</p>
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
    </div>
  );
}
