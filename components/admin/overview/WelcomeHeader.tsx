import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function WelcomeHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight mb-1">
          Operational Overview
        </h1>
        <p className="text-slate-600 dark:text-[#c7c4d7] text-sm opacity-80 font-semibold">
          Real-time facility status and maintenance intelligence
        </p>
      </div>

      <div className="flex gap-3 shrink-0 lg:hidden">
        <Link
          href="/admin/reports"
          className="flex items-center gap-2 vibrant-gradient text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-[#8083ff]/20 cursor-pointer uppercase tracking-wider"
        >
          <Icon name="download" className="text-base" />
          <span>Export Report</span>
        </Link>
      </div>
    </div>
  );
}
