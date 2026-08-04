import Icon from "@/components/ui/Icon";

export default function DeleteTicketModal({
  category,
  description,
  onCancel,
  onConfirm,
}: {
  category: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 dark:text-red-400">
          <Icon name="warning" className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">Confirm Ticket Removal</h4>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">
            Permanently remove the <strong>{category}</strong> complaint ticket &mdash; &ldquo;{description}&rdquo;?
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border border-slate-200 dark:border-[#464554]/30 text-slate-600 dark:text-[#908fa0] hover:bg-slate-100 dark:hover:bg-[#222a3d] rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-500/20 cursor-pointer">Delete</button>
        </div>
      </div>
    </div>
  );
}
