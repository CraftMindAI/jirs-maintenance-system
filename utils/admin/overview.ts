import { ServiceSlice } from "@/components/admin/overview/ServiceSplit";
import { RecentRequest } from "@/components/admin/overview/RecentRequestsTable";

export const RESOLVED_STATUSES = ["Completed", "Verified", "Closed", "Rejected"];
export const ASSIGNED_STATUSES = ["Assigned", "In Progress"];
export const SLICE_COLORS = ["#8083ff", "#4edea3", "#ff516a", "#908fa0"];

/** Top 3 categories by share of total complaints, with the remainder rolled into "Others". */
export function buildServiceSplit(complaints: { category: string }[]): ServiceSlice[] {
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
    const existingOthers = slices.find((slice) => slice.category === "Others");
    const othersPercent = Math.round((others / complaints.length) * 100);
    if (existingOthers) {
      existingOthers.percent += othersPercent;
    } else {
      slices.push({ category: "Others", percent: othersPercent });
    }
  }

  return slices.map((slice, idx) => ({ ...slice, color: SLICE_COLORS[idx % SLICE_COLORS.length] }));
}

/** The 5 most recently created tickets, formatted for the Recent Requests table. */
export function buildRecentRequests(
  complaints: { id: string; ticketNumber?: string; description: string; category: string; date: string; technicianName?: string; status: string }[],
): RecentRequest[] {
  const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

  return [...complaints]
    .sort(byDateDesc)
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      ticketNumber: c.ticketNumber,
      title: c.description || c.category,
      date: c.date
        ? new Date(`${c.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "-",
      technicianName: c.technicianName,
      status: c.status,
    }));
}
