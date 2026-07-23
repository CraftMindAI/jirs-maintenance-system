import type { Metadata } from "next";
import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";

export const metadata: Metadata = {
  title: "Technician Dashboard | JMMS",
};

export default function TechnicianDashboardPage() {
  return (
    <DashboardPlaceholder
      icon="engineering"
      title="Technician Dashboard"
      description="View your assigned maintenance jobs, update progress, and manage your daily task queue."
    />
  );
}
