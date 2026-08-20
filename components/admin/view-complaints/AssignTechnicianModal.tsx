import Icon from "@/components/ui/Icon";
import Dropdown, { DropdownOption } from "@/components/ui/Dropdown";
import { TechnicianOption } from "./constants";

export default function AssignTechnicianModal({
  ticketId,
  ticketNumber,
  isReassign = false,
  technicians,
  selectedTechnicianId,
  setSelectedTechnicianId,
  onCancel,
  onConfirm,
}: {
  ticketId: string;
  ticketNumber?: number;
  isReassign?: boolean;
  technicians: TechnicianOption[];
  selectedTechnicianId: string;
  setSelectedTechnicianId: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const displayTicketId = ticketNumber ?? "-";
  const technicianOptions: DropdownOption[] = technicians.map((t) => ({
    value: t.id,
    label: `${t.name}${t.phone ? ` (${t.phone})` : ""}`,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
        <div className="w-12 h-12 bg-primary/10 dark:bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-primary dark:text-[#c0c1ff]">
          <Icon name={isReassign ? "sync" : "assignment_ind"} className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
            {isReassign ? "Reassign Technician" : "Assign Certified Technician"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">
            {isReassign
              ? <>Reallocate complaint {displayTicketId} to a different technician.</>
              : <>Allocate complaint {displayTicketId} to specialized division personnel.</>}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">Select Staff</label>
          <Dropdown
            options={technicianOptions}
            value={selectedTechnicianId}
            onChange={setSelectedTechnicianId}
            placeholder="Choose technician..."
            direction="up"
            maxVisibleItems={3}
          />
          {technicians.length === 0 && (
            <p className="text-[10px] text-slate-500 dark:text-[#908fa0] mt-1">
              No technician accounts found. Ask them to sign up with the Technician role.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-slate-200 dark:border-[#464554]/30 text-slate-600 dark:text-[#908fa0] rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-[#222a3d] text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedTechnicianId}
            className="flex-1 py-3 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 dark:shadow-[#8083ff]/20 text-xs disabled:opacity-50 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
