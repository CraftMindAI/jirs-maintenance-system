"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useComplaintsFeed } from "@/hooks/useComplaintsFeed";
import type { Complaint } from "@/types/complaint";

export type { Complaint };

const ADMIN_ROLES = ["admin"];

export default function DashboardHome({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v1/${token}`;

  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    email: string;
  } | null>(null);

  // Sync auth state (role decides which complaints this user may see)
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
          setUserId(user.uid);
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Siddharth Roy",
            role: "Student",
            email: "siddharth.r@jirs.ac.in",
          });
          setUserId(user.uid);
        }
      } else {
        // Mock fallback for presentation
        setUserProfile({
          name: "Siddharth Roy",
          role: "Student",
          email: "siddharth.r@jirs.ac.in",
        });
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const isAdmin =
    !!userProfile && ADMIN_ROLES.includes(userProfile.role.toLowerCase());

  // Guests (no real uid) never fetch real data; signed-in admins see every
  // complaint, signed-in residents see only their own.
  const { complaints: visibleComplaints } = useComplaintsFeed(
    userId ? (isAdmin ? null : userId) : undefined,
  );

  const getStats = () => {
    const total = visibleComplaints.length;
    const pending = visibleComplaints.filter(
      (c) => c.status === "Pending" || c.status === "Approved",
    ).length;
    const progress = visibleComplaints.filter(
      (c) => c.status === "In Progress" || c.status === "Assigned",
    ).length;
    const completed = visibleComplaints.filter(
      (c) => c.status === "Verified",
    ).length;
    return { total, pending, progress, completed };
  };

  const stats = getStats();
  const latestComplaint =
    visibleComplaints.find(
      (c) => c.status === "In Progress" || c.status === "Pending" || c.status === "Assigned",
    ) || null;

  return (
    <div className="space-y-8 pb-12">
      <title>Dashboard | JFM</title>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: "Total Complaints",
            count: stats.total,
            icon: "assignment",
            color: "text-primary dark:text-blue-300",
            bg: "bg-primary/5 dark:bg-primary/10",
          },
          {
            label: "Pending",
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
                {stat.count}
              </h3>
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
              Recent Complaints
            </h2>
            <Link
              href={`${basePath}/my-complaints`}
              className="text-sm font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
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
                  {visibleComplaints.slice(0, 3).map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-slate-800 dark:text-slate-100 font-bold">
                        {item.id}
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === "Rejected"
                              ? "bg-red-500/15 text-red-500 border border-red-500/30"
                              : item.status === "Pending"
                                ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                                : item.status === "Assigned" || item.status === "In Progress"
                                  ? "bg-orange-500/15 text-orange-500 border border-orange-500/30"
                                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 dark:text-slate-500 text-xs">
                        {item.date}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`${basePath}/track-complaint?ticket=${item.id}`}
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
              {visibleComplaints.slice(0, 3).map((item) => (
                <div key={item.id} className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {item.id}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${item.status === "Rejected"
                          ? "bg-red-500/15 text-red-500"
                          : item.status === "Pending"
                            ? "bg-amber-500/15 text-amber-500"
                            : item.status === "Assigned" || item.status === "In Progress"
                              ? "bg-orange-500/15 text-orange-500"
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
                      {item.date}
                    </span>
                    <Link
                      href={`${basePath}/track-complaint?ticket=${item.id}`}
                      className="text-xs font-bold text-primary dark:text-blue-300"
                    >
                      Track Complaint
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Grid: Step Progress Timeline */}
        <div className="xl:col-span-4 space-y-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Icon name="timeline" className="text-primary" />
            Active Step Tracker
          </h2>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            {latestComplaint ? (
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Active Complaint
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    {latestComplaint.category} (#1)
                  </h4>
                </div>

                {/* Vertical Stepper */}
                <div className="relative pl-8 space-y-8 py-2">
                  {/* Vertical line indicator */}
                  <div className="absolute top-3 bottom-3 left-[11px] w-[2px] bg-slate-200 dark:bg-slate-800" />

                  {[
                    {
                      label: "Submitted",
                      status: "Pending",
                      desc: "Ticket received by support.",
                    },
                    {
                      label: "Approved",
                      status: "Approved",
                      desc: "Reviewed and approved by admin.",
                    },
                    {
                      label: "Assigned",
                      status: "Assigned",
                      desc: "Forwarded to specialized department.",
                    },
                    {
                      label: "In Progress",
                      status: "In Progress",
                      desc: "Technician working on-site.",
                    },
                    {
                      label: "Completed",
                      status: "Completed",
                      desc: "Work completed & logged.",
                    },
                  ].map((step, idx) => {
                    const stepOrder = [
                      "Pending",
                      "Approved",
                      "Assigned",
                      "In Progress",
                      "Completed",
                      "Verified",
                    ];
                    const currentIdx = stepOrder.indexOf(
                      latestComplaint.status,
                    );
                    const stepIdx = stepOrder.indexOf(step.status);
                    const isPassed = currentIdx >= stepIdx;

                    return (
                      <div
                        key={idx}
                        className="relative flex flex-col items-start gap-1 group"
                      >
                        <span
                          className={`absolute left-[-27px] top-[2px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isPassed
                            ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                            }`}
                        >
                          {isPassed ? (
                            <Icon
                              name="check"
                              className="text-[12px] font-black"
                            />
                          ) : (
                            idx + 1
                          )}
                        </span>
                        <div className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                          {step.label}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 pr-4 leading-normal">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                No active complaints found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
