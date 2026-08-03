import Icon from "@/components/ui/Icon";

type Stats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  const cardStyle =
    "bg-white dark:bg-[#171f33] p-6 rounded-2xl border border-slate-200 dark:border-[#464554]/10 flex items-center gap-5 group hover:bg-slate-50 dark:hover:bg-[#222a3d] transition-all shadow-md dark:vibrant-shadow";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stat 1: Total Complaints */}
      <div className={cardStyle}>
        <div className="w-14 h-14 bg-indigo-500/10 dark:bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-primary dark:text-[#c0c1ff] group-hover:scale-110 transition-transform">
          <Icon name="analytics" className="text-3xl" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">
            Total Complaints
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-[#dae2fd]">{stats.total.toLocaleString()}</h3>
        </div>
      </div>

      {/* Stat 2: Pending Start */}
      <div className={cardStyle}>
        <div className="w-14 h-14 bg-rose-500/10 dark:bg-[#ff516a]/10 rounded-2xl flex items-center justify-center text-rose-600 dark:text-[#ffb2b7] group-hover:scale-110 transition-transform">
          <Icon name="pending_actions" className="text-3xl" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">
            Pending Start
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-[#dae2fd]">{stats.pending}</h3>
        </div>
      </div>

      {/* Stat 3: In Progress */}
      <div className={cardStyle}>
        <div className="w-14 h-14 bg-emerald-500/10 dark:bg-[#00a572]/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-[#4edea3] group-hover:scale-110 transition-transform">
          <Icon name="engineering" className="text-3xl" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">
            In Progress
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-[#dae2fd]">{stats.inProgress}</h3>
        </div>
      </div>

      {/* Stat 4: Completed */}
      <div className={cardStyle}>
        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
          <Icon name="check_circle" className="text-3xl" />
        </div>
        <div>
          <p className="text-slate-500 dark:text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">
            Completed
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-[#dae2fd]">{stats.completed.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}
