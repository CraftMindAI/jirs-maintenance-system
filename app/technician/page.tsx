"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  date: string;
  description: string;
  technicianName?: string;
  technicianEmail?: string;
};

const NOTIFICATIONS = [
  { id: 1, text: "Welcome to your new Technician Dashboard.", time: "Just now", icon: "engineering", color: "text-primary" },
  { id: 2, text: "Ensure all 'In Progress' tasks are updated before EOD.", time: "2 hours ago", icon: "info", color: "text-sky-500" },
];

export default function TechnicianDashboardHome() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfileName, setUserProfileName] = useState("Technician");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

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
          setComplaints(fetchedComplaints);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching complaints:", error);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setComplaints([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const getStats = () => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Assigned").length; // Assigned to tech but not started
    const progress = complaints.filter((c) => c.status === "In Progress").length;
    const completed = complaints.filter((c) => c.status === "Completed" || c.status === "Closed").length;
    return { total, pending, progress, completed };
  };

  const stats = getStats();
  const latestComplaint = complaints[0] || null;

  return (
      <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 md:px-8">
        <title>Dashboard | Technician | JMMS</title>

        {/* 1. GREETING CARD */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#0b1c30] to-[#0f4c81] text-white p-8 md:p-10 shadow-xl mt-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="text-sm font-black tracking-widest text-[#ffdcc4] uppercase">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Good Morning, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ffdcc4]">
                {userProfileName}
              </span> 👋
            </h1>
            <p className="font-body-lg text-slate-300 italic text-sm md:text-base leading-relaxed">
              &ldquo;Your expertise keeps the sanctuary running efficiently. Stay safe out there today.&rdquo;
            </p>
          </div>
        </div>

        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Assigned Tasks", count: stats.total, icon: "assignment", color: "text-primary dark:text-blue-300", bg: "bg-primary/5 dark:bg-primary/10" },
            { label: "Pending Start", count: stats.pending, icon: "pending", color: "text-amber-500", bg: "bg-amber-500/5 dark:bg-amber-500/10" },
            { label: "In Progress", count: stats.progress, icon: "play_circle", color: "text-sky-500", bg: "bg-sky-500/5 dark:bg-sky-500/10" },
            { label: "Completed", count: stats.completed, icon: "check_circle", color: "text-emerald-500", bg: "bg-emerald-500/5 dark:bg-emerald-500/10" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                  <Icon name={stat.icon} className="text-2xl" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <Icon name="trending_up" className="text-xs mr-1" /> Stable
                </span>
              </div>
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{loading ? "-" : stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* 3. MIDDLE GRID: RECENT TICKETS & PROGRESS TIMELINE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Grid: Recent Tickets Feed */}
          <div className="xl:col-span-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Icon name="list_alt" className="text-primary" />
                Recent Assignments
              </h2>
              <Link href="/technician/view-complaints" className="text-sm font-bold text-primary hover:underline">
                View All
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Loading assignments...</div>
              ) : complaints.length === 0 ? (
                <div className="p-10 text-center text-slate-400">No recent assignments found.</div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                          <th className="py-4 px-6">Ticket ID</th>
                          <th className="py-4 px-6">Type</th>
                          <th className="py-4 px-6">Priority</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Date</th>
                          <th className="py-4 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                        {complaints.slice(0, 4).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-6 text-slate-800 dark:text-slate-100 font-bold">{item.id}</td>
                            <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{item.category}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                item.priority === "High"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : item.priority === "Medium"
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                  : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                              }`}>
                                {item.priority}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                item.status === "Pending"
                                  ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                  : item.status === "Assigned"
                                  ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/30"
                                  : item.status === "In Progress"
                                  ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-400 dark:text-slate-500 text-xs">{new Date(item.date).toLocaleDateString()}</td>
                            <td className="py-4 px-6 text-right">
                              <Link href="/technician/view-complaints" className="text-primary dark:text-blue-300 hover:text-opacity-80 transition-opacity">
                                Update
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {complaints.slice(0, 4).map((item) => (
                      <div key={item.id} className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.id}</span>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.status === "Pending" ? "bg-amber-500/15 text-amber-500" :
                            item.status === "Assigned" ? "bg-indigo-500/15 text-indigo-500" :
                            item.status === "In Progress" ? "bg-sky-500/15 text-sky-500" :
                            "bg-emerald-500/15 text-emerald-400"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <div className="font-bold">{item.category}</div>
                          <div className="mt-1 line-clamp-1">{item.description}</div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                          <Link href="/technician/view-complaints" className="text-xs font-bold text-primary dark:text-blue-300">
                            Update Complaint
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Grid: Most Recent Task Focus */}
          <div className="xl:col-span-4 space-y-6">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Icon name="engineering" className="text-primary" />
              Latest Task Focus
            </h2>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              {latestComplaint ? (
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Priority</div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">{latestComplaint.category} ({latestComplaint.id})</h4>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Location</div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{latestComplaint.location}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Issue Description</div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-3">{latestComplaint.description || "No description provided."}</div>
                    </div>
                  </div>

                  <Link href="/technician/view-complaints" className="block w-full py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold text-center shadow-lg shadow-primary/20 transition-all text-sm cursor-pointer">
                    Go to task
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">You have no tasks assigned currently.</p>
              )}
            </div>
          </div>

        </div>

        {/* 4. NOTIFICATION CENTER ROW */}
        <div className="space-y-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Icon name="notifications" className="text-primary" />
            Recent Notification Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className={`${n.color} bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl`}>
                  <Icon name={n.icon} className="text-xl" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{n.text}</p>
                  <span className="text-[10px] text-slate-400 font-semibold block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
  );
}
