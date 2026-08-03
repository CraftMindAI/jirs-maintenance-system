"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";

export type Complaint = {
  id: string;
  category: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Closed" | "Approved";
  date: string; // YYYY-MM-DD (legacy/mock)
  description: string;
  technicianName?: string;
  technicianEmail?: string;
  createdAt?: any; // Firestore Timestamp
};

export default function TechnicianReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfileName, setUserProfileName] = useState("Technician");
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("Monthly Report");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  useEffect(() => {
    // Default to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let techName = currentUser.displayName || "Technician";
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().name) {
            techName = userDoc.data().name;
            setUserProfileName(techName);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }

        const complaintsRef = collection(db, "complaints");
        const unsubscribeSnapshot = onSnapshot(complaintsRef, (snapshot) => {
          const fetchedComplaints: Complaint[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Complaint;
            if (
              data.technicianEmail === currentUser.email ||
              data.technicianName === techName ||
              !data.technicianName
            ) {
              fetchedComplaints.push({ ...data, id: docSnap.id });
            }
          });

          fetchedComplaints.sort((a, b) => {
            const aTime = a.createdAt ? a.createdAt.toDate().getTime() : (a.date ? new Date(a.date).getTime() : 0);
            const bTime = b.createdAt ? b.createdAt.toDate().getTime() : (b.date ? new Date(b.date).getTime() : 0);
            return bTime - aTime;
          });

          setAllComplaints(fetchedComplaints);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching reports:", error);
          setLoading(false);
        });

        // Safety fallback: if Firebase hangs for more than 5 seconds, stop loading
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 5000);

        return () => {
          unsubscribeSnapshot();
          clearTimeout(timeout);
        };
      } else {
        setAllComplaints([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Apply Filters whenever data, dates, or status change
  useEffect(() => {
    let filtered = allComplaints;

    // Filter by Date
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      // End date is inclusive
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      const endTime = end.getTime();

      filtered = filtered.filter(c => {
        const cTime = c.createdAt ? c.createdAt.toDate().getTime() : (c.date ? new Date(c.date).getTime() : 0);
        return cTime >= start && cTime <= endTime;
      });
    }

    // Filter by Status
    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  }, [allComplaints, startDate, endDate, statusFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleResetFilters = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setReportType("Monthly Report");
    setStatusFilter("All Statuses");
  };

  const stats = {
    total: filteredComplaints.length,
    completed: filteredComplaints.filter(c => c.status === "Completed" || c.status === "Closed").length,
    inProgress: filteredComplaints.filter(c => c.status === "In Progress").length,
    pending: filteredComplaints.filter(c => c.status === "Assigned" || c.status === "Pending" || c.status === "Approved").length,
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 md:px-8 print:p-0 print:m-0 print:space-y-6 print:max-w-none">
      <title>Reports | Technician | JMMS</title>

      {/* Header (Hidden when printing) */}
      <div className="print:hidden mt-4">
        <h1 className="font-display text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          System Reports Console
        </h1>
        <p className="text-sm font-bold text-slate-500 mt-2">
          Export analytical summaries, SLA resolution averages, and technician performances.
        </p>
      </div>

      {/* Filter Parameters Card (Hidden when printing) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm print:hidden">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-5 h-5 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" /></svg>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Filter Parameters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Report Type</label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="Monthly Report">Monthly Report</option>
                <option value="Weekly Report">Weekly Report</option>
                <option value="Custom Date Range">Custom Date Range</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Status Filter</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[#0f4c81] dark:text-slate-300 text-sm font-bold rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Generate Summary
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            EXPORT PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Generating report...</div>
      ) : (
        /* Report Body / Summary Box */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm print:border-none print:shadow-none print:p-0">
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 print:border-b-2 print:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">JMMS Summary</h2>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">{reportType.toUpperCase()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">EXPORT DATE: <span className="font-bold text-slate-700 dark:text-slate-300">{new Date().toISOString().split('T')[0]}</span></p>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">GENERATED BY: <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{userProfileName}</span></p>
            </div>
          </div>

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 print:grid-cols-4 mb-10">
            {[
              { label: "Total Tasks", count: stats.total, color: "text-slate-700 dark:text-slate-200" },
              { label: "Completed", count: stats.completed, color: "text-emerald-600" },
              { label: "In Progress", count: stats.inProgress, color: "text-sky-600" },
              { label: "Pending Start", count: stats.pending, color: "text-amber-600" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 print:border-slate-300 rounded-3xl p-5 shadow-sm text-center">
                <h3 className={`text-3xl font-black ${stat.color} mb-1`}>{stat.count}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Data Table */}
          <div className="overflow-hidden">
            <h3 className="font-black text-slate-800 dark:text-slate-100 mb-4 px-2">Task Log Detail</h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 print:border-slate-300">
              {filteredComplaints.length === 0 ? (
                <div className="p-6 md:p-10 text-center text-slate-400 font-bold">No tasks found for the selected date range.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 print:border-slate-300 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="py-4 px-6">Sl. No.</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Priority</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200 text-sm font-semibold bg-white dark:bg-slate-900">
                    {filteredComplaints.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 print:text-black">
                        <td className="py-3 px-6 text-slate-800 dark:text-slate-100 font-bold">{index + 1}</td>
                        <td className="py-3 px-6 whitespace-nowrap text-slate-500">{item.createdAt ? item.createdAt.toDate().toLocaleDateString() : (item.date ? new Date(item.date).toLocaleDateString() : 'N/A')}</td>
                        <td className="py-3 px-6 text-slate-600 dark:text-slate-300">{item.category}</td>
                        <td className="py-3 px-6 max-w-[200px] truncate text-slate-600 dark:text-slate-300">{item.location}</td>
                        <td className="py-3 px-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider print:border print:border-slate-400 ${item.priority === "High" ? "bg-red-100 text-red-700" :
                            item.priority === "Medium" ? "bg-amber-100 text-amber-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider print:border print:border-slate-400 ${item.status === "Completed" || item.status === "Closed" ? "bg-emerald-100 text-emerald-700" :
                            item.status === "In Progress" ? "bg-sky-100 text-sky-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
