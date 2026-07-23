import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function RecentRequestsTable() {
  return (
    <div className="lg:col-span-3 bg-[#171f33] rounded-3xl border border-[#464554]/10 overflow-hidden vibrant-shadow">
      <div className="p-6 md:p-8 border-b border-[#464554]/10 flex justify-between items-center bg-[#131b2e]/30">
        <div>
          <h3 className="font-display text-2xl font-bold text-[#dae2fd]">Recent Maintenance Requests</h3>
          <p className="text-[#908fa0] text-xs font-semibold mt-1">Live feed of reported issues across campus</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/view-complaints" className="w-10 h-10 rounded-xl bg-[#222a3d] flex items-center justify-center hover:text-[#c0c1ff] transition-colors border border-[#464554]/20 text-[#c7c4d7]">
            <Icon name="search" className="text-lg" />
          </Link>
          <Link href="/admin/view-complaints" className="w-10 h-10 rounded-xl bg-[#222a3d] flex items-center justify-center hover:text-[#c0c1ff] transition-colors border border-[#464554]/20 text-[#c7c4d7]">
            <Icon name="tune" className="text-lg" />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#131b2e]/50">
              <th className="px-8 py-4 font-mono text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Request ID</th>
              <th className="px-8 py-4 font-mono text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Complaint Details</th>
              <th className="px-8 py-4 font-mono text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Technician</th>
              <th className="px-8 py-4 font-mono text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Status</th>
              <th className="px-8 py-4 font-mono text-[#908fa0] uppercase tracking-[0.15em] text-[11px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#464554]/10 font-medium text-sm">

            {/* Row 1 */}
            <tr className="hover:bg-[#8083ff]/5 transition-all group">
              <td className="px-8 py-5 font-mono text-[#c0c1ff] font-bold">#REQ-8902</td>
              <td className="px-8 py-5">
                <div className="font-bold text-[#dae2fd] group-hover:text-[#c0c1ff] transition-colors">Faulty AC in Block B, Rm 302</div>
                <div className="text-xs text-[#908fa0] mt-1 flex items-center gap-1.5">
                  <Icon name="calendar_today" className="text-[14px]" /> Oct 24, 2026 • 10:30 AM
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center text-[10px] font-bold border border-[#8083ff]/20">RS</div>
                  <span className="text-xs font-semibold text-[#dae2fd]">Rajesh Sharma</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#ff516a]/10 text-[#ffb2b7] border border-[#ff516a]/20">
                  <span className="w-1.5 h-1.5 bg-[#ff516a] rounded-full animate-pulse" /> Pending
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <Link href="/admin/view-complaints?ticket=REQ-8902" className="text-[#c0c1ff] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1 hover:underline">
                  Verify <Icon name="chevron_right" className="text-sm" />
                </Link>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-[#8083ff]/5 transition-all group">
              <td className="px-8 py-5 font-mono text-[#c0c1ff] font-bold">#REQ-8903</td>
              <td className="px-8 py-5">
                <div className="font-bold text-[#dae2fd] group-hover:text-[#c0c1ff] transition-colors">Water Leakage - Staff Quarters</div>
                <div className="text-xs text-[#908fa0] mt-1 flex items-center gap-1.5">
                  <Icon name="calendar_today" className="text-[14px]" /> Oct 24, 2026 • 09:15 AM
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4edea3]/20 text-[#4edea3] flex items-center justify-center text-[10px] font-bold border border-[#4edea3]/20">MK</div>
                  <span className="text-xs font-semibold text-[#dae2fd]">Mohit Kumar</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#8083ff]/10 text-[#c0c1ff] border border-[#8083ff]/20">
                  <span className="w-1.5 h-1.5 bg-[#8083ff] rounded-full" /> Assigned
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <Link href="/admin/track-complaints" className="text-[#c0c1ff] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1 hover:underline">
                  Track <Icon name="chevron_right" className="text-sm" />
                </Link>
              </td>
            </tr>

            {/* Row 3 */}
            <tr className="hover:bg-[#8083ff]/5 transition-all group">
              <td className="px-8 py-5 font-mono text-[#c0c1ff] font-bold">#REQ-8904</td>
              <td className="px-8 py-5">
                <div className="font-bold text-[#dae2fd] group-hover:text-[#c0c1ff] transition-colors">Main Entrance Door Jam</div>
                <div className="text-xs text-[#908fa0] mt-1 flex items-center gap-1.5">
                  <Icon name="calendar_today" className="text-[14px]" /> Oct 23, 2026 • 04:45 PM
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="text-xs text-[#908fa0] font-medium italic">Unassigned</span>
              </td>
              <td className="px-8 py-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" /> Urgent
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <Link href="/admin/view-complaints" className="vibrant-gradient text-white px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-[#8083ff]/20 hover:scale-105 transition-transform inline-block">
                  Assign Now
                </Link>
              </td>
            </tr>

            {/* Row 4 */}
            <tr className="hover:bg-[#8083ff]/5 transition-all group">
              <td className="px-8 py-5 font-mono text-[#c0c1ff] font-bold">#REQ-8905</td>
              <td className="px-8 py-5">
                <div className="font-bold text-[#dae2fd] group-hover:text-[#c0c1ff] transition-colors">Smart Board Calibration</div>
                <div className="text-xs text-[#908fa0] mt-1 flex items-center gap-1.5">
                  <Icon name="calendar_today" className="text-[14px]" /> Oct 23, 2026 • 02:00 PM
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-500/20">VP</div>
                  <span className="text-xs font-semibold text-[#dae2fd]">Vijay Pratap</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Icon name="check_circle" className="text-xs" /> Resolved
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <span className="text-[#908fa0] text-[11px] font-bold uppercase tracking-widest">Archived</span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div className="p-6 bg-[#131b2e]/30 border-t border-[#464554]/10 flex justify-between items-center">
        <p className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider">Page 1 of 64 <span className="mx-2">•</span> 1,248 Results</p>
        <div className="flex gap-2">
          <button disabled className="w-9 h-9 rounded-xl border border-[#464554]/20 flex items-center justify-center text-[#908fa0] opacity-30 cursor-not-allowed">
            <Icon name="chevron_left" className="text-sm" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-[#8083ff] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#8083ff]/30">1</button>
          <button className="w-9 h-9 rounded-xl border border-[#464554]/20 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] font-bold text-xs cursor-pointer">2</button>
          <button className="w-9 h-9 rounded-xl border border-[#464554]/20 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] font-bold text-xs cursor-pointer">3</button>
          <button className="w-9 h-9 rounded-xl border border-[#464554]/20 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] cursor-pointer">
            <Icon name="chevron_right" className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
