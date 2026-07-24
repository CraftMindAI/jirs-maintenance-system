import Icon from "@/components/ui/Icon";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm dark:vibrant-shadow">
      <div className="relative w-full">
        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]" />
        <input
          type="text"
          placeholder="Search users by name, email, department, or system role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-[#464554]/20 bg-slate-50 dark:bg-[#131b2e] text-slate-800 dark:text-[#dae2fd] text-xs font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff]"
        />
      </div>
    </div>
  );
}
