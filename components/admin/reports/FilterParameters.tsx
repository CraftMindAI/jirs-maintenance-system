import Icon from "@/components/ui/Icon";

export default function FilterParameters({
  reportType,
  setReportType,
  statusFilter,
  setStatusFilter,
  onGenerate,
  reportGenerated,
  onDownloadPDF,
}: {
  reportType: string;
  setReportType: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  reportGenerated: boolean;
  onDownloadPDF: () => void;
}) {
  return (
    <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-6 shadow-sm print:hidden vibrant-shadow">
      <h3 className="font-display text-sm font-bold text-[#dae2fd] mb-4 flex items-center gap-2">
        <Icon name="filter_list" className="text-[#c0c1ff]" />
        Filter Parameters
      </h3>

      <form onSubmit={onGenerate} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Start Date</label>
            <input type="date" defaultValue="2026-07-01" className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-semibold outline-none cursor-pointer" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">End Date</label>
            <input type="date" defaultValue="2026-07-31" className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-semibold outline-none cursor-pointer" />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-bold outline-none cursor-pointer">
              <option value="Daily Report">Daily Report</option>
              <option value="Weekly Report">Weekly Report</option>
              <option value="Monthly Report">Monthly Report</option>
              <option value="Custom Report">Custom Report</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Status Filter</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-bold outline-none cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="Completed">Completed Only</option>
              <option value="Pending">Pending Only</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 border-t border-[#464554]/10 pt-4">
          <button type="submit" className="px-6 py-3 bg-[#222a3d] border border-[#c0c1ff]/20 text-[#c0c1ff] rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5 hover:bg-[#2d3449]">
            <Icon name="refresh" className="text-sm" /> Generate Summary
          </button>
          {reportGenerated && (
            <button type="button" onClick={onDownloadPDF} className="px-6 py-3 vibrant-gradient text-white rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#8083ff]/20 uppercase tracking-wider">
              <Icon name="download" className="text-sm" /> Export PDF
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
