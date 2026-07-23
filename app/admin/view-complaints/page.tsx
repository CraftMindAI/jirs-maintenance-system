"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Complaint } from "../page";

const TECHNICIANS = [
  { name: "Rajesh Kumar", phone: "+91 98450 12345", dept: "Plumbing" },
  { name: "S. Murthy", phone: "+91 98450 54321", dept: "Electrical" },
  { name: "Amit Pal", phone: "+91 98450 88990", dept: "Carpentry" },
  { name: "Vikram Sen", phone: "+91 98450 22110", dept: "HVAC" },
];

function ViewComplaintsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
      const list = JSON.parse(stored);
      setComplaints(list);
    }
  }, []);

  // Proactive ticket detailed parameter view on mount
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
          remarks: `Assigned to ${selectedTechObj?.dept} maintenance team.`,
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
    triggerToast("Ticket deleted successfully.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Status sorting severity score:
  // Pending -> Assigned -> In Progress -> Completed -> Verified
  const getSeverityScore = (status: string) => {
    switch (status) {
      case "Pending": return 1;
      case "Assigned": return 2;
      case "In Progress": return 3;
      case "Completed": return 4;
      case "Verified": return 5;
      default: return 6;
    }
  };

  // Filter list
  const filteredComplaints = complaints
    .filter((c) => {
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
    })
    .sort((a, b) => getSeverityScore(a.status) - getSeverityScore(b.status));

  const detailedComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;

  return (
    <div className="space-y-8 pb-12">
      <title>View Complaints | JMMS Admin</title>

      {/* Toast Alert Popup */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl flex items-center gap-3 animate-scale-in text-sm font-bold border border-white/10">
          <Icon name="check_circle" className="text-emerald-500 text-xl" />
          {showToast}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Manage Complaints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Overview, verify, assign technicians, and close active maintenance tickets.
          </p>
        </div>
      </div>

      {/* 2. FILTERS SEARCH TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="relative w-full">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID, category, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-xs font-bold outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Verified">Verified</option>
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-xs font-bold outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-xs font-bold outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Civil">Civil</option>
            <option value="Carpentry">Carpentry</option>
            <option value="HVAC">HVAC</option>
          </select>

          {/* Technician */}
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-xs font-bold outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Technicians</option>
            <option value="unassigned">Unassigned</option>
            {TECHNICIANS.map((t) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. TICKET ROSTER DATA GRID */}
      {filteredComplaints.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6">Ticket ID</th>
                  <th className="py-4 px-6">User / Location</th>
                  <th className="py-4 px-6">Complaint Type</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Technician</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                {filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-850 dark:text-slate-100 font-bold">{item.id}</td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 dark:text-slate-100">Siddharth Roy</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.location}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{item.category}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.priority === "High" ? "bg-red-500/10 text-red-500" :
                        item.priority === "Medium" ? "bg-amber-500/10 text-amber-500" :
                        "bg-slate-500/10 text-slate-500"
                      }`}>{item.priority}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 dark:text-slate-500 text-xs">{item.date}</td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      {item.technicianName ? (
                        <span className="flex items-center gap-1.5">
                          <Icon name="person" className="text-sm text-slate-400" />
                          {item.technicianName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.status === "Pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" :
                        item.status === "Assigned" ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/20" :
                        item.status === "In Progress" ? "bg-sky-500/15 text-sky-500 border border-sky-500/20" :
                        "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      }`}>{item.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3 text-slate-400 dark:text-slate-500">
                        <button onClick={() => setSelectedComplaintId(item.id)} title="View Details" className="hover:text-primary transition-colors cursor-pointer">
                          <Icon name="visibility" className="text-xl" />
                        </button>
                        {item.status === "Pending" && (
                          <button onClick={() => handleApproveAndAssign(item.id)} title="Approve & Assign" className="hover:text-emerald-500 transition-colors cursor-pointer">
                            <Icon name="assignment_turned_in" className="text-xl" />
                          </button>
                        )}
                        <button onClick={() => setShowDeleteConfirm(item.id)} title="Delete Ticket" className="hover:text-red-500 transition-colors cursor-pointer">
                          <Icon name="delete" className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card view */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredComplaints.map((item) => (
              <div key={item.id} className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-850 dark:text-slate-100">{item.id}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.status === "Pending" ? "bg-amber-500/15 text-amber-500" :
                    item.status === "Assigned" ? "bg-indigo-500/15 text-indigo-500" :
                    item.status === "In Progress" ? "bg-sky-500/15 text-sky-500" :
                    "bg-emerald-500/15 text-emerald-450"
                  }`}>{item.status}</span>
                </div>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="font-bold text-slate-700 dark:text-slate-350">{item.category} • {item.location}</div>
                  <div className="text-slate-400">User: Siddharth Roy</div>
                  {item.technicianName && <div className="text-slate-400 font-semibold">Tech: {item.technicianName}</div>}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                  <div className="flex gap-4 text-slate-400">
                    <button onClick={() => setSelectedComplaintId(item.id)} className="hover:text-primary cursor-pointer">
                      <Icon name="visibility" className="text-lg" />
                    </button>
                    {item.status === "Pending" && (
                      <button onClick={() => handleApproveAndAssign(item.id)} className="hover:text-emerald-500 cursor-pointer">
                        <Icon name="assignment_turned_in" className="text-lg" />
                      </button>
                    )}
                    <button onClick={() => setShowDeleteConfirm(item.id)} className="hover:text-red-500 cursor-pointer">
                      <Icon name="delete" className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
          <Icon name="search_off" className="text-4xl text-slate-300 mb-4 block" />
          <h3 className="font-display text-xl font-bold">No Tickets Found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjustments on your filter variables or search queries.
          </p>
        </div>
      )}

      {/* 4. MODAL: TECHNICIAN ASSIGNMENT */}
      {assigningTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
              <Icon name="assignment_ind" className="text-3xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Approve & Assign Technician</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                Approve ticket **{assigningTicketId}** and assign a specialized service technician to resolve the issue.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="tech-select" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Select Technician
              </label>
              <select
                id="tech-select"
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none focus:border-primary"
              >
                <option value="">Choose technician...</option>
                {TECHNICIANS.map((t) => (
                  <option key={t.name} value={t.name}>{t.name} ({t.dept})</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setAssigningTicketId(null)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmAssignment}
                disabled={!selectedTechnician}
                className="flex-1 py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 text-sm disabled:opacity-50 cursor-pointer"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: DETAILED TICKET VIEW */}
      {detailedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 md:p-6" onClick={() => setSelectedComplaintId(null)}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-display text-xl font-black text-slate-800 dark:text-slate-100">Ticket Detailed Logs ({detailedComplaint.id})</h3>
              <button onClick={() => setSelectedComplaintId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Panel: details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Category Type</span>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{detailedComplaint.category}</div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Location Area</span>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">{detailedComplaint.location}</div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Reporter User</span>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">Siddharth Roy (Student)</div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Priority Urgency</span>
                  <div className="mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      detailedComplaint.priority === "High" ? "bg-red-500/10 text-red-500" :
                      detailedComplaint.priority === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-slate-500/10 text-slate-500"
                    }`}>{detailedComplaint.priority} Priority</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Details Description</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{detailedComplaint.description}</p>
                </div>
              </div>

              {/* Right Panel: photo, technician details */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Reference Attachment</span>
                  <div className="rounded-xl overflow-hidden aspect-[4/3] border border-slate-100 dark:border-slate-800/40 relative mt-1">
                    <img src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg" alt="Attachment" className="w-full h-full object-cover" />
                  </div>
                </div>

                {detailedComplaint.technicianName && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 rounded-2xl space-y-1.5">
                    <div className="text-xs font-bold text-primary">Allocated Staff</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{detailedComplaint.technicianName}</div>
                    <div className="text-xs text-slate-450">{detailedComplaint.remarks}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/40">
              <button
                onClick={() => setSelectedComplaintId(null)}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 text-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <Icon name="warning" className="text-3xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Confirm Deletion</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Delete complaint ticket **{showDeleteConfirm}**? This removes it permanently from administrative rosters.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-650 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 text-sm cursor-pointer"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewComplaints() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ViewComplaintsContent />
    </Suspense>
  );
}
