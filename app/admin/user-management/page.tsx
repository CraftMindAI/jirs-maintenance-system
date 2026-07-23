"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dept: string;
  role: "Student" | "Teacher" | "Staff" | "Technician" | "Admin";
  active: boolean;
};

const INITIAL_USERS: UserItem[] = [
  { id: "USR-001", name: "Siddharth Roy", email: "siddharth.r@jirs.ac.in", phone: "+91 99001 12233", dept: "Hostel Block B", role: "Student", active: true },
  { id: "USR-002", name: "Dr. Amit Sharma", email: "amit.sharma@jirs.ac.in", phone: "+91 99001 55667", dept: "Administration", role: "Teacher", active: true },
  { id: "USR-003", name: "Rajesh Kumar", email: "rajesh.plumbing@jirs.ac.in", phone: "+91 98450 12345", dept: "Plumbing Division", role: "Technician", active: true },
  { id: "USR-004", name: "S. Murthy", email: "murthy.electrical@jirs.ac.in", phone: "+91 98450 54321", dept: "Electrical Division", role: "Technician", active: true },
  { id: "USR-005", name: "Priya Sharma", email: "priya.s@jirs.ac.in", phone: "+91 99001 88990", dept: "Science Department", role: "Staff", active: false },
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<UserItem["role"]>("Student");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Sync state
  useEffect(() => {
    const stored = localStorage.getItem("jmms_users");
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      localStorage.setItem("jmms_users", JSON.stringify(INITIAL_USERS));
      setUsers(INITIAL_USERS);
    }
  }, []);

  const saveUsers = (updated: UserItem[]) => {
    localStorage.setItem("jmms_users", JSON.stringify(updated));
    setUsers(updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        return { ...u, active: !u.active };
      }
      return u;
    });
    saveUsers(updated);
    triggerToast("User status updated successfully.");
  };

  const handleEditRole = (id: string, role: UserItem["role"]) => {
    setEditingUserId(id);
    setEditingRole(role);
  };

  const saveRoleEdit = () => {
    if (!editingUserId) return;
    const updated = users.map((u) => {
      if (u.id === editingUserId) {
        return { ...u, role: editingRole };
      }
      return u;
    });
    saveUsers(updated);
    setEditingUserId(null);
    triggerToast("User role updated successfully.");
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    setShowDeleteConfirm(null);
    triggerToast("User account deleted.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 pb-12">
      <title>User Management | JMMS Admin</title>

      {/* Toast popup alerts */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl flex items-center gap-3 animate-scale-in text-sm font-bold border border-white/10">
          <Icon name="check_circle" className="text-emerald-500 text-xl" />
          {showToast}
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            User Account Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Oversee profiles, allocate department roles, and configure system permissions.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="relative w-full">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, department, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Users Data Grid */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6">Profile</th>
                  <th className="py-4 px-6">Name / Email</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center border border-primary/20">
                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 dark:text-slate-100 font-bold">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">{user.phone}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{user.dept}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === "Admin" ? "bg-red-500/10 text-red-500" :
                        user.role === "Technician" ? "bg-indigo-500/10 text-indigo-500" :
                        user.role === "Teacher" ? "bg-sky-500/10 text-sky-500" :
                        "bg-slate-500/10 text-slate-500"
                      }`}>{user.role}</span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer ${
                          user.active
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                            : "bg-slate-150 text-slate-450 dark:bg-slate-800 dark:text-slate-500 border border-transparent"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3 text-slate-400 dark:text-slate-500">
                        <button onClick={() => handleEditRole(user.id, user.role)} title="Edit Role" className="hover:text-primary transition-colors cursor-pointer">
                          <Icon name="edit" className="text-xl" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(user.id)} title="Delete User" className="hover:text-red-500 transition-colors cursor-pointer">
                          <Icon name="delete" className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
          <Icon name="group_off" className="text-4xl text-slate-300 mb-4 block" />
          <h3 className="font-display text-xl font-bold">No Users Found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Try adjustments on your filter parameters or search queries.
          </p>
        </div>
      )}

      {/* 4. MODAL: EDIT USER ROLE */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Icon name="admin_panel_settings" className="text-3xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Configure User Role</h4>
              <p className="text-xs text-slate-400 mt-2">
                Modify access permissions by allocating a new system role category.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="role-select" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                System Role Type
              </label>
              <select
                id="role-select"
                value={editingRole}
                onChange={(e) => setEditingRole(e.target.value as UserItem["role"])}
                className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Staff">Staff</option>
                <option value="Technician">Technician</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setEditingUserId(null)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveRoleEdit}
                className="flex-1 py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 text-sm cursor-pointer"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: DELETE USER CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <Icon name="warning" className="text-3xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Delete User Account</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to permanently delete user account **{showDeleteConfirm}**? This blocks login access and clears associated profile metadata.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-650 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 text-sm cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
