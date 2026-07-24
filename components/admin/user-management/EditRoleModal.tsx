import Icon from "@/components/ui/Icon";
import { UserItem } from "@/app/admin/user-management/page";

export default function EditRoleModal({
  userId,
  editingRole,
  setEditingRole,
  onCancel,
  onSave,
}: {
  userId: string;
  editingRole: UserItem["role"];
  setEditingRole: (role: UserItem["role"]) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        <div className="w-12 h-12 bg-primary/10 dark:bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-primary dark:text-[#c0c1ff]">
          <Icon name="admin_panel_settings" className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">Configure System Role</h4>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">Allocate authorization credentials.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0]">System Role Category</label>
          <select
            value={editingRole}
            onChange={(e) => setEditingRole(e.target.value as UserItem["role"])}
            className="w-full rounded-xl px-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/30 text-slate-800 dark:text-[#dae2fd] font-bold outline-none focus:border-primary dark:focus:border-[#8083ff]"
          >
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Technician">Technician</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border border-slate-200 dark:border-[#464554]/30 text-slate-600 dark:text-[#908fa0] hover:bg-slate-100 dark:hover:bg-[#222a3d] rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
          <button onClick={onSave} className="flex-1 py-3 vibrant-gradient text-white rounded-xl font-bold text-xs shadow-lg shadow-primary/20 dark:shadow-[#8083ff]/20 cursor-pointer">Save Role</button>
        </div>
      </div>
    </div>
  );
}
