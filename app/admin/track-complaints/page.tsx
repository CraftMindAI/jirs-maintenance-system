"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { Complaint } from "../page";

export default function AdminTrackComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");

  // Sync state
  useEffect(() => {
    const stored = localStorage.getItem("jmms_complaints");
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, []);

  const TIMELINE_STEPS = [
    { key: "Pending", label: "Submitted" },
    { key: "Verified", label: "Approved" },
    { key: "Assigned", label: "Assigned" },
    { key: "In Progress", label: "Started" },
    { key: "Completed", label: "Completed" },
    { key: "Closed", label: "Closed" },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ["Pending", "Verified", "Assigned", "In Progress", "Completed", "Closed"];
    
    // Normalize aliases
    let normCurrent = currentStatus;
    if (currentStatus === "Verified") normCurrent = "Verified";
    
    const currentIdx = order.indexOf(normCurrent);
    const stepIdx = order.indexOf(stepKey);

    if (currentIdx >= stepIdx) return "completed";
    if (currentIdx + 1 === stepIdx) return "active";
    return "pending";
  };

  const filtered = complaints.filter((c) => {
    const matchQuery =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchTech =
      techFilter === "all" ||
      (techFilter === "unassigned" && !c.technicianName) ||
      c.technicianName === techFilter;

    return matchQuery && matchStatus && matchTech;
  });

  return (
    <div className="space-y-8 pb-12">
      <title>Track Complaints | JMMS Admin</title>

      {/* Header info */}
      <div>
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Audit Tracking Timelines
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor step transitions, technician assignments, and workflow compliance across the campus.
        </p>
      </div>

      {/* Query Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID, location, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Roster cards list */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6 hover:shadow-md transition-shadow relative overflow-hidden card-shine"
            >
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
                    {item.category} ({item.id})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Location: {item.location} • Reporter: Siddharth Roy</p>
                </div>
                <div className="text-xs font-semibold text-slate-500 flex gap-4">
                  <div>
                    <span className="text-slate-400">Technician:</span>
                    <span className="text-slate-700 dark:text-slate-350 ml-1.5 font-bold">
                      {item.technicianName || "Unassigned"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">ETA:</span>
                    <span className="text-slate-750 dark:text-slate-300 ml-1.5 font-bold">24 Hrs</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Stepper Progress Timeline */}
              <div className="overflow-x-auto py-2">
                <div className="min-w-[640px] flex items-center justify-between relative px-4">
                  {/* Connecting line */}
                  <div className="absolute top-[15px] left-8 right-8 h-[2px] bg-slate-150 dark:bg-slate-800 pointer-events-none" />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const status = getStepStatus(step.key, item.status);
                    return (
                      <div key={idx} className="relative flex flex-col items-center gap-2 text-center group z-10 w-24">
                        <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          status === "completed"
                            ? "bg-primary border-primary text-white scale-110 shadow-lg"
                            : status === "active"
                            ? "bg-white dark:bg-slate-900 border-primary text-primary animate-pulse"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                        }`}>
                          {status === "completed" ? (
                            <Icon name="check" className="text-xs font-black" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          status === "completed" ? "text-slate-750 dark:text-slate-200" :
                          status === "active" ? "text-primary dark:text-blue-300 font-black" :
                          "text-slate-400 dark:text-slate-650"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-16 text-center shadow-sm">
          <Icon name="assignment_late" className="text-4xl text-slate-300 mb-4 block" />
          <h3 className="font-display text-xl font-bold">No Active Tracking Feeds</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            No complaints are active under the selected query categories.
          </p>
        </div>
      )}
    </div>
  );
}
