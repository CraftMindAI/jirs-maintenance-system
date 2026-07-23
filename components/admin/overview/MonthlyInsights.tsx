import Icon from "@/components/ui/Icon";

export default function MonthlyInsights() {
  return (
    <div className="lg:col-span-2 bg-[#171f33] p-8 rounded-3xl border border-[#464554]/10 flex flex-col min-h-[440px] vibrant-shadow">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-display text-2xl font-bold text-[#dae2fd]">Monthly Insights</h3>
          <p className="text-[#908fa0] text-xs font-semibold mt-0.5">Complaint volume over the last quarter</p>
        </div>
        <div className="flex bg-[#131b2e] p-1 rounded-lg border border-[#464554]/20">
          <button className="px-4 py-1.5 bg-[#8083ff] text-white rounded-md text-xs font-bold">Month</button>
          <button className="px-4 py-1.5 text-[#c7c4d7] text-xs font-bold hover:text-white">Week</button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#131b2e]/50 rounded-2xl flex items-center justify-center overflow-hidden border border-[#464554]/10">
        <div className="z-10 text-center bg-[#0b1326]/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-[#464554]/20">
          <Icon name="insights" className="text-[#c0c1ff] text-3xl mb-1 inline-block" />
          <p className="text-[#dae2fd] font-bold text-xs tracking-wide">Live Trends Active</p>
          <div className="mt-1 flex justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse delay-75" />
            <span className="w-1.5 h-1.5 bg-[#4edea3] rounded-full animate-pulse delay-150" />
          </div>
        </div>

        {/* Custom Bar Chart Visualization */}
        <div className="absolute bottom-10 left-8 right-8 flex items-end justify-between h-52 px-6">
          {[
            { label: "Aug", val: 45, count: "210", bg: "bg-[#8083ff]/20 hover:bg-[#8083ff]/40" },
            { label: "Sep", val: 65, count: "290", bg: "bg-[#8083ff]/30 hover:bg-[#8083ff]/50" },
            { label: "Oct", val: 95, count: "420", bg: "vibrant-gradient hover:brightness-110 shadow-lg shadow-[#8083ff]/30" },
            { label: "Nov", val: 75, count: "340", bg: "bg-[#8083ff]/40 hover:bg-[#8083ff]/60" },
            { label: "Dec", val: 55, count: "260", bg: "bg-[#8083ff]/20 hover:bg-[#8083ff]/40" },
          ].map((bar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 w-12 group cursor-pointer relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#2d3449] text-white px-2 py-0.5 rounded text-[10px] font-bold transition-opacity whitespace-nowrap z-20">
                {bar.label}: {bar.count}
              </div>
              <div className={`w-full ${bar.bg} rounded-t-xl transition-all duration-300`} style={{ height: `${bar.val * 1.8}px` }} />
              <span className="text-[10px] font-mono uppercase text-[#908fa0]">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
