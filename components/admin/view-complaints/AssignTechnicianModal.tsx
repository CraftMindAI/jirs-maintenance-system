import Icon from "@/components/ui/Icon";
import { TechnicianOption } from "./constants";

export default function AssignTechnicianModal({
  ticketId,
  isReassign = false,
  technicians,
  selectedTechnicianId,
  setSelectedTechnicianId,
  onCancel,
  onConfirm,
}: {
  ticketId: string;
  isReassign?: boolean;
  technicians: TechnicianOption[];
  selectedTechnicianId: string;
  setSelectedTechnicianId: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-[#171f33] border border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
        <div className="w-12 h-12 bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-[#c0c1ff]">
          <Icon name={isReassign ? "sync" : "assignment_ind"} className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#dae2fd]">
            {isReassign ? "Reassign Technician" : "Assign Certified Technician"}
          </h4>
          <p className="text-xs text-[#908fa0] mt-1">
            {isReassign
              ? <>Reallocate ticket **{ticketId}** to a different technician.</>
              : <>Allocate ticket **{ticketId}** to specialized division personnel.</>}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Select Staff</label>
          <select
            value={selectedTechnicianId}
            onChange={(e) => setSelectedTechnicianId(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/30 text-[#dae2fd] font-bold outline-none focus:border-[#8083ff]"
          >
            <option value="">Choose technician...</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>{t.name}{t.phone ? ` (${t.phone})` : ""}</option>
            ))}
          </select>
          {technicians.length === 0 && (
            <p className="text-[10px] text-[#908fa0] mt-1">
              No technician accounts found. Ask them to sign up with the Technician role.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-[#464554]/30 text-[#908fa0] rounded-xl font-bold hover:bg-[#222a3d] text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedTechnicianId}
            className="flex-1 py-3 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-[#8083ff]/20 text-xs disabled:opacity-50 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
