/**
 * Utility functions for ticket deadlines (3 days / 72 hours from assignment).
 */

export interface DeadlineInfo {
  deadlineDate: Date | null;
  formattedDeadline: string;
  isOverdue: boolean;
  timeLeftText: string;
  badgeClass: string;
}

/**
 * Calculates the deadline (3 days from assignedAt or assignedDate) and formats countdown text.
 */
export function getDeadlineInfo(
  assignedAt?: string | null,
  assignedDate?: string | null,
  status?: string
): DeadlineInfo {
  // If completed, deadline countdown is no longer ticking
  if (status === "Completed") {
    return {
      deadlineDate: null,
      formattedDeadline: "Resolved",
      isOverdue: false,
      timeLeftText: "Completed",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-[#4edea3] border border-emerald-500/20",
    };
  }

  // Deadline only starts once a technician is assigned — never fall back to the
  // ticket's raised date, or unassigned tickets would already look overdue.
  const baseDateStr = assignedAt || assignedDate;
  if (!baseDateStr) {
    return {
      deadlineDate: null,
      formattedDeadline: "Not Assigned",
      isOverdue: false,
      timeLeftText: "No deadline",
      badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
    };
  }

  const baseDate = new Date(baseDateStr);
  if (isNaN(baseDate.getTime())) {
    return {
      deadlineDate: null,
      formattedDeadline: "Invalid Date",
      isOverdue: false,
      timeLeftText: "No deadline",
      badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
    };
  }

  // 3 days (72 hours) deadline from assignment
  const deadlineDate = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();

  const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMs <= 0) {
    const overdueMs = Math.abs(diffMs);
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueDays = Math.floor(overdueHours / 24);
    const remainingHours = overdueHours % 24;

    const overdueStr =
      overdueDays > 0
        ? `${overdueDays}d ${remainingHours}h overdue`
        : `${overdueHours}h overdue`;

    return {
      deadlineDate,
      formattedDeadline,
      isOverdue: true,
      timeLeftText: overdueStr,
      badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold",
    };
  }

  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
  const daysLeft = Math.floor(hoursLeft / 24);
  const remHours = hoursLeft % 24;

  const timeLeftText =
    daysLeft > 0 ? `${daysLeft}d ${remHours}h left` : `${hoursLeft}h left`;

  const badgeClass =
    daysLeft < 1
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold"
      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";

  return {
    deadlineDate,
    formattedDeadline,
    isOverdue: false,
    timeLeftText,
    badgeClass,
  };
}
