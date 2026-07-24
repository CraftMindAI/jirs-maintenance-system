"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function BackToComplaintsButton() {
  return (
    <Link
      href="/admin/view-complaints"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#464554]/30 bg-transparent text-slate-800 dark:text-[#dae2fd] hover:bg-primary/10 dark:hover:bg-[#8083ff]/10 hover:border-primary/40 dark:hover:border-[#8083ff]/40 text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm group"
    >
      <Icon
        name="arrow_back"
        className="text-base text-slate-400 dark:text-[#908fa0] group-hover:text-primary dark:group-hover:text-[#c0c1ff] group-hover:-translate-x-0.5 transition-transform"
      />
      <span>Back to Complaints</span>
    </Link>
  );
}
