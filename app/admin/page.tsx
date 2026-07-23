"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import WelcomeHeader from "@/components/admin/overview/WelcomeHeader";
import StatsCards from "@/components/admin/overview/StatsCards";
import MonthlyInsights, { MonthlyBar } from "@/components/admin/overview/MonthlyInsights";
import ServiceSplit, { ServiceSlice } from "@/components/admin/overview/ServiceSplit";
import RecentRequestsTable, { RecentRequest } from "@/components/admin/overview/RecentRequestsTable";

const RESOLVED_STATUSES = ["Completed", "Verified"];
const ASSIGNED_STATUSES = ["Assigned", "In Progress"];

const SLICE_COLORS = ["#8083ff", "#4edea3", "#ff516a", "#908fa0"];

type ComplaintDoc = {
  id: string;
  category: string;
  location: string;
  description: string;
  priority: string;
  status: string;
  technicianName?: string;
  createdAt?: Timestamp;
};

export default function AdminDashboardHome() {
  const [complaints, setComplaints] = useState<ComplaintDoc[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "complaints"),
      (snapshot) => {
        const list: ComplaintDoc[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            category: data.category || "Uncategorized",
            location: data.location || "-",
            description: data.description || "",
            priority: data.priority || "Medium",
            status: data.status || "Pending",
            technicianName: data.technicianName,
            createdAt: data.createdAt as Timestamp | undefined,
          };
        });
        setComplaints(list);
      },
      (error) => console.error("Error fetching complaints:", error),
    );

    return () => unsubscribe();
  }, []);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    assigned: complaints.filter((c) => ASSIGNED_STATUSES.includes(c.status)).length,
    resolved: complaints.filter((c) => RESOLVED_STATUSES.includes(c.status)).length,
  };

  // Monthly Insights: complaint volume for each of the last 5 months.
  const monthlyBars: MonthlyBar[] = (() => {
    const now = new Date();
    const months: { key: string; label: string; count: number }[] = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("default", { month: "short" }),
        count: 0,
      });
    }
    complaints.forEach((c) => {
      if (!c.createdAt) return;
      const d = c.createdAt.toDate();
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = months.find((m) => m.key === key);
      if (bucket) bucket.count += 1;
    });
    const maxCount = Math.max(...months.map((m) => m.count), 1);
    return months.map((m) => ({
      label: m.label,
      count: m.count,
      heightPercent: Math.round((m.count / maxCount) * 100),
    }));
  })();

  // Service Split: top 3 categories by share, the rest rolled into "Others".
  const serviceSplit: ServiceSlice[] = (() => {
    if (complaints.length === 0) return [];
    const categoryMap = new Map<string, number>();
    complaints.forEach((c) => {
      categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
    });
    const sorted = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 3);
    const others = sorted.slice(3).reduce((sum, [, count]) => sum + count, 0);

    const slices = top.map(([category, count]) => ({
      category,
      percent: Math.round((count / complaints.length) * 100),
    }));
    if (others > 0) {
      slices.push({ category: "Others", percent: Math.round((others / complaints.length) * 100) });
    }
    return slices.map((slice, idx) => ({ ...slice, color: SLICE_COLORS[idx % SLICE_COLORS.length] }));
  })();

  // Recent Requests: latest 5 tickets.
  const recentRequests: RecentRequest[] = [...complaints]
    .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      title: c.description || c.category,
      date: c.createdAt ? c.createdAt.toDate().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "-",
      technicianName: c.technicianName,
      status: c.status,
    }));

  return (
    <div className="space-y-8 pb-12">
      <title>Operational Overview | JMMS Admin</title>

      {/* 1. WELCOME HEADER */}
      <WelcomeHeader />

      {/* 2. STATS CARDS ROW */}
      <StatsCards stats={stats} />

      {/* 3. BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Bento: Monthly Insights (2 Cols) */}
        <MonthlyInsights data={monthlyBars} />

        {/* Right Bento: Service Split Progress Bars (1 Col) */}
        <ServiceSplit data={serviceSplit} />

        {/* 4. RECENT MAINTENANCE REQUESTS TABLE (3 COLS) */}
        <RecentRequestsTable requests={recentRequests} totalCount={complaints.length} />
      </div>
    </div>
  );
}
