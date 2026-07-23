"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Complaint } from "../../dashboard/page";
import { TECHNICIANS } from "@/components/admin/view-complaints/constants";
import PageHeader from "@/components/admin/view-complaints/PageHeader";
import Toast from "@/components/admin/view-complaints/Toast";
import FiltersToolbar from "@/components/admin/view-complaints/FiltersToolbar";
import ComplaintsTable from "@/components/admin/view-complaints/ComplaintsTable";
import AssignTechnicianModal from "@/components/admin/view-complaints/AssignTechnicianModal";
import ComplaintDetailModal from "@/components/admin/view-complaints/ComplaintDetailModal";
import DeleteTicketModal from "@/components/admin/view-complaints/DeleteTicketModal";

function ViewComplaintsContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket");

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");

  // Modals / Overlays
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Sync state
  useEffect(() => {
    const stored = localStorage.getItem("jmms_complaints");
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (ticketParam) {
      setSelectedComplaintId(ticketParam);
    }
  }, [ticketParam]);

  const saveComplaints = (updatedList: Complaint[]) => {
    localStorage.setItem("jmms_complaints", JSON.stringify(updatedList));
    setComplaints(updatedList);
  };

  const handleApproveAndAssign = (ticketId: string) => {
    setAssigningTicketId(ticketId);
    setSelectedTechnician("");
  };

  const confirmAssignment = () => {
    if (!assigningTicketId || !selectedTechnician) return;

    const selectedTechObj = TECHNICIANS.find(t => t.name === selectedTechnician);

    const updated = complaints.map((c) => {
      if (c.id === assigningTicketId) {
        return {
          ...c,
          status: "Assigned" as const,
          technicianName: selectedTechnician,
          technicianPhone: selectedTechObj?.phone || "",
          assignedDate: new Date().toISOString().split("T")[0],
          remarks: `Assigned to ${selectedTechObj?.dept} maintenance division.`,
        };
      }
      return c;
    });

    saveComplaints(updated);
    setAssigningTicketId(null);
    triggerToast("Technician assigned successfully!");
  };

  const handleDelete = (id: string) => {
    const updated = complaints.filter((c) => c.id !== id);
    saveComplaints(updated);
    setShowDeleteConfirm(null);
    triggerToast("Ticket removed from system.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchQuery =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
    const matchDept = deptFilter === "all" || c.category === deptFilter;
    const matchTech =
      techFilter === "all" ||
      (techFilter === "unassigned" && !c.technicianName) ||
      c.technicianName === techFilter;

    return matchQuery && matchStatus && matchPriority && matchDept && matchTech;
  });

  const detailedComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;

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
        onView={setSelectedComplaintId}
        onAssign={handleApproveAndAssign}
        onDeleteRequest={setShowDeleteConfirm}
      />

      {/* 4. MODAL: TECHNICIAN ALLOCATION */}
      {assigningTicketId && (
        <AssignTechnicianModal
          ticketId={assigningTicketId}
          selectedTechnician={selectedTechnician}
          setSelectedTechnician={setSelectedTechnician}
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
