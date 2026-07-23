"use client";

import Icon from "@/components/ui/Icon";
import Dropdown, { DropdownOption } from "@/components/ui/Dropdown";
import DatePicker from "@/components/ui/DatePicker";

const REPORT_TYPE_OPTIONS: DropdownOption[] = [
  { value: "Daily Report", label: "Daily Report" },
  { value: "Weekly Report", label: "Weekly Report" },
  { value: "Monthly Report", label: "Monthly Report" },
  { value: "Custom Report", label: "Custom Report" },
];

const STATUS_FILTER_OPTIONS: DropdownOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Assigned", label: "Assigned" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

export default function FilterParameters({
  reportType,
  setReportType,
  statusFilter,
  setStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onGenerate,
  reportGenerated,
  onDownloadPDF,
}: {
  reportType: string;
  setReportType: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  reportGenerated: boolean;
  onDownloadPDF: () => void;
}) {
  const datesLocked = reportType !== "Custom Report";

  return (
    <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-6 shadow-sm print:hidden vibrant-shadow">
      <h3 className="font-display text-sm font-bold text-[#dae2fd] mb-4 flex items-center gap-2">
        <Icon name="filter_list" className="text-[#c0c1ff]" />
        Filter Parameters
      </h3>

      <form onSubmit={onGenerate} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Start Date Custom Picker */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0] tracking-wider">
              Start Date
            </label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Select Start Date"
              disabled={datesLocked}
            />
          </div>

          {/* End Date Custom Picker */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0] tracking-wider">
              End Date
            </label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Select End Date"
              disabled={datesLocked}
            />
          </div>

          {/* Report Type Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0] tracking-wider">
              Report Type
            </label>
            <Dropdown
              options={REPORT_TYPE_OPTIONS}
              value={reportType}
              onChange={setReportType}
              placeholder="Select Report Type"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-[#908fa0] tracking-wider">
              Status Filter
            </label>
            <Dropdown
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Select Status"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 border-t border-[#464554]/10 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-[#222a3d] border border-[#c0c1ff]/20 text-[#c0c1ff] hover:bg-[#8083ff]/15 hover:border-[#8083ff]/40 rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5"
          >
            <Icon name="refresh" className="text-sm" /> Generate Summary
          </button>
          {reportGenerated && (
            <button
              type="button"
              onClick={onDownloadPDF}
              className="px-6 py-3 vibrant-gradient text-white rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#8083ff]/20 uppercase tracking-wider hover:scale-[1.01]"
            >
              <Icon name="download" className="text-sm" /> Export PDF
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
