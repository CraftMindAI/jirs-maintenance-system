import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/types/complaint";
import { TechnicianOption } from "@/components/admin/view-complaints/constants";

export type AdminProfile = {
  name: string;
  email: string;
  phone: string;
};

/** The signed-in admin's own profile, used as the "Assigned By" details in the technician notification email. */
export async function fetchAdminProfile(uid: string): Promise<AdminProfile> {
  const docSnap = await getDoc(doc(db, "users", uid));
  const data = docSnap.exists() ? docSnap.data() : null;
  return {
    name: data?.name || "Administrator",
    email: data?.email || "",
    phone: data?.phone || "",
  };
}

/** Every registered technician account, for the Assign Technician dropdown. */
export async function fetchTechnicianOptions(): Promise<TechnicianOption[]> {
  const snapshot = await getDocs(query(collection(db, "users"), where("role", "==", "Technician")));
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.data().name || d.data().email || "Unnamed Technician",
    phone: d.data().phone || "",
    email: d.data().email || "",
  }));
}

export type ComplaintFilters = {
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  deptFilter: string;
  techFilter: string;
};

const STATUS_ORDER: Record<string, number> = {
  pending: 1,
  approved: 2,
  assigned: 3,
  "in progress": 4,
  inprogress: 4,
  completed: 5,
  verified: 5,
  closed: 5,
  rejected: 6,
};

export function filterComplaints(complaints: Complaint[], filters: ComplaintFilters): Complaint[] {
  const { searchQuery, statusFilter, priorityFilter, deptFilter, techFilter } = filters;
  const query = searchQuery.toLowerCase();

  const filtered = complaints.filter((c) => {
    const matchQuery =
      c.id.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      (c.location && c.location.toLowerCase().includes(query));
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
    const matchDept = deptFilter === "all" || c.category === deptFilter;
    const matchTech =
      techFilter === "all" ||
      (techFilter === "unassigned" && !c.technicianName) ||
      c.technicianName === techFilter;

    return matchQuery && matchStatus && matchPriority && matchDept && matchTech;
  });

  return [...filtered].sort((a, b) => {
    const orderA = STATUS_ORDER[(a.status || "").toLowerCase()] ?? 99;
    const orderB = STATUS_ORDER[(b.status || "").toLowerCase()] ?? 99;
    return orderA - orderB;
  });
}
