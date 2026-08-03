"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Icon from "@/components/ui/Icon";
import PageHeader from "@/components/admin/track-complaints/PageHeader";
import SearchFilterBar from "@/components/admin/track-complaints/SearchFilterBar";
import TimelineList, { TechnicianGroup } from "@/components/admin/track-complaints/TimelineList";
import { Complaint } from "@/types/complaint";
import { mapComplaintDoc } from "@/hooks/useComplaintsFeed";
import { getDeadlineInfo } from "@/utils/deadline";

export default function AdminTrackComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [technicians, setTechnicians] = useState<
    { id: string; name: string; email: string; phone?: string; dept?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // 1. Fetch technician user accounts
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const techList = snapshot.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || "Unnamed Technician",
            email: data.email || "",
            phone: data.phone || "",
            dept: data.department || "Maintenance",
            role: data.role || "Student",
          };
        })
        .filter((u) => u.role.toLowerCase() === "technician");

      setTechnicians(techList);
    });

    // 2. Fetch all complaints
    const unsubComplaints = onSnapshot(collection(db, "complaints"), (snapshot) => {
      setComplaints(snapshot.docs.map(mapComplaintDoc));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubComplaints();
    };
  }, []);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Match against the live technicians list (not just each ticket's stored technicianName
  // snapshot), so a name search still finds a technician even if that field is stale/missing
  // on some of their tickets.
  const matchedTechnicianIds = new Set(
    trimmedQuery
      ? technicians.filter((t) => t.name.toLowerCase().includes(trimmedQuery)).map((t) => t.id)
      : [],
  );

  // Filter complaints by search query and status filter
  const filteredComplaints = complaints.filter((c) => {
    const matchQuery =
      !trimmedQuery ||
      c.id.toLowerCase().includes(trimmedQuery) ||
      c.category.toLowerCase().includes(trimmedQuery) ||
      c.description.toLowerCase().includes(trimmedQuery) ||
      c.location.toLowerCase().includes(trimmedQuery) ||
      (c.technicianName && c.technicianName.toLowerCase().includes(trimmedQuery)) ||
      (c.technicianId && matchedTechnicianIds.has(c.technicianId));

    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Group filtered complaints by technician
  const techMap: Record<string, TechnicianGroup> = {};

  technicians.forEach((t) => {
    techMap[t.id] = {
      id: t.id,
      name: t.name,
      email: t.email,
      phone: t.phone,
      dept: t.dept,
      tickets: [],
    };
  });

  const unassignedTickets: Complaint[] = [];

  filteredComplaints.forEach((ticket) => {
    let matchedTechId = ticket.technicianId;

    if (!matchedTechId) {
      const foundTech = technicians.find(
        (t) =>
          (ticket.technicianEmail && t.email.toLowerCase() === ticket.technicianEmail.toLowerCase()) ||
          (ticket.technicianName && t.name.toLowerCase() === ticket.technicianName.toLowerCase())
      );
      if (foundTech) matchedTechId = foundTech.id;
    }

    if (matchedTechId && techMap[matchedTechId]) {
      techMap[matchedTechId].tickets.push(ticket);
    } else if (ticket.technicianName) {
      // Create ad-hoc technician group if doc missing from users
      const fallbackKey = ticket.technicianName;
      if (!techMap[fallbackKey]) {
        techMap[fallbackKey] = {
          id: fallbackKey,
          name: ticket.technicianName,
          email: ticket.technicianEmail || "",
          phone: ticket.technicianPhone || "",
          tickets: [],
        };
      }
      techMap[fallbackKey].tickets.push(ticket);
    } else {
      unassignedTickets.push(ticket);
    }
  });

  const allTechnicianGroups = Object.values(techMap);

  // While a search or status filter is active, only show technicians with matching tickets,
  // or whose own name matches the search (so searching a technician's name still shows their
  // profile even if they currently have zero matching/assigned tickets).
  const isFiltering = trimmedQuery !== "" || statusFilter !== "all";
  const technicianGroups = isFiltering
    ? allTechnicianGroups.filter((g) => g.tickets.length > 0 || matchedTechnicianIds.has(g.id))
    : allTechnicianGroups;

  // Top metric counters
  const activeTechniciansCount = technicianGroups.filter((g) =>
    g.tickets.some((t) => (t.status || "").toLowerCase() !== "rejected")
  ).length;

  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const assignedCount = complaints.filter((c) => c.status === "Assigned").length;
  const completedCount = complaints.filter(
    (c) =>
      c.status === "Completed" ||
      c.status === "Verified" ||
      c.status === "Closed"
  ).length;

  const overdueCount = complaints.filter((c) => {
    if (c.status === "Completed") return false;
    const deadline = getDeadlineInfo(c.assignedAt, c.assignedDate, c.status);
    return deadline.isOverdue;
  }).length;

  return (
    <div className="space-y-8 pb-12">
      <title>Technician Audit & Timelines | JMMS Admin</title>

      <PageHeader />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-[#908fa0]">Active Techs</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Icon name="engineering" className="text-base" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{activeTechniciansCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Technicians Active</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Icon name="pending_actions" className="text-base" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Under Active Repair</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">Assigned</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon name="assignment" className="text-base" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{assignedCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">3-Day Deadline Active</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon name="check_circle" className="text-base" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Resolved Successfully</p>
          </div>
        </div>
      </div>

      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
        </div>
      ) : (
        <TimelineList technicianGroups={technicianGroups} />
      )}
    </div>
  );
}
