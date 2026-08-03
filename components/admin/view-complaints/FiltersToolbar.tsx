import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import { TECHNICIANS } from "./constants";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Assigned", label: "Assigned" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const DEPT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Civil", label: "Civil" },
  { value: "Carpentry", label: "Carpentry" },
  { value: "HVAC", label: "HVAC" },
];

const TECH_OPTIONS = [
  { value: "all", label: "All Technicians" },
  { value: "unassigned", label: "Unassigned" },
  ...TECHNICIANS.map((t) => ({ value: t.name, label: t.name })),
];

export default function FiltersToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  deptFilter,
  setDeptFilter,
  techFilter,
  setTechFilter,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  deptFilter: string;
  setDeptFilter: (value: string) => void;
  techFilter: string;
  setTechFilter: (value: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm space-y-4 dark:vibrant-shadow">
      <div className="relative w-full">
        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]" />
        <input
          type="text"
          placeholder="Search by ticket ID, category, location, or issue description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-[#464554]/20 bg-slate-50 dark:bg-[#131b2e] text-slate-800 dark:text-[#dae2fd] text-xs font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Dropdown options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        <Dropdown options={PRIORITY_OPTIONS} value={priorityFilter} onChange={setPriorityFilter} />
        <Dropdown options={DEPT_OPTIONS} value={deptFilter} onChange={setDeptFilter} />
        <Dropdown options={TECH_OPTIONS} value={techFilter} onChange={setTechFilter} />
      </div>
    </div>
  );
}
