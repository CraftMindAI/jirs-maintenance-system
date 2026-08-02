"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, QueryDocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/app/dashboard/page";

/** Maps a raw `complaints/{id}` Firestore doc into the shared `Complaint` shape. */
export function mapComplaintDoc(doc: QueryDocumentSnapshot<DocumentData>): Complaint {
  const data = doc.data();
  const createdAt = data.createdAt as Timestamp | undefined;

  return {
    id: doc.id,
    category: data.category || "Uncategorized",
    location: data.location || "-",
    priority: data.priority || "Medium",
    status: data.status || "Pending",
    date: createdAt ? createdAt.toDate().toISOString().split("T")[0] : data.date || "",
    description: data.description || "",
    technicianId: data.technicianId,
    technicianName: data.technicianName,
    technicianEmail: data.technicianEmail,
    technicianPhone: data.technicianPhone,
    assignedDate: data.assignedDate,
    assignedAt: data.assignedAt,
    deadlineAt: data.deadlineAt,
    completedAt: data.completedAt,
    remarks: data.remarks,
    userId: data.userId,
  };
}

/**
 * Live-subscribes to the `complaints` collection, shared by any page that needs
 * the ticket list — admin overview, the complaints table, or a filtered "my tickets" view.
 *
 * - `filterUserId === null` fetches every complaint (admins/technicians, or an
 *   admin-only overview page that isn't gated by ownership).
 * - `filterUserId` as a uid string fetches only that user's own complaints.
 * - `filterUserId === undefined` means "not ready yet" (e.g. still resolving auth/role)
 *   and holds off subscribing at all, so callers don't briefly fetch the wrong scope.
 */
export function useComplaintsFeed(filterUserId: string | null | undefined) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filterUserId === undefined) return;

    setLoading(true);
    const complaintsQuery =
      filterUserId === null
        ? collection(db, "complaints")
        : query(collection(db, "complaints"), where("userId", "==", filterUserId));

    const unsubscribe = onSnapshot(
      complaintsQuery,
      (snapshot) => {
        setComplaints(snapshot.docs.map(mapComplaintDoc));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [filterUserId]);

  return { complaints, loading };
}
