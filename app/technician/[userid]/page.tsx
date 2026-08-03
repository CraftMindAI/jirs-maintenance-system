"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { doc, getDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Complaint } from "@/app/dashboard/page";
import { getDeadlineInfo } from "@/utils/deadline";

interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  dept?: string;
  role?: string;
}

export default function TechnicianDetailTimelinePage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = use(params);
  const [techUser, setTechUser] = useState<TechnicianUser | null>(null);
  const [tickets, setTickets] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Assigned" | "In Progress" | "Completed">("All");

  useEffect(() => {
    async function loadTechInfo() {
      try {
        const userDoc = await getDoc(doc(db, "users", userid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setTechUser({
            id: userDoc.id,
            name: data.name || "Technician",
            email: data.email || "",
            phone: data.phone || "",
            dept: data.department || "Maintenance",
            role: data.role || "Technician",
          });
        }
      } catch (err) {
        console.error("Error loading technician profile:", err);
      }
    }
    loadTechInfo();
  }, [userid]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "complaints"), (snapshot) => {
      const list: Complaint[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId || "",
          category: data.category || "General",
          location: data.location || "N/A",
          priority: data.priority || "Medium",
          description: data.description || "",
          status: data.status || "Pending",
          date: data.createdAt || data.date || "",
          assignedDate: data.assignedDate || "",
          assignedAt: data.assignedAt || "",
          completedAt: data.completedAt || "",
          technicianId: data.technicianId || "",
          technicianName: data.technicianName || "",
          technicianPhone: data.technicianPhone || "",
          remarks: data.remarks || "",
          imageUrls: data.imageUrls || [],
        };
      });

      // Filter tickets matching this technician ID, email, or name
      const filtered = list.filter(
        (c) =>
          c.technicianId === userid ||
          (techUser?.email && c.technicianEmail === techUser.email) ||
          (techUser?.name && c.technicianName === techUser.name)
      );

      setTickets(filtered);
      setLoading(false);
    });

    return () => unsub();
  }, [userid, techUser]);

  const assignedCount = tickets.filter((t) => t.status === "Assigned").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const completedCount = tickets.filter((t) => t.status === "Completed").length;
  const totalCount = tickets.length;

  const visibleTickets = tickets.filter((t) => {
    if (activeTab === "All") return true;
    return t.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b101d] text-slate-900 dark:text-[#dae2fd] p-6 lg:p-10 space-y-8">
      <title>{techUser?.name || "Technician"} Timeline | JMMS</title>

      {/* Header Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#464554]/20 pb-6">
        <div>
          <Link
            href="/admin/user-management"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-[#908fa0] hover:text-primary dark:hover:text-[#c0c1ff] mb-2 transition-colors"
          >
            <Icon name="arrow_back" className="text-sm" />
            Back to User Management
          </Link>
          <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Technician Activity & Incident Timelines
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-[#8083ff]/10 dark:text-[#c0c1ff]">
            ID: {userid}
          </span>
        </div>
      </div>

      {/* Technician Info & Ticket Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8083ff] to-[#4edea3] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
              {(techUser?.name || "T").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                {techUser?.name || "Loading Technician..."}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#908fa0]">{techUser?.email || "-"}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary dark:bg-[#8083ff]/10 dark:text-[#c0c1ff]">
                {techUser?.role || "Technician"} • {techUser?.dept || "Maintenance"}
              </span>
            </div>
          </div>
          {techUser?.phone && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#464554]/10 text-xs text-slate-500 dark:text-[#908fa0] flex items-center gap-2">
              <Icon name="phone" className="text-sm text-primary" />
              {techUser.phone}
            </div>
          )}
        </div>

        {/* Ticket Metric Cards */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-[#908fa0] uppercase tracking-wider">Total Tickets</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Icon name="confirmation_number" className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{totalCount}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Assigned</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Icon name="assignment" className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{assignedCount}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">3-Day Deadline Active</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">In Progress</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Icon name="pending_actions" className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Under Resolution</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Completed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Icon name="check_circle" className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Successfully Fixed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#464554]/20 pb-4 overflow-x-auto">
        {(["All", "Assigned", "In Progress", "Completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white dark:bg-[#171f33] text-slate-600 dark:text-[#908fa0] hover:bg-slate-100 dark:hover:bg-[#131b2e]"
            }`}
          >
            {tab}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-[#908fa0]"
            }`}>
              {tab === "All"
                ? totalCount
                : tab === "Assigned"
                ? assignedCount
                : tab === "In Progress"
                ? inProgressCount
                : completedCount}
            </span>
          </button>
        ))}
      </div>

      {/* Ticket List & Timelines */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
        </div>
      ) : visibleTickets.length === 0 ? (
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
          <Icon name="assignment_late" className="text-4xl text-slate-400 dark:text-[#908fa0] mb-3 block mx-auto" />
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-[#dae2fd]">No Tickets Found</h3>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">There are no {activeTab.toLowerCase()} tickets for this technician.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleTickets.map((ticket) => {
            const deadline = getDeadlineInfo(ticket.assignedAt, ticket.assignedDate, ticket.status);
            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-6"
              >
                {/* Ticket Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#464554]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-primary dark:text-[#c0c1ff]">
                      {ticket.id}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${deadline.badgeClass}`}>
                      <Icon name="timer" className="text-sm" />
                      {deadline.timeLeftText}
                    </span>
                    <Link
                      href={`/admin/view-complaints/${ticket.id}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-primary dark:hover:text-[#c0c1ff] transition-colors"
                      title="View Ticket Details"
                    >
                      <Icon name="open_in_new" className="text-lg" />
                    </Link>
                  </div>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Category & Location</span>
                    <p className="font-bold text-slate-800 dark:text-[#dae2fd]">
                      {ticket.category} • <span className="font-normal text-slate-500">{ticket.location}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Description</span>
                    <p className="text-slate-700 dark:text-[#c7c4d7] line-clamp-2">
                      {ticket.description || "No description provided."}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Remarks / Note</span>
                    <p className="text-slate-700 dark:text-[#c7c4d7] italic">
                      {ticket.remarks || "No technician remarks logged."}
                    </p>
                  </div>
                </div>

                {/* Incident Timeline Visual */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#464554]/10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Icon name="timeline" className="text-sm text-primary" />
                    Incident Timeline
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                    {/* Step 1: Created */}
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-[#131b2e]/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-[#464554]/10">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Created</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ticket.date || "Logged"}</div>
                      </div>
                    </div>

                    {/* Step 2: Assigned */}
                    <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                      ticket.status === "Assigned" || ticket.status === "In Progress" || ticket.status === "Completed"
                        ? "bg-slate-50 dark:bg-[#131b2e]/60 border-slate-200/60 dark:border-[#464554]/10"
                        : "bg-slate-100/40 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        ticket.status === "Assigned" || ticket.status === "In Progress" || ticket.status === "Completed"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}>
                        {ticket.status === "Assigned" || ticket.status === "In Progress" || ticket.status === "Completed" ? "✓" : "2"}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">Assigned</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ticket.assignedDate || (ticket.assignedAt ? new Date(ticket.assignedAt).toLocaleDateString() : "Pending")}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: In Progress */}
                    <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                      ticket.status === "In Progress" || ticket.status === "Completed"
                        ? "bg-slate-50 dark:bg-[#131b2e]/60 border-slate-200/60 dark:border-[#464554]/10"
                        : "bg-slate-100/40 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        ticket.status === "In Progress" || ticket.status === "Completed"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}>
                        {ticket.status === "In Progress" || ticket.status === "Completed" ? "✓" : "3"}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">In Progress</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ticket.status === "In Progress" || ticket.status === "Completed" ? "Active" : "Pending"}
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Resolution / 3-Day Target */}
                    <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${
                      ticket.status === "Completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100/40 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-800 opacity-75"
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        ticket.status === "Completed"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      }`}>
                        {ticket.status === "Completed" ? "✓" : "4"}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">
                          {ticket.status === "Completed" ? "Completed" : "3-Day Target"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {ticket.status === "Completed"
                            ? (ticket.completedAt ? new Date(ticket.completedAt).toLocaleDateString() : "Resolved")
                            : deadline.timeLeftText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
