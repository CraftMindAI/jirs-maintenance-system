"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/user-management/PageHeader";
import Toast from "@/components/admin/user-management/Toast";
import SearchBar from "@/components/admin/user-management/SearchBar";
import UsersTable from "@/components/admin/user-management/UsersTable";
import EditRoleModal from "@/components/admin/user-management/EditRoleModal";
import DeleteUserModal from "@/components/admin/user-management/DeleteUserModal";

export type UserItem = {
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
  { id: "USR-003", name: "Rajesh Sharma", email: "rajesh.plumbing@jirs.ac.in", phone: "+91 98450 12345", dept: "Plumbing Division", role: "Technician", active: true },
  { id: "USR-004", name: "Mohit Kumar", email: "mohit.electrical@jirs.ac.in", phone: "+91 98450 54321", dept: "Electrical Division", role: "Technician", active: true },
  { id: "USR-005", name: "Priya Sharma", email: "priya.s@jirs.ac.in", phone: "+91 99001 88990", dept: "Science Department", role: "Staff", active: false },
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<UserItem["role"]>("Student");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

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
    triggerToast("User status updated.");
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

      {showToast && <Toast message={showToast} />}

      <PageHeader />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <UsersTable
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onEditRole={handleEditRole}
        onDeleteRequest={setShowDeleteConfirm}
      />

      {/* Edit Role Modal */}
      {editingUserId && (
        <EditRoleModal
          userId={editingUserId}
          editingRole={editingRole}
          setEditingRole={setEditingRole}
          onCancel={() => setEditingUserId(null)}
          onSave={saveRoleEdit}
        />
      )}

      {/* Delete User Modal */}
      {showDeleteConfirm && (
        <DeleteUserModal
          userId={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDeleteUser(showDeleteConfirm)}
        />
      )}
    </div>
  );
}
