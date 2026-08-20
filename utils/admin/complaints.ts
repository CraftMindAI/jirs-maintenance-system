import { doc, updateDoc, deleteDoc, Bytes } from "firebase/firestore";
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

export type ComplaintEditFields = {
  category: string;
  location: string;
  priority: string;
  description: string;
  /** Omit to leave the existing attachment untouched; pass [] to remove it, or a new image to replace it. */
  images?: { data: Bytes; type: string; name: string }[];
};

/** Only allowed while a complaint is still "Pending" — enforced by callers before showing the edit UI. */
export async function editComplaint(id: string, fields: ComplaintEditFields) {
  await updateDoc(doc(db, "complaints", id), fields);
}

export async function verifyComplaint(id: string) {
  await updateDoc(doc(db, "complaints", id), { status: "Closed" });
}

export type AssignedTechnician = {
  id: string;
  name: string;
  phone?: string;
};

export async function assignTechnician(ticketId: string, technician: AssignedTechnician) {
  const now = new Date();
  const deadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  await updateDoc(doc(db, "complaints", ticketId), {
    status: "Assigned",
    technicianId: technician.id,
    technicianName: technician.name,
    technicianPhone: technician.phone || "",
    assignedDate: now.toISOString().split("T")[0],
    assignedAt: now.toISOString(),
    deadlineAt: deadline.toISOString(),
    remarks: `Assigned to ${technician.name}.`,
  });
}

export async function updateComplaintProgress(
  id: string,
  nextStatus: "In Progress" | "Completed",
  remarks: string,
) {
  const now = new Date().toISOString();
  await updateDoc(doc(db, "complaints", id), {
    status: nextStatus,
    ...(nextStatus === "Completed" ? { completedAt: now } : {}),
    ...(remarks.trim() ? { remarks: remarks.trim() } : {}),
  });
}

export type TechnicianNotificationPayload = {
  technicianName: string;
  technicianEmail: string;
  technicianPhone: string;
  ticketId: string;
  ticketNumber?: number;
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
