"use client";

import { useEffect, useState } from "react";
import { Complaint } from "../dashboard/page";
import WelcomeHeader from "@/components/admin/overview/WelcomeHeader";
import StatsCards from "@/components/admin/overview/StatsCards";
import MonthlyInsights from "@/components/admin/overview/MonthlyInsights";
import ServiceSplit from "@/components/admin/overview/ServiceSplit";
import RecentRequestsTable from "@/components/admin/overview/RecentRequestsTable";

export default function AdminDashboardHome() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("jmms_complaints");
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, []);

  const getStats = () => {
    const total = complaints.length ? 1248 + complaints.length : 1248;
    const pending = complaints.filter(c => c.status === "Pending").length || 42;
    const assigned = complaints.filter(c => c.status === "Assigned" || c.status === "In Progress").length || 156;
    const resolved = complaints.filter(c => c.status === "Completed" || c.status === "Verified").length || 1050;
    return { total, pending, assigned, resolved };
  };

  const stats = getStats();

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
        <MonthlyInsights />

        {/* Right Bento: Service Split Progress Bars (1 Col) */}
        <ServiceSplit />

        {/* 4. RECENT MAINTENANCE REQUESTS TABLE (3 COLS) */}
        <RecentRequestsTable />
      </div>
    </div>
  );
}
