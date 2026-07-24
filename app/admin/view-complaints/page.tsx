"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TechnicianOption } from "@/components/admin/view-complaints/constants";
import PageHeader from "@/components/admin/view-complaints/PageHeader";
import Toast from "@/components/admin/view-complaints/Toast";
import FiltersToolbar from "@/components/admin/view-complaints/FiltersToolbar";
import ComplaintsTable from "@/components/admin/view-complaints/ComplaintsTable";
import AssignTechnicianModal from "@/components/admin/view-complaints/AssignTechnicianModal";
import ComplaintDetailModal from "@/components/admin/view-complaints/ComplaintDetailModal";
import DeleteTicketModal from "@/components/admin/view-complaints/DeleteTicketModal";
import UpdateProgressModal from "@/components/admin/view-complaints/UpdateProgressModal";
import { useUserRole } from "@/hooks/useUserRole";
import { useComplaintsFeed } from "@/hooks/useComplaintsFeed";
import {
  approveComplaint,
  assignTechnician,
  deleteComplaint,
  notifyTechnicianAssignment,
  updateComplaintProgress,
} from "@/utils/admin/complaints";
import {
  AdminProfile,
  fetchAdminProfile,
  fetchTechnicianOptions,
  filterComplaints,
} from "@/utils/admin/viewComplaints";

function ViewComplaintsContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket");

  const { userId: currentUserId, isAdmin, isTechnician, loading: roleLoading } = useUserRole();
  const feedFilter = roleLoading ? undefined : isAdmin || isTechnician ? null : currentUserId;
  const { complaints } = useComplaintsFeed(feedFilter);

  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");

  // Modals / Overlays
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [updatingComplaintId, setUpdatingComplaintId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Fetch the signed-in admin's own profile (name/email/phone) for the technician notification email
  useEffect(() => {
    if (!currentUserId) return;

    fetchAdminProfile(currentUserId)
      .then(setAdminProfile)
      .catch((error) => console.error("Error fetching admin profile:", error));
  }, [currentUserId]);

  // Fetch technician accounts for the Assign Technician dropdown (admin-only feature)
  useEffect(() => {
    if (!isAdmin) return;

    fetchTechnicianOptions()
      .then(setTechnicians)
      .catch((error) => console.error("Error fetching technicians:", error));
  }, [isAdmin]);

  useEffect(() => {
    if (ticketParam) {
      setSelectedComplaintId(ticketParam);
    }
  }, [ticketParam]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleOpenAssign = (ticketId: string) => {
    setAssigningTicketId(ticketId);
    setSelectedTechnicianId("");
  };

  const handleApprove = async (id: string) => {
    try {
      await approveComplaint(id);
      triggerToast("Complaint approved.");
    } catch (error) {
      console.error("Error approving complaint:", error);
      triggerToast("Failed to approve complaint.");
    }
  };

  const confirmAssignment = async () => {
    if (!assigningTicketId || !selectedTechnicianId) return;

    const selectedTechObj = technicians.find((t) => t.id === selectedTechnicianId);
    if (!selectedTechObj) return;

    const ticket = complaints.find((c) => c.id === assigningTicketId);

    try {
      await assignTechnician(assigningTicketId, selectedTechObj);
      setAssigningTicketId(null);
      triggerToast("Technician assigned successfully!");

      if (selectedTechObj.email && ticket) {
        notifyTechnicianAssignment({
          technicianName: selectedTechObj.name,
          technicianEmail: selectedTechObj.email,
          ticketId: assigningTicketId,
          category: ticket.category,
          location: ticket.location,
          priority: ticket.priority,
          description: ticket.description,
          adminName: adminProfile?.name || "Administrator",
          adminEmail: adminProfile?.email || "",
          adminPhone: adminProfile?.phone || "",
        });
      }
    } catch (error) {
      console.error("Error assigning technician:", error);
      triggerToast("Failed to assign technician.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComplaint(id);
      setShowDeleteConfirm(null);
      triggerToast("Ticket removed from system.");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      triggerToast("Failed to delete ticket.");
    }
  };

  const handleUpdateProgress = async (id: string, nextStatus: "In Progress" | "Completed", remarks: string) => {
    try {
      await updateComplaintProgress(id, nextStatus, remarks);
      setUpdatingComplaintId(null);
      triggerToast(`Ticket marked as ${nextStatus}.`);
    } catch (error) {
      console.error("Error updating ticket progress:", error);
      triggerToast("Failed to update ticket progress.");
    }
  };

  const filteredComplaints = filterComplaints(complaints, {
    searchQuery,
    statusFilter,
    priorityFilter,
    deptFilter,
    techFilter,
  });

  const detailedComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;
  const updatingComplaint = complaints.find((c) => c.id === updatingComplaintId) || null;
  const assigningComplaint = complaints.find((c) => c.id === assigningTicketId) || null;

  return (
    <div className="space-y-8 pb-12">
      <title>All Complaints | JMMS Admin</title>

      {/* Toast Alert Popup */}
      {showToast && <Toast message={showToast} />}

      {/* Header section */}
      <PageHeader />

      {/* 2. FILTERS SEARCH TOOLBAR */}
      <FiltersToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        techFilter={techFilter}
        setTechFilter={setTechFilter}
      />

      {/* 3. TICKET DATA GRID */}
      <ComplaintsTable
        complaints={filteredComplaints}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
        isTechnician={isTechnician}
        onView={setSelectedComplaintId}
        onApprove={handleApprove}
        onAssign={handleOpenAssign}
        onDeleteRequest={setShowDeleteConfirm}
        onUpdateRequest={setUpdatingComplaintId}
      />

      {/* 4. MODAL: TECHNICIAN ALLOCATION */}
      {assigningTicketId && (
        <AssignTechnicianModal
          ticketId={assigningTicketId}
          isReassign={assigningComplaint?.status === "Assigned"}
          technicians={technicians}
          selectedTechnicianId={selectedTechnicianId}
          setSelectedTechnicianId={setSelectedTechnicianId}
          onCancel={() => setAssigningTicketId(null)}
          onConfirm={confirmAssignment}
        />
      )}

      {/* 5. MODAL: DETAILED VIEW */}
      {detailedComplaint && (
        <ComplaintDetailModal
          complaint={detailedComplaint}
          onClose={() => setSelectedComplaintId(null)}
        />
      )}

      {/* 6. MODAL: DELETE */}
      {showDeleteConfirm && (
        <DeleteTicketModal
          ticketId={showDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => handleDelete(showDeleteConfirm)}
        />
      )}

      {/* 7. MODAL: TECHNICIAN PROGRESS UPDATE */}
      {updatingComplaint && (
        <UpdateProgressModal
          complaint={updatingComplaint}
          onCancel={() => setUpdatingComplaintId(null)}
          onConfirm={(nextStatus, remarks) => handleUpdateProgress(updatingComplaint.id, nextStatus, remarks)}
        />
      )}
    </div>
  );
}

export default function ViewComplaints() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
      </div>
    }>
      <ViewComplaintsContent />
    </Suspense>
  );
}
