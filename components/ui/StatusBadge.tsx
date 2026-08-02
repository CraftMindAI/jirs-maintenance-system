const STATUS_STYLES: Record<string, string> = {
  Unassigned: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
  Pending: "bg-[#ff516a]/10 text-[#ffb2b7] border border-[#ff516a]/20",
  Approved: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
  Assigned: "bg-[#8083ff]/10 text-[#c0c1ff] border border-[#8083ff]/20",
  "In Progress": "bg-[#00a572]/10 text-[#4edea3] border border-[#00a572]/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Verified: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Rejected: "bg-[#ff516a]/20 text-[#ff516a] border border-[#ff516a]/40",
};
const DEFAULT_STATUS_STYLE = "bg-[#908fa0]/15 text-[#908fa0] border border-[#908fa0]/20";

export function getStatusBadgeClass(status: string) {
  return STATUS_STYLES[status] || DEFAULT_STATUS_STYLE;
}

export default function StatusBadge({
  status,
  className = "px-2.5 py-0.5 text-[10px]",
}: Readonly<{ status: string; className?: string }>) {
  return (
    <span className={`inline-flex items-center rounded-full font-extrabold uppercase tracking-wider ${getStatusBadgeClass(status)} ${className}`}>
      {status}
    </span>
  );
}
