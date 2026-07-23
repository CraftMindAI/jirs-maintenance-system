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
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Closed";
  date: string; // YYYY-MM-DD
  description: string;
  technicianName?: string;
  technicianEmail?: string;
};

export default function TechnicianReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfileName, setUserProfileName] = useState("Technician");
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Date Filter State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
              data.technicianName === techName
            ) {
              fetchedComplaints.push({ ...data, id: docSnap.id });
            }
          });
          
          fetchedComplaints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  // Apply Date Filter whenever data or dates change
  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredComplaints(allComplaints);
      return;
    }

    const start = new Date(startDate).getTime();
    // End date is inclusive, so we add a day minus 1 ms essentially, or just compare string dates directly since they are YYYY-MM-DD
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const endTime = end.getTime();

    const filtered = allComplaints.filter(c => {
      const cTime = new Date(c.date).getTime();
      return cTime >= start && cTime <= endTime;
    });

    setFilteredComplaints(filtered);
  }, [allComplaints, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const stats = {
    total: filteredComplaints.length,
    completed: filteredComplaints.filter(c => c.status === "Completed" || c.status === "Closed").length,
    inProgress: filteredComplaints.filter(c => c.status === "In Progress").length,
    pending: filteredComplaints.filter(c => c.status === "Assigned" || c.status === "Pending").length,
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 md:px-8 print:p-0 print:m-0 print:space-y-6">
      <title>Reports | Technician | JMMS</title>

      {/* Header & Controls (Hidden when printing) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Performance Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Filter, view, and export your maintenance activity.
          </p>
        </div>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#0f4c81] hover:bg-[#0b3d6a] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
        >
          <Icon name="print" />
          <span>Save as PDF / Print</span>
        </button>
      </div>

      {/* Report Header for Print Only (Hidden on screen) */}
      <div className="hidden print:block text-center space-y-2 border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-3xl font-black uppercase text-slate-900">JMMS Maintenance Report</h1>
        <p className="text-sm text-slate-600 font-bold">Technician: {userProfileName}</p>
        <p className="text-xs text-slate-500">
          Reporting Period: {startDate} to {endDate}
        </p>
      </div>

      {/* Date Filter Bar (Hidden when printing) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-end print:hidden">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-primary"
          />
        </div>
        <button 
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Generating report...</div>
      ) : (
        <>
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 print:grid-cols-4">
            {[
              { label: "Total Tasks", count: stats.total, color: "text-slate-700 dark:text-slate-200" },
              { label: "Completed", count: stats.completed, color: "text-emerald-600" },
              { label: "In Progress", count: stats.inProgress, color: "text-sky-600" },
              { label: "Pending Start", count: stats.pending, color: "text-amber-600" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-3xl p-5 shadow-sm text-center">
                <h3 className={`text-3xl font-black ${stat.color} mb-1`}>{stat.count}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 print:border-slate-300 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Task Log Detail</h3>
            </div>
            
            <div className="overflow-x-auto">
              {filteredComplaints.length === 0 ? (
                <div className="p-10 text-center text-slate-400">No tasks found for the selected date range.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 print:border-slate-300 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                      <th className="py-3 px-6">Date</th>
                      <th className="py-3 px-6">Ticket ID</th>
                      <th className="py-3 px-6">Category</th>
                      <th className="py-3 px-6">Location</th>
                      <th className="py-3 px-6">Priority</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200 text-sm font-semibold">
                    {filteredComplaints.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 print:text-black">
                        <td className="py-3 px-6 whitespace-nowrap text-slate-500">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="py-3 px-6 text-slate-800 dark:text-slate-100 font-bold">{item.id}</td>
                        <td className="py-3 px-6">{item.category}</td>
                        <td className="py-3 px-6 max-w-[200px] truncate">{item.location}</td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider print:border print:border-slate-400 ${
                            item.priority === "High" ? "bg-red-100 text-red-600" :
                            item.priority === "Medium" ? "bg-amber-100 text-amber-600" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider print:border print:border-slate-400 ${
                            item.status === "Completed" || item.status === "Closed" ? "bg-emerald-100 text-emerald-600" :
                            item.status === "In Progress" ? "bg-sky-100 text-sky-600" :
                            "bg-amber-100 text-amber-600"
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
        </>
      )}
    </div>
  );
}
