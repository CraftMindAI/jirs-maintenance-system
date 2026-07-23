import Icon from "@/components/ui/Icon";
import { TECHNICIANS } from "./constants";

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
    <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-6 shadow-sm space-y-4 vibrant-shadow">
      <div className="relative w-full">
        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#908fa0]" />
        <input
          type="text"
          placeholder="Search by ticket ID, category, location, or issue description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-semibold outline-none focus:border-[#8083ff] transition-all"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-bold outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Verified">Verified</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-bold outline-none cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-bold outline-none cursor-pointer"
        >
          <option value="all">All Departments</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Civil">Civil</option>
          <option value="Carpentry">Carpentry</option>
          <option value="HVAC">HVAC</option>
        </select>

        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#464554]/20 bg-[#131b2e] text-[#dae2fd] text-xs font-bold outline-none cursor-pointer"
        >
          <option value="all">All Technicians</option>
          <option value="unassigned">Unassigned</option>
          {TECHNICIANS.map((t) => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
