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
  updatingStatus,
}: {
  complaint: Complaint;
  isAdmin?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  updatingStatus?: boolean;
}) {
  return (
    <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm vibrant-shadow space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#464554]/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl md:text-2xl font-bold text-[#dae2fd]">
              Ticket #{complaint.id}
            </h1>
            <StatusBadge status={complaint.status} className="px-3 py-1 text-xs" />
          </div>
          <p className="text-xs text-[#908fa0] mt-1 flex items-center gap-2">
            <Icon name="calendar_today" className="text-sm" />
            <span>Submitted on {complaint.date || "N/A"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-[#908fa0]">Priority:</span>
          <PriorityBadge priority={complaint.priority} className="px-3 py-1 text-xs" />
        </div>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#908fa0] tracking-wider block">
            Category
          </span>
          <div className="text-sm font-bold text-[#dae2fd] flex items-center gap-2">
            <Icon name="category" className="text-[#8083ff]" />
            <span>{complaint.category}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#908fa0] tracking-wider block">
            Campus Location
          </span>
          <div className="text-sm font-bold text-[#dae2fd] flex items-center gap-2">
            <Icon name="location_on" className="text-[#ffb2b7]" />
            <span>{complaint.location || "Unspecified"}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 pt-2 border-t border-[#464554]/10">
        <span className="text-[10px] font-mono uppercase text-[#908fa0] tracking-wider block">
          Issue Description
        </span>
        <div className="bg-[#131b2e]/60 border border-[#464554]/10 rounded-2xl p-4 text-xs text-[#c7c4d7] leading-relaxed whitespace-pre-line">
          {complaint.description || "No description provided."}
        </div>
      </div>

      {/* Admin Quick Action Toolbar: Approve / Reject (admin-only) */}
      {isAdmin && (
        <div className="pt-3 border-t border-[#464554]/10 flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-semibold text-[#908fa0]">
            Admin Actions:
          </span>
          <div className="flex items-center gap-3">
            {complaint.status !== "Rejected" && (
              <button
                onClick={onApprove}
                disabled={updatingStatus || complaint.status === "Approved"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00a572] hover:bg-[#00a572]/80 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-[#00a572]/20 transition-all cursor-pointer"
              >
                <Icon name="check_circle" className="text-base" />
                <span>{complaint.status === "Approved" ? "Approved" : "Approve"}</span>
              </button>
            )}

            {complaint.status === "Pending" && (
              <button
                onClick={onReject}
                disabled={updatingStatus}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff516a]/15 hover:bg-[#ff516a]/25 disabled:opacity-50 text-[#ff516a] border border-[#ff516a]/30 font-bold text-xs transition-all cursor-pointer"
              >
                <Icon name="cancel" className="text-base" />
                <span>Reject</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Technician Assignment Details if any */}
      {(complaint.technicianName || complaint.remarks) && (
        <div className="bg-[#131b2e]/90 border border-[#8083ff]/20 rounded-2xl p-4 space-y-3">
          <h4 className="font-display text-xs font-bold text-[#c0c1ff] flex items-center gap-2">
            <Icon name="engineering" className="text-base text-[#8083ff]" />
            Technician & Status Remarks
          </h4>

          {complaint.technicianName && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#908fa0] block">Assigned Technician</span>
                <span className="font-bold text-[#dae2fd]">{complaint.technicianName}</span>
              </div>
              {complaint.technicianPhone && (
                <div>
                  <span className="text-[10px] font-mono text-[#908fa0] block">Contact Phone</span>
                  <span className="font-semibold text-[#4edea3]">{complaint.technicianPhone}</span>
                </div>
              )}
            </div>
          )}

          {complaint.remarks && (
            <div className="text-xs text-[#c7c4d7] pt-1">
              <span className="text-[10px] font-mono text-[#908fa0] block">Remarks</span>
              <p className="mt-0.5 italic">{complaint.remarks}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
