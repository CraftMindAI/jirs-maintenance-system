import Link from "next/link";

export default function ServiceSplit() {
  return (
    <div className="bg-[#171f33] p-8 rounded-3xl border border-[#464554]/10 flex flex-col justify-between vibrant-shadow">
      <div>
        <h3 className="font-display text-2xl font-bold text-[#dae2fd] mb-6">Service Split</h3>
        <div className="space-y-6">
          {/* Category 1 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-[#dae2fd]">
                <span className="w-2 h-2 bg-[#8083ff] rounded-full" /> Electrical
              </span>
              <span className="text-[#dae2fd]">42%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2.5 rounded-full overflow-hidden">
              <div className="vibrant-gradient h-full w-[42%] shadow-md shadow-[#8083ff]/40" />
            </div>
          </div>

          {/* Category 2 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-[#dae2fd]">
                <span className="w-2 h-2 bg-[#4edea3] rounded-full" /> Plumbing
              </span>
              <span className="text-[#dae2fd]">28%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#4edea3] h-full w-[28%]" />
            </div>
          </div>

          {/* Category 3 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-[#dae2fd]">
                <span className="w-2 h-2 bg-[#ff516a] rounded-full" /> HVAC
              </span>
              <span className="text-[#dae2fd]">15%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#ff516a] h-full w-[15%]" />
            </div>
          </div>

          {/* Category 4 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="flex items-center gap-2 text-[#dae2fd]">
                <span className="w-2 h-2 bg-[#908fa0] rounded-full" /> Others
              </span>
              <span className="text-[#dae2fd]">15%</span>
            </div>
            <div className="w-full bg-[#131b2e] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#908fa0]/50 h-full w-[15%]" />
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/admin/reports"
        className="w-full mt-8 py-3.5 bg-[#222a3d] text-[#c0c1ff] font-extrabold rounded-2xl hover:bg-[#2d3449] transition-all text-xs uppercase tracking-widest border border-[#c0c1ff]/20 text-center block"
      >
        Detailed Analytics
      </Link>
    </div>
  );
}
