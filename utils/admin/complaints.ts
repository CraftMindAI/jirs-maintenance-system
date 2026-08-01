import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Shared complaint-mutation helpers used by both the complaints list page and the ticket detail page. */

export async function approveComplaint(id: string) {
  await updateDoc(doc(db, "complaints", id), { status: "Approved" });
}

export async function rejectComplaint(id: string) {
  await updateDoc(doc(db, "complaints", id), { status: "Rejected" });
}

export async function deleteComplaint(id: string) {
  await deleteDoc(doc(db, "complaints", id));
}

export async function verifyComplaint(id: string) {
  await updateDoc(doc(db, "complaints", id), { status: "Verified" });
}

export type AssignedTechnician = {
  id: string;
  name: string;
  phone?: string;
};

export async function assignTechnician(ticketId: string, technician: AssignedTechnician) {
  await updateDoc(doc(db, "complaints", ticketId), {
    status: "Assigned",
    technicianId: technician.id,
    technicianName: technician.name,
    technicianPhone: technician.phone || "",
    assignedDate: new Date().toISOString().split("T")[0],
    remarks: `Assigned to ${technician.name}.`,
  });
}

export async function updateComplaintProgress(
  id: string,
  nextStatus: "In Progress" | "Completed",
  remarks: string,
) {
  await updateDoc(doc(db, "complaints", id), {
    status: nextStatus,
    ...(remarks.trim() ? { remarks: remarks.trim() } : {}),
  });
}

export type TechnicianNotificationPayload = {
  technicianName: string;
  technicianEmail: string;
  ticketId: string;
  category: string;
  location: string;
  priority: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
};

/** Fire-and-forget email notification; failures are only logged, never block the assignment. */
export function notifyTechnicianAssignment(payload: TechnicianNotificationPayload) {
  fetch("/api/notify-technician", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((error) => console.error("Error notifying technician:", error));
}
