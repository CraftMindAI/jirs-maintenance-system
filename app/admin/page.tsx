"use client";

import { useComplaintsFeed } from "@/hooks/useComplaintsFeed";
import WelcomeHeader from "@/components/admin/overview/WelcomeHeader";
import StatsCards from "@/components/admin/overview/StatsCards";
import MonthlyInsights from "@/components/admin/overview/MonthlyInsights";
import ServiceSplit from "@/components/admin/overview/ServiceSplit";
import RecentRequestsTable from "@/components/admin/overview/RecentRequestsTable";
import { buildServiceSplit, buildRecentRequests } from "@/utils/admin/overview";

export default function AdminDashboardHome() {
  const { complaints } = useComplaintsFeed(null);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    completed: complaints.filter((c) => c.status === "Verified").length,
  };

  const serviceSplit = buildServiceSplit(complaints);
  const recentRequests = buildRecentRequests(complaints);

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
        <MonthlyInsights complaintDates={complaints.map((c) => c.date)} />

        {/* Right Bento: Service Split Progress Bars (1 Col) */}
        <ServiceSplit data={serviceSplit} />

        {/* 4. RECENT MAINTENANCE REQUESTS TABLE (3 COLS) */}
        <RecentRequestsTable requests={recentRequests} totalCount={complaints.length} />
      </div>
    </div>
  );
}
