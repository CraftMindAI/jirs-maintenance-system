import Icon from "@/components/ui/Icon";

type Stats = {
  total: number;
  pending: number;
  assigned: number;
  resolved: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stat 1: Total Complaints */}
      <div className="bg-[#171f33] p-6 rounded-2xl border border-[#464554]/10 flex items-center gap-5 group hover:bg-[#222a3d] transition-all vibrant-shadow">
        <div className="w-14 h-14 bg-[#8083ff]/10 rounded-2xl flex items-center justify-center text-[#c0c1ff] group-hover:scale-110 transition-transform">
          <Icon name="analytics" className="text-3xl" />
        </div>
        <div>
          <p className="text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">Total Complaints</p>
          <h3 className="text-3xl font-black text-[#dae2fd]">{stats.total.toLocaleString()}</h3>
        </div>
      </div>

      {/* Stat 2: Pending */}
      <div className="bg-[#171f33] p-6 rounded-2xl border border-[#464554]/10 flex items-center gap-5 group hover:bg-[#222a3d] transition-all vibrant-shadow">
        <div className="w-14 h-14 bg-[#ff516a]/10 rounded-2xl flex items-center justify-center text-[#ffb2b7] group-hover:scale-110 transition-transform">
          <Icon name="pending_actions" className="text-3xl" />
        </div>
        <div>
          <p className="text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">Pending</p>
          <h3 className="text-3xl font-black text-[#dae2fd]">{stats.pending}</h3>
        </div>
      </div>

      {/* Stat 3: Assigned */}
      <div className="bg-[#171f33] p-6 rounded-2xl border border-[#464554]/10 flex items-center gap-5 group hover:bg-[#222a3d] transition-all vibrant-shadow">
        <div className="w-14 h-14 bg-[#00a572]/10 rounded-2xl flex items-center justify-center text-[#4edea3] group-hover:scale-110 transition-transform">
          <Icon name="engineering" className="text-3xl" />
        </div>
        <div>
          <p className="text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">Assigned</p>
          <h3 className="text-3xl font-black text-[#dae2fd]">{stats.assigned}</h3>
        </div>
      </div>

      {/* Stat 4: Resolved */}
      <div className="bg-[#171f33] p-6 rounded-2xl border border-[#464554]/10 flex items-center gap-5 group hover:bg-[#222a3d] transition-all vibrant-shadow">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <Icon name="check_circle" className="text-3xl" />
        </div>
        <div>
          <p className="text-[#908fa0] font-mono uppercase tracking-widest text-[11px] mb-1 font-bold">Resolved</p>
          <h3 className="text-3xl font-black text-[#dae2fd]">{stats.resolved.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}
