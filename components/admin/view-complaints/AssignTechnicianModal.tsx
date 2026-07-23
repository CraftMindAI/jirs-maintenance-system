import Icon from "@/components/ui/Icon";
import { TECHNICIANS } from "./constants";

export default function AssignTechnicianModal({
  ticketId,
  selectedTechnician,
  setSelectedTechnician,
  onCancel,
  onConfirm,
}: {
  ticketId: string;
  selectedTechnician: string;
  setSelectedTechnician: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-[#171f33] border border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
        <div className="w-12 h-12 bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-[#c0c1ff]">
          <Icon name="assignment_ind" className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#dae2fd]">Assign Certified Technician</h4>
          <p className="text-xs text-[#908fa0] mt-1">
            Allocate ticket **{ticketId}** to specialized division personnel.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Select Staff</label>
          <select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/30 text-[#dae2fd] font-bold outline-none focus:border-[#8083ff]"
          >
            <option value="">Choose technician...</option>
            {TECHNICIANS.map((t) => (
              <option key={t.name} value={t.name}>{t.name} ({t.dept})</option>
            ))}
          </select>
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
            disabled={!selectedTechnician}
            className="flex-1 py-3 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-[#8083ff]/20 text-xs disabled:opacity-50 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
