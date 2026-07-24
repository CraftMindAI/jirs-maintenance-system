import Icon from "@/components/ui/Icon";
import { UserItem } from "@/app/admin/user-management/page";

export default function UsersTable({
  users,
  onToggleStatus,
  onEditRole,
  onDeleteRequest,
}: {
  users: UserItem[];
  onToggleStatus: (id: string) => void;
  onEditRole: (id: string, role: UserItem["role"]) => void;
  onDeleteRequest: (id: string) => void;
}) {
  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
        <Icon name="group_off" className="text-4xl text-slate-400 dark:text-[#908fa0] mb-3 block mx-auto" />
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-[#dae2fd]">No Users Found</h3>
        <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">Adjust search parameters to locate users.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl overflow-hidden shadow-sm dark:vibrant-shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#131b2e]/50 border-b border-slate-200 dark:border-[#464554]/10">
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Profile</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Name / Email</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Phone</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Department</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Role</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Status</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#464554]/10 font-medium text-xs">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-primary/5 dark:hover:bg-[#8083ff]/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-[#8083ff]/10 text-primary dark:text-[#c0c1ff] font-black flex items-center justify-center border border-primary/20 dark:border-[#8083ff]/20">
                    {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-slate-900 dark:text-[#dae2fd] font-bold">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-[#908fa0]">{user.email}</div>
                </td>
                <td className="py-4 px-6 text-slate-500 dark:text-[#908fa0] text-[11px]">{user.phone}</td>
                <td className="py-4 px-6 text-slate-700 dark:text-[#c7c4d7]">{user.dept}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    user.role === "Admin"  ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                    user.role === "Technician" ? "bg-primary/10 dark:bg-[#8083ff]/10 text-primary dark:text-[#c0c1ff]" :
                    "bg-slate-100 dark:bg-[#908fa0]/15 text-slate-600 dark:text-[#908fa0]"
                  }`}>{user.role}</span>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onToggleStatus(user.id)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer ${
                      user.active
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-[#4edea3] border border-emerald-500/20 dark:border-[#00a572]/20"
                        : "bg-slate-100 dark:bg-[#131b2e] text-slate-500 dark:text-[#908fa0] border border-slate-200 dark:border-[#464554]/20"
                    }`}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-3 text-slate-400 dark:text-[#908fa0]">
                    <button onClick={() => onEditRole(user.id, user.role)} title="Edit Role" className="hover:text-primary dark:hover:text-[#c0c1ff] transition-colors cursor-pointer">
                      <Icon name="edit" className="text-lg" />
                    </button>
                    <button onClick={() => onDeleteRequest(user.id)} title="Delete User" className="hover:text-red-500 transition-colors cursor-pointer">
                      <Icon name="delete" className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
