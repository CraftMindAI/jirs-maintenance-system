"use client";

import { use, useEffect, useState } from "react";
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
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Closed" | "Approved" | "Verified" | "Rejected";
  date: string;
  description: string;
  technicianName?: string;
  technicianEmail?: string;
};

export default function TechnicianDashboardHome({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v2/${token}`;

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
            const data = docSnap.data() as any;
            let formattedDate = data.date;
            if (!formattedDate) {
              const createdAt = data.createdAt;
              if (createdAt && typeof createdAt.toDate === 'function') {
                formattedDate = createdAt.toDate().toISOString().split("T")[0];
              } else {
                formattedDate = new Date().toISOString().split("T")[0];
              }
            }

            if (
              data.technicianId === currentUser.uid ||
              data.technicianEmail === currentUser.email ||
              data.technicianName === techName
            ) {
              fetchedComplaints.push({ ...data, id: docSnap.id, date: formattedDate });
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
    const pending = complaints.filter((c) => c.status === "Assigned" || c.status === "Pending" || c.status === "Approved").length;
    const progress = complaints.filter((c) => c.status === "In Progress").length;
    const completed = complaints.filter((c) => c.status === "Completed" || c.status === "Closed" || c.status === "Verified").length;
    return { total, pending, progress, completed };
  };

  const stats = getStats();
  const latestComplaint = complaints[0] || null;

  return (
    <div className="space-y-8 pb-12">
      <title>Dashboard | Technician | JFM</title>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: "Total Tasks",
            count: stats.total,
            icon: "assignment",
            color: "text-primary dark:text-blue-300",
            bg: "bg-primary/5 dark:bg-primary/10",
          },
          {
            label: "Pending Start",
            count: stats.pending,
            icon: "pending",
            color: "text-amber-500",
            bg: "bg-amber-500/5 dark:bg-amber-500/10",
          },
          {
            label: "In Progress",
            count: stats.progress,
            icon: "play_circle",
            color: "text-sky-500",
            bg: "bg-sky-500/5 dark:bg-sky-500/10",
          },
          {
            label: "Completed",
            count: stats.completed,
            icon: "check_circle",
            color: "text-emerald-500",
            bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <div
                className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}
              >
                <Icon name={stat.icon} className="text-2xl" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <Icon name="trending_up" className="text-xs mr-1" /> Stable
              </span>
            </div>
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {stat.label}
              </span>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                {loading ? "-" : stat.count}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE GRID: RECENT TICKETS & PROGRESS TIMELINE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Grid: Recent Tickets Feed */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Icon name="list_alt" className="text-primary" />
              Recent Assignments
            </h2>
            <Link
              href={`${basePath}/view-complaints`}
              className="text-sm font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-6 md:p-10 text-center text-slate-400 font-bold animate-pulse">Loading assignments...</div>
            ) : complaints.length === 0 ? (
              <div className="p-6 md:p-10 text-center text-slate-400">No recent assignments found.</div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                        <th className="py-4 px-6">SI.NO</th>
                        <th className="py-4 px-6">Type</th>
                        <th className="py-4 px-6">Priority</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                      {complaints.slice(0, 3).map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-4 px-6 text-slate-800 dark:text-slate-100 font-bold">
                            {index + 1}
                          </td>
                          <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                            {item.category}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.priority === "High"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : item.priority === "Medium"
                                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                  : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                                }`}
                            >
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === "Pending"
                                ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                : item.status === "Assigned"
                                  ? "bg-indigo-500/15 text-indigo-500 border border-indigo-500/30"
                                  : item.status === "In Progress"
                                    ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400 dark:text-slate-500 text-xs">
                            {item.date || "N/A"}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Link
                              href={`${basePath}/view-complaints/${item.id}`}
                              className="text-primary dark:text-blue-300 hover:text-opacity-80 transition-opacity"
                            >
                              Track
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List View */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                  {complaints.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          #{index + 1}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.status === "Pending"
                            ? "bg-amber-500/15 text-amber-500"
                            : item.status === "Assigned"
                              ? "bg-indigo-500/15 text-indigo-500"
                              : item.status === "In Progress"
                                ? "bg-sky-500/15 text-sky-500"
                                : "bg-emerald-500/15 text-emerald-400"
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        <div className="font-bold">{item.category}</div>
                        <div className="mt-1 line-clamp-1">{item.description}</div>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-slate-400">
                          {item.date || "N/A"}
                        </span>
                        <Link
                          href={`${basePath}/view-complaints/${item.id}`}
                          className="text-xs font-bold text-primary dark:text-blue-300"
                        >
                          Track Complaint
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
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">{latestComplaint.category} </h4>
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

                <Link href={`${basePath}/view-complaints/${latestComplaint.id}`} className="block w-full py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold text-center shadow-lg shadow-primary/20 transition-all text-sm cursor-pointer">
                  Go to task
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">You have no tasks assigned currently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
