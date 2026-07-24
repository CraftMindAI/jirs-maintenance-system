"use client";

import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { showToast } from "@/lib/toast";
import PageHeader from "@/components/admin/user-management/PageHeader";
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
  role: "Student" | "Staff" | "Technician" | "Admin";
  active: boolean;
};

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<UserItem["role"]>("Student");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const list: UserItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || "Unnamed User",
            email: data.email || "",
            phone: data.phone || "",
            dept: data.department || "-",
            role: (data.role || "Student") as UserItem["role"],
            active: data.active !== false,
          };
        });
        list.sort((a, b) => a.role.localeCompare(b.role));
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        showToast.error("Failed to load users.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", id), { active: !user.active });
      showToast.success("User status updated.");
    } catch (error) {
      console.error("Error updating user status:", error);
      showToast.error("Failed to update user status.");
    }
  };

  const handleEditRole = (id: string, role: UserItem["role"]) => {
    setEditingUserId(id);
    setEditingRole(role);
  };

  const saveRoleEdit = async () => {
    if (!editingUserId) return;

    try {
      await updateDoc(doc(db, "users", editingUserId), { role: editingRole });
      setEditingUserId(null);
      showToast.success("User role updated successfully.");
    } catch (error) {
      console.error("Error updating user role:", error);
      showToast.error("Failed to update user role.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setShowDeleteConfirm(null);
      showToast.success("User account deleted.");
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast.error("Failed to delete user.");
    }
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

      <PageHeader />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          onToggleStatus={handleToggleStatus}
          onEditRole={handleEditRole}
          onDeleteRequest={setShowDeleteConfirm}
        />
      )}

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
          userName={users.find((u) => u.id === showDeleteConfirm)?.name || "Unknown User"}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDeleteUser(showDeleteConfirm)}
        />
      )}
    </div>
  );
}
