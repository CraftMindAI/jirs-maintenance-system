"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { Complaint } from "@/app/dashboard/page";

type NextStatus = "In Progress" | "Completed";

export default function UpdateProgressModal({
  complaint,
  onCancel,
  onConfirm,
}: {
  complaint: Complaint;
  onCancel: () => void;
  onConfirm: (nextStatus: NextStatus, remarks: string) => void;
}) {
  const nextStatus: NextStatus = complaint.status === "Assigned" ? "In Progress" : "Completed";
  const [remarks, setRemarks] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-[#171f33] border border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
        <div className="w-12 h-12 bg-[#00a572]/10 rounded-2xl flex items-center justify-center text-[#4edea3]">
          <Icon name="update" className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#dae2fd]">Update Ticket Progress</h4>
          <p className="text-xs text-[#908fa0] mt-1">
            Mark ticket **{complaint.id}** as <span className="font-bold text-[#4edea3]">{nextStatus}</span>.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Remarks (Optional)</label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add a note about the work done..."
            className="w-full rounded-xl p-4 text-xs bg-[#131b2e] border border-[#464554]/30 text-[#dae2fd] font-semibold outline-none focus:border-[#8083ff] resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-[#464554]/30 text-[#908fa0] rounded-xl font-bold hover:bg-[#222a3d] text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(nextStatus, remarks)}
            className="flex-1 py-3 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-[#8083ff]/20 text-xs cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
