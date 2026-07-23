import type { Metadata } from "next";
import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";

export const metadata: Metadata = {
  title: "Admin Dashboard | JMMS",
};

export default function AdminDashboardPage() {
  return (
    <DashboardPlaceholder
      icon="admin_panel_settings"
      title="Admin Dashboard"
      description="Oversee all maintenance requests, manage technicians and staff, and monitor campus-wide facility operations."
    />
  );
}
