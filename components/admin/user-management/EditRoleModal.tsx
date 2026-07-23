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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-6">
      <div className="bg-[#171f33] border border-[#464554]/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
        <div className="w-12 h-12 bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-[#c0c1ff]">
          <Icon name="admin_panel_settings" className="text-2xl" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#dae2fd]">Configure System Role</h4>
          <p className="text-xs text-[#908fa0] mt-1">Allocate authorization credentials.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">System Role Category</label>
          <select
            value={editingRole}
            onChange={(e) => setEditingRole(e.target.value as UserItem["role"])}
            className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/30 text-[#dae2fd] font-bold outline-none"
          >
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Technician">Technician</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 border border-[#464554]/30 text-[#908fa0] rounded-xl font-bold text-xs">Cancel</button>
          <button onClick={onSave} className="flex-1 py-3 vibrant-gradient text-white rounded-xl font-bold text-xs shadow-lg shadow-[#8083ff]/20">Save Role</button>
        </div>
      </div>
    </div>
  );
}
