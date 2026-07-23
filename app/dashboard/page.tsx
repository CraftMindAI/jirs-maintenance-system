import type { Metadata } from "next";
import DashboardPlaceholder from "@/components/dashboard/DashboardPlaceholder";

export const metadata: Metadata = {
  title: "Dashboard | JMMS",
};

export default function DashboardPage() {
  return (
    <DashboardPlaceholder
      icon="dashboard"
      title="Welcome to your Dashboard"
      description="Track your maintenance requests, view status updates, and raise new complaints from here."
    />
  );
}
