import Icon from "@/components/ui/Icon";
import { Complaint } from "@/types/complaint";

export default function ComplaintDetailModal({
  complaint,
  onClose,
}: {
  complaint: Complaint;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-[#0b1326]/80 backdrop-blur-md p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/30 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#464554]/20 pb-4">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-[#dae2fd]">Ticket Logs ({complaint.id})</h3>
          <button onClick={onClose} className="text-slate-400 dark:text-[#908fa0] hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer">
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">Category</span>
              <div className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] mt-0.5">{complaint.category}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">Campus Location</span>
              <div className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] mt-0.5">{complaint.location}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">Description</span>
              <p className="text-slate-700 dark:text-[#c7c4d7] leading-relaxed mt-1">{complaint.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">Reference Image</span>
              <div className="rounded-xl overflow-hidden aspect-[4/3] border border-slate-200 dark:border-[#464554]/20 mt-1">
                <img src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg" alt="Attachment" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-3 bg-slate-100 dark:bg-[#222a3d] text-primary dark:text-[#c0c1ff] rounded-xl font-bold text-xs cursor-pointer border border-primary/20 dark:border-[#c0c1ff]/20 hover:bg-slate-200 dark:hover:bg-[#2d3449]">
          Close View
        </button>
      </div>
    </div>
  );
}
