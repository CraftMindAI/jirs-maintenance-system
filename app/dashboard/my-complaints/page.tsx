"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Complaint } from "../page";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ADMIN_ROLES = ["admin"];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    email: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Sync auth state (role + email decide which complaints this user may see)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          const data = docSnap.exists() ? docSnap.data() : null;
          setUserProfile({
            name: data?.name || user.displayName || "User",
            role: data?.role || "Student",
            email: user.email || "",
          });
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Siddharth Roy",
            role: "Student",
            email: "siddharth.r@jirs.ac.in",
          });
        }
      } else {
        // Mock fallback for presentation
        setUserProfile({
          name: "Siddharth Roy",
          role: "Student",
          email: "siddharth.r@jirs.ac.in",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state
  useEffect(() => {
    const stored = localStorage.getItem("jmms_complaints");
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, []);

  const isAdmin =
    !!userProfile && ADMIN_ROLES.includes(userProfile.role.toLowerCase());

  // Admins see every complaint; students/staff only see the ones they raised
  const visibleComplaints = isAdmin
    ? complaints
    : complaints.filter((c) => c.submittedBy === userProfile?.email);

  const saveComplaints = (updatedList: Complaint[]) => {
    localStorage.setItem("jmms_complaints", JSON.stringify(updatedList));
    setComplaints(updatedList);
  };

  const handleDelete = (id: string) => {
    const updated = complaints.filter((c) => c.id !== id);
    saveComplaints(updated);
    setShowDeleteConfirm(null);
  };

  // Filter complaints based on status severity sorting:
  // Pending -> Assigned -> In Progress -> Completed -> Verified
  const getSeverityScore = (status: string) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Assigned":
        return 2;
      case "In Progress":
        return 3;
      case "Completed":
        return 4;
      case "Verified":
        return 5;
      default:
        return 6;
    }
  };

  const filteredComplaints = visibleComplaints
    .filter((c) => {
      const matchQuery =
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
      return matchQuery && matchStatus && matchPriority;
    })
    .sort((a, b) => getSeverityScore(a.status) - getSeverityScore(b.status));

  return (
    <div className="space-y-8 pb-12">
      <title>My Complaints | JMMS</title>

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {isAdmin ? "All Maintenance Tickets" : "My Maintenance Tickets"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? "Manage, filter, and track status logs for every complaint raised campus-wide."
              : "Manage, filter, and track status logs for the complaints you've raised."}
          </p>
        </div>
        <Link
          href="/dashboard/add-complaint"
          className="bg-primary hover:bg-opacity-90 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all text-sm scale-100 active:scale-95"
        >
          <Icon name="add" className="text-xl" />
          Add Complaint
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID, category, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary dark:focus:border-primary transition-all"
          />
        </div>
        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary dark:focus:border-primary transition-all cursor-pointer appearance-none bg-no-repeat"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        {/* Priority Filter */}
        <div className="w-full lg:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none focus:border-primary dark:focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Main complaints Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Desktop Table view */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-4 px-6">Ticket Number</th>
                  <th className="py-4 px-6">Complaint Category</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                {filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-800 dark:text-slate-100 font-bold">{item.id}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{item.category}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs truncate max-w-[150px]">{item.location}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.priority === "High" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                        item.priority === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.status === "Pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/30" :
                        item.status === "Assigned" ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/30" :
                        item.status === "In Progress" ? "bg-sky-500/15 text-sky-500 border border-sky-500/30" :
                        "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 dark:text-slate-500 text-xs">{item.date}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3 text-slate-400 dark:text-slate-500">
                        <Link
                          href={`/dashboard/track-complaint?ticket=${item.id}`}
                          title="View Progress"
                          className="hover:text-primary dark:hover:text-white transition-colors"
                        >
                          <Icon name="visibility" className="text-xl" />
                        </Link>
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          title="Delete Ticket"
                          className="hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Icon name="delete" className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredComplaints.map((item) => (
              <div key={item.id} className="p-6 space-y-4 hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.id}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    item.status === "Pending" ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" :
                    item.status === "Assigned" ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/20" :
                    item.status === "In Progress" ? "bg-sky-500/15 text-sky-500 border border-sky-500/20" :
                    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="font-bold text-slate-700 dark:text-slate-300">{item.category}</div>
                  <div className="text-slate-400 dark:text-slate-500">{item.location}</div>
                  <p className="line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.priority === "High" ? "bg-red-500/10 text-red-500" :
                      item.priority === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-slate-500/10 text-slate-500"
                    }`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center">{item.date}</span>
                  </div>
                  <div className="flex gap-4 text-slate-400">
                    <Link href={`/dashboard/track-complaint?ticket=${item.id}`} className="hover:text-primary transition-colors">
                      <Icon name="visibility" className="text-lg" />
                    </Link>
                    <button onClick={() => setShowDeleteConfirm(item.id)} className="hover:text-red-500 transition-colors cursor-pointer">
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
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-6">
            <Icon name="assignment_late" className="text-3xl" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">No Tickets Found</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
            There are no complaints matching your current filters. Try resetting search fields or raise a new request.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-in">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
              <Icon name="warning" className="text-3xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Confirm Deletion</h4>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete maintenance ticket **{showDeleteConfirm}**? This action cannot be undone and will remove it from the tracking feed.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all text-sm cursor-pointer"
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
