"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export type Complaint = {
  id: string;
  category: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Assigned" | "In Progress" | "Completed" | "Verified";
  date: string;
  description: string;
  technicianName?: string;
  technicianPhone?: string;
  assignedDate?: string;
  remarks?: string;
  submittedBy?: string;
};

const ADMIN_ROLES = ["admin"];

function timeAgo(dateStr: string) {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function buildNotification(c: Complaint) {
  switch (c.status) {
    case "Assigned":
      return {
        text: `Complaint ${c.id} has been assigned to ${c.technicianName || "a technician"}.`,
        icon: "assignment_ind",
        color: "text-indigo-500",
        time: timeAgo(c.assignedDate || c.date),
      };
    case "In Progress":
      return {
        text: `Technician ${c.technicianName || "assigned staff"} has started working on ${c.id}.`,
        icon: "play_circle",
        color: "text-sky-500",
        time: timeAgo(c.assignedDate || c.date),
      };
    case "Completed":
      return {
        text: `Complaint ${c.id} has been marked as Completed.`,
        icon: "check_circle",
        color: "text-emerald-500",
        time: timeAgo(c.date),
      };
    case "Verified":
      return {
        text: `Complaint ${c.id} has been verified and closed.`,
        icon: "verified",
        color: "text-emerald-500",
        time: timeAgo(c.date),
      };
    default:
      return {
        text: `New ticket ${c.id} has been submitted successfully.`,
        icon: "add_circle",
        color: "text-primary",
        time: timeAgo(c.date),
      };
  }
}

export default function DashboardHome() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    email: string;
  } | null>(null);

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

  useEffect(() => {
    // Load local storage complaints (no mock seeding — real submissions only)
    const stored = localStorage.getItem("jmms_complaints");
    setComplaints(stored ? JSON.parse(stored) : []);
  }, []);

  const isAdmin =
    !!userProfile && ADMIN_ROLES.includes(userProfile.role.toLowerCase());

  // Admins see every complaint; students/staff only see the ones they raised
  const visibleComplaints = isAdmin
    ? complaints
    : complaints.filter((c) => c.submittedBy === userProfile?.email);

  const getStats = () => {
    const total = visibleComplaints.length;
    const pending = visibleComplaints.filter(
      (c) => c.status === "Pending",
    ).length;
    const progress = visibleComplaints.filter(
      (c) => c.status === "In Progress" || c.status === "Assigned",
    ).length;
    const completed = visibleComplaints.filter(
      (c) => c.status === "Completed" || c.status === "Verified",
    ).length;
    return { total, pending, progress, completed };
  };

  const stats = getStats();
  const latestComplaint = visibleComplaints[0] || null;

  const notifications = [...visibleComplaints]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((c, idx) => ({ id: idx, ...buildNotification(c) }));

  return (
    <div className="space-y-8 pb-12">
      <title>Dashboard | JMMS</title>

      {/* 1. GREETING CARD */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#0b1c30] to-[#0f4c81] text-white p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="text-sm font-black tracking-widest text-[#ffdcc4] uppercase">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Good Morning, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ffdcc4]">
              {userProfile?.name ?? "..."}
            </span>{" "}
            👋
          </h1>
          <p className="font-body-lg text-slate-300 italic text-sm md:text-base leading-relaxed">
            &ldquo;Efficiency and character meet where we strive to maintain
            JIRS as the pinnacle of learning sanctuary.&rdquo;
          </p>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
              href="/dashboard/my-complaints"
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            item.priority === "High"
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.status === "Pending"
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
                        {item.date}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/dashboard/track-complaint?ticket=${item.id}`}
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
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === "Pending"
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
                      {item.date}
                    </span>
                    <Link
                      href={`/dashboard/track-complaint?ticket=${item.id}`}
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
                    {latestComplaint.category} ({latestComplaint.id})
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
                          className={`absolute left-[-27px] top-[2px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                            isPassed
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

      {/* 4. NOTIFICATION CENTER ROW */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Icon name="notifications" className="text-primary" />
          Recent Notification Alerts
        </h2>
        {notifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`${n.color} bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl`}
                >
                  <Icon name={n.icon} className="text-xl" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {n.text}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {n.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-sm">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              No recent activity yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
