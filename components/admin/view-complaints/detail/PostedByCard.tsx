"use client";

import Icon from "@/components/ui/Icon";
import { ComplaintPoster } from "@/hooks/useComplaintDetail";

export default function PostedByCard({ poster }: { poster: ComplaintPoster | null }) {
  if (!poster) return null;

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm dark:vibrant-shadow space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#464554]/10 pb-3">
        <div className="flex items-center gap-2">
          <Icon name="person" className="text-primary dark:text-[#8083ff] text-xl" />
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-[#dae2fd]">Posted By</h3>
        </div>
        {poster.role && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 dark:bg-[#8083ff]/15 text-primary dark:text-[#c0c1ff] border border-primary/20 dark:border-[#8083ff]/20">
            {poster.role}
          </span>
        )}
      </div>

      <div className="flex items-start gap-4 pt-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 dark:from-[#8083ff]/20 dark:to-[#00a572]/20 border border-primary/30 dark:border-[#8083ff]/30 flex items-center justify-center text-slate-800 dark:text-[#dae2fd] font-bold text-lg shrink-0 uppercase">
          {poster.name ? poster.name.charAt(0) : "U"}
        </div>
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] truncate">
            {poster.name}
          </div>

          {poster.email && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#908fa0] truncate">
              <Icon name="mail" className="text-sm text-primary dark:text-[#8083ff] shrink-0" />
              <span className="truncate">{poster.email}</span>
            </div>
          )}

          {poster.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#908fa0] truncate">
              <Icon name="phone" className="text-sm text-emerald-600 dark:text-[#00a572] shrink-0" />
              <span>{poster.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
