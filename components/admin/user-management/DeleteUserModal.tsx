import Icon from "@/components/ui/Icon";

export default function DeleteUserModal({
  userId,
  onCancel,
  onConfirm,
}: {
  userId: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-[#171f33] border border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
          <Icon name="warning" className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#dae2fd]">Delete Account</h4>
          <p className="text-xs text-[#908fa0] mt-1">Permanently remove user account **{userId}**?</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border border-[#464554]/30 text-[#908fa0] rounded-xl font-bold text-xs">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-500/20">Delete</button>
        </div>
      </div>
    </div>
  );
}
