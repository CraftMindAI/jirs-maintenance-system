"use client";

import { use, useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { showToast } from "@/lib/toast";
import PageHeader from "@/components/admin/user-management/PageHeader";
import SearchBar from "@/components/admin/user-management/SearchBar";
import UsersTable from "@/components/admin/user-management/UsersTable";
import DeleteUserModal from "@/components/admin/user-management/DeleteUserModal";
import ResetPasswordModal from "@/components/admin/user-management/ResetPasswordModal";
import AddTechnicianModal from "@/components/admin/user-management/AddTechnicianModal";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dept: string;
  role: "Student" | "Staff" | "Technician" | "Admin";
  active: boolean;
  ticketCounts?: {
    assigned: number;
    inProgress: number;
    completed: number;
    total: number;
  };
};

export default function AdminUserManagement({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [ticketCountsMap, setTicketCountsMap] = useState<
    Record<string, { assigned: number; inProgress: number; completed: number; total: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserItem | null>(null);
  const [showAddTechnician, setShowAddTechnician] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubComplaints = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const map: Record<string, { assigned: number; inProgress: number; completed: number; total: number }> = {};

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const techId = data.technicianId || data.technicianEmail || data.technicianName;
        if (!techId) return;

        if (!map[techId]) {
          map[techId] = { assigned: 0, inProgress: 0, completed: 0, total: 0 };
        }

        map[techId].total += 1;

        if (data.status === "Assigned") {
          map[techId].assigned += 1;
        } else if (data.status === "In Progress") {
          map[techId].inProgress += 1;
        } else if (data.status === "Completed") {
          map[techId].completed += 1;
        }
      });

      setTicketCountsMap(map);
    });

    const unsubUsers = onSnapshot(
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

    return () => {
      unsubComplaints();
      unsubUsers();
    };
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

  const handleConfirmResetEmail = async (targetUser: UserItem) => {
    const res = await fetch("/api/admin/send-reset-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: targetUser.email,
        name: targetUser.name,
        phone: targetUser.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send reset email");

    showToast.success(`Password reset to "${data.newPassword}" & emailed to ${targetUser.email}.`);
    return data.newPassword as string;
  };

  const handleCreateTechnician = async (form: { name: string; email: string; phone: string }) => {
    const res = await fetch("/api/admin/create-technician", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create technician account");

    showToast.success(`Technician account created & credentials emailed to ${form.email}.`);
    setShowAddTechnician(false);
  };

  const filteredUsers = users
    .filter((u) => {
      return (
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .map((u) => ({
      ...u,
      ticketCounts:
        ticketCountsMap[u.id] ||
        ticketCountsMap[u.email] ||
        ticketCountsMap[u.name] || { assigned: 0, inProgress: 0, completed: 0, total: 0 },
    }));

  return (
    <div className="space-y-8 pb-12">
      <title>User Management | JFM Admin</title>

      <PageHeader onAddTechnician={() => setShowAddTechnician(true)} />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          basePath={`/profile/v3/${token}`}
          currentUserId={currentUserId}
          onToggleStatus={handleToggleStatus}
          onDeleteRequest={setShowDeleteConfirm}
          onResetPasswordRequest={(u) => setResetPasswordUser(u)}
        />
      )}

      {/* Reset Password Email Confirmation Modal */}
      {resetPasswordUser && (
        <ResetPasswordModal
          user={resetPasswordUser}
          onCancel={() => setResetPasswordUser(null)}
          onConfirm={handleConfirmResetEmail}
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

      {/* Add Technician Modal */}
      {showAddTechnician && (
        <AddTechnicianModal
          onCancel={() => setShowAddTechnician(false)}
          onConfirm={handleCreateTechnician}
        />
      )}
    </div>
  );
}
