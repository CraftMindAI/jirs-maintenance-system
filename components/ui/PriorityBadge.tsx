const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-[#ff516a]/15 text-[#ffb2b7] border border-[#ff516a]/20",
  Medium: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  Low: "bg-[#908fa0]/15 text-[#908fa0] border border-[#908fa0]/20",
};

export function getPriorityBadgeClass(priority: string) {
  return PRIORITY_STYLES[priority] || PRIORITY_STYLES.Low;
}

export default function PriorityBadge({
  priority,
  className = "px-2.5 py-0.5 text-[10px]",
}: Readonly<{ priority: string; className?: string }>) {
  return (
    <span className={`inline-flex items-center rounded-full font-bold ${getPriorityBadgeClass(priority)} ${className}`}>
      {priority}
    </span>
  );
}
