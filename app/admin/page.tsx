"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Complaint } from "../dashboard/page";

export default function AdminDashboardHome() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [userProfile] = useState({ name: "Admin Principal", role: "Admin" });

  useEffect(() => {
    const stored = localStorage.getItem("jmms_complaints");
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, []);

  const getStats = () => {
    const total = complaints.length;
    const active = complaints.filter(c => c.status !== "Completed" && c.status !== "Verified").length;
    const progress = complaints.filter(c => c.status === "In Progress").length;
    const closed = complaints.filter(c => c.status === "Completed" || c.status === "Verified").length;
    return { total, active, progress, closed };
  };

  const stats = getStats();

  return (
    <div className="space-y-8 pb-12">
      <title>Admin Dashboard | JMMS</title>

      {/* Welcome administrator section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[#0b1c30] to-[#0f4c81] text-white p-8 md:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="text-sm font-black tracking-widest text-[#ffdcc4] uppercase">
              System Overview • Admin Console
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ffdcc4]">
                {userProfile.name}
              </span>
            </h1>
            <p className="font-body-md text-slate-300 italic text-xs md:text-sm">
              Current campus status: **All services normal**. Plumber, electrical, and carpentry divisions active.
            </p>
          </div>

          <Link
            href="/admin/reports"
            className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 text-[#ffdcc4] px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-sm shrink-0 cursor-pointer shadow-lg"
          >
            <Icon name="picture_as_pdf" className="text-xl" />
            Generate Report
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Complaints", count: stats.total, change: "+12.4%", icon: "assignment", color: "text-primary dark:text-blue-300", bg: "bg-primary/5 dark:bg-primary/10" },
          { label: "Active Complaints", count: stats.active, change: "-4.2%", icon: "pending", color: "text-amber-500", bg: "bg-amber-500/5 dark:bg-amber-500/10" },
          { label: "In Progress", count: stats.progress, change: "+8.1%", icon: "play_circle", color: "text-sky-500", bg: "bg-sky-500/5 dark:bg-sky-500/10" },
          { label: "Closed Complaints", count: stats.closed, change: "+16.8%", icon: "check_circle", color: "text-emerald-500", bg: "bg-emerald-500/5 dark:bg-emerald-500/10" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                <Icon name={stat.icon} className="text-2xl" />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-6 flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{stat.label}</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.count}</h3>
              </div>
              {/* Small mock graph */}
              <div className="w-16 h-8 text-primary">
                <svg viewBox="0 0 100 50" className="w-full h-full stroke-current fill-none stroke-[3] stroke-linecap-round">
                  <path d="M 0 40 Q 25 10 50 30 T 100 10" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ANALYTICS GRAPHS SECTION */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Icon name="analytics" className="text-primary" />
          Campus Analytics Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Status Distribution Pie */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">Status Distribution</h4>
            <div className="h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2c7be5" strokeWidth="15" strokeDasharray="140 251" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ffc107" strokeWidth="15" strokeDasharray="70 251" strokeDashoffset="-140" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#28a745" strokeWidth="15" strokeDasharray="41 251" strokeDashoffset="-210" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-500">
              <div><span className="inline-block w-2.5 h-2.5 rounded bg-blue-500 mr-1.5" />Closed</div>
              <div><span className="inline-block w-2.5 h-2.5 rounded bg-amber-500 mr-1.5" />Pending</div>
              <div><span className="inline-block w-2.5 h-2.5 rounded bg-emerald-500 mr-1.5" />Active</div>
            </div>
          </div>

          {/* Chart 2: Monthly Trends Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">Monthly Ticket Trends</h4>
            <div className="h-44 flex items-end justify-between px-2 pt-4">
              {[30, 45, 60, 25, 80, 55, 95].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 w-6">
                  <div className="w-full bg-gradient-to-t from-primary to-blue-450 rounded-lg" style={{ height: `${val * 1.2}px` }} />
                  <span className="text-[10px] text-slate-400 font-bold">M{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Complaint Categories Doughnut */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">Complaint Categories</h4>
            <div className="h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#0f4c81" strokeWidth="10" strokeDasharray="100 220" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#2c7be5" strokeWidth="10" strokeDasharray="60 220" strokeDashoffset="-100" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#28a745" strokeWidth="10" strokeDasharray="40 220" strokeDashoffset="-160" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="#ffc107" strokeWidth="10" strokeDasharray="20 220" strokeDashoffset="-200" />
              </svg>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-500 text-center">
              <div>Elec</div>
              <div>Plumb</div>
              <div>Civil</div>
              <div>HVAC</div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. RECENT COMPLAINTS TABLE */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Icon name="list_alt" className="text-primary" />
            Recent Logged Tickets
          </h2>
          <Link href="/admin/view-complaints" className="text-sm font-bold text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {complaints.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-black uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-4 px-6">Ticket ID</th>
                    <th className="py-4 px-6">Complaint Type</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Priority</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-sm">
                  {complaints.slice(0, 3).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 text-slate-800 dark:text-slate-100 font-bold">{item.id}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{item.category}</td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs">{item.location}</td>
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
                        <Link href={`/admin/view-complaints?ticket=${item.id}`} className="text-primary dark:text-blue-300 hover:text-opacity-80 transition-opacity">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-16">No complaints logged yet.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}
