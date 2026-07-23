"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Complaint } from "../../dashboard/page";
import { TechnicianOption } from "@/components/admin/view-complaints/constants";
import PageHeader from "@/components/admin/view-complaints/PageHeader";
import Toast from "@/components/admin/view-complaints/Toast";
import FiltersToolbar from "@/components/admin/view-complaints/FiltersToolbar";
import ComplaintsTable from "@/components/admin/view-complaints/ComplaintsTable";
import AssignTechnicianModal from "@/components/admin/view-complaints/AssignTechnicianModal";
import ComplaintDetailModal from "@/components/admin/view-complaints/ComplaintDetailModal";
import DeleteTicketModal from "@/components/admin/view-complaints/DeleteTicketModal";
import UpdateProgressModal from "@/components/admin/view-complaints/UpdateProgressModal";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const ADMIN_ROLES = ["admin", "super admin"];
const TECHNICIAN_ROLES = ["technician"];

function ViewComplaintsContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket");

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const [adminProfile, setAdminProfile] = useState<{ name: string; email: string; phone: string } | null>(null);
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

  // Resolve signed-in user + role (role decides which complaints are fetched and which actions are available)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUserId(null);
        setIsAdmin(false);
        setIsTechnician(false);
        return;
      }
      setCurrentUserId(user.uid);
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const data = docSnap.exists() ? docSnap.data() : null;
        const role = data?.role || "";
        setIsAdmin(ADMIN_ROLES.includes(role.toLowerCase()));
        setIsTechnician(TECHNICIAN_ROLES.includes(role.toLowerCase()));
        setAdminProfile({
          name: data?.name || user.displayName || "Administrator",
          email: user.email || "",
          phone: data?.phone || "",
        });
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
        setIsTechnician(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch technician accounts for the Assign Technician dropdown (admin-only feature)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchTechnicians = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, "users"), where("role", "==", "Technician")));
        setTechnicians(
          snapshot.docs.map((d) => ({
            id: d.id,
            name: d.data().name || d.data().email || "Unnamed Technician",
            phone: d.data().phone || "",
            email: d.data().email || "",
          })),
        );
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    fetchTechnicians();
  }, [isAdmin]);

  // Fetch complaints from Firestore: admins/technicians see every ticket, everyone else sees only their own
  useEffect(() => {
    if (!currentUserId) return;

    const complaintsQuery = isAdmin || isTechnician
      ? collection(db, "complaints")
      : query(collection(db, "complaints"), where("userId", "==", currentUserId));

    const unsubscribe = onSnapshot(complaintsQuery, (snapshot) => {
      const list: Complaint[] = snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt as Timestamp | undefined;
        return {
          id: d.id,
          category: data.category,
          location: data.location,
          priority: data.priority,
          status: data.status,
          date: createdAt ? createdAt.toDate().toISOString().split("T")[0] : "",
          description: data.description,
          technicianName: data.technicianName,
          technicianPhone: data.technicianPhone,
          assignedDate: data.assignedDate,
          remarks: data.remarks,
          userId: data.userId,
        };
      });
      setComplaints(list);
    });

    return () => unsubscribe();
  }, [currentUserId, isAdmin, isTechnician]);

  useEffect(() => {
    if (ticketParam) {
      setSelectedComplaintId(ticketParam);
    }
  }, [ticketParam]);

  const handleOpenAssign = (ticketId: string) => {
    setAssigningTicketId(ticketId);
    setSelectedTechnicianId("");
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "complaints", id), { status: "Approved" });
      triggerToast("Complaint approved.");
    } catch (error) {
      console.error("Error approving complaint:", error);
      triggerToast("Failed to approve complaint.");
    }
  };

  const confirmAssignment = async () => {
    if (!assigningTicketId || !selectedTechnicianId) return;

    const selectedTechObj = technicians.find(t => t.id === selectedTechnicianId);
    if (!selectedTechObj) return;

    const ticket = complaints.find((c) => c.id === assigningTicketId);

    try {
      await updateDoc(doc(db, "complaints", assigningTicketId), {
        status: "Assigned",
        technicianId: selectedTechObj.id,
        technicianName: selectedTechObj.name,
        technicianPhone: selectedTechObj.phone || "",
        assignedDate: new Date().toISOString().split("T")[0],
        remarks: `Assigned to ${selectedTechObj.name}.`,
      });
      setAssigningTicketId(null);
      triggerToast("Technician assigned successfully!");

      if (selectedTechObj.email && ticket) {
        fetch("/api/notify-technician", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        }).catch((error) => console.error("Error notifying technician:", error));
      }
    } catch (error) {
      console.error("Error assigning technician:", error);
      triggerToast("Failed to assign technician.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "complaints", id));
      setShowDeleteConfirm(null);
      triggerToast("Ticket removed from system.");
    } catch (error) {
      console.error("Error deleting complaint:", error);
      triggerToast("Failed to delete ticket.");
    }
  };

  const handleUpdateProgress = async (id: string, nextStatus: "In Progress" | "Completed", remarks: string) => {
    try {
      await updateDoc(doc(db, "complaints", id), {
        status: nextStatus,
        ...(remarks.trim() ? { remarks: remarks.trim() } : {}),
      });
      setUpdatingComplaintId(null);
      triggerToast(`Ticket marked as ${nextStatus}.`);
    } catch (error) {
      console.error("Error updating ticket progress:", error);
      triggerToast("Failed to update ticket progress.");
    }
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
