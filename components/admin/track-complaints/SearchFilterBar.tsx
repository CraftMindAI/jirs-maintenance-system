import Icon from "@/components/ui/Icon";

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center dark:vibrant-shadow">
      <div className="relative w-full md:flex-1">
        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]" />
        <input
          type="text"
          placeholder="Search by ticket ID, location, department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-[#464554]/20 bg-slate-50 dark:bg-[#131b2e] text-slate-800 dark:text-[#dae2fd] text-xs font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff]"
        />
      </div>
      <div className="w-full md:w-48">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#464554]/20 bg-slate-50 dark:bg-[#131b2e] text-slate-800 dark:text-[#dae2fd] text-xs font-bold outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Verified">Verified</option>
        </select>
      </div>
    </div>
  );
}
