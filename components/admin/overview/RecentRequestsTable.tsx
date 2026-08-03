import Link from "next/link";
import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/ui/StatusBadge";

export type RecentRequest = {
  id: string;
  title: string;
  date: string;
  technicianName?: string;
  status: string;
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function actionFor(request: RecentRequest) {
  if (request.status === "Pending") {
    return (
      <Link
        href={`/admin/view-complaints/${request.id}`}
        className="vibrant-gradient text-white px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-[#8083ff]/20 hover:scale-105 transition-transform inline-block"
      >
        Assign Now
      </Link>
    );
  }
  if (request.status === "Assigned" || request.status === "In Progress") {
    return (
      <Link
        href={`/admin/view-complaints/${request.id}`}
        className="text-primary dark:text-[#c0c1ff] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1 hover:underline"
      >
        Track <Icon name="chevron_right" className="text-sm" />
      </Link>
    );
  }
  return (
    <Link
      href={`/admin/view-complaints/${request.id}`}
      className="text-primary dark:text-[#c0c1ff] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-1 hover:underline"
    >
      View <Icon name="chevron_right" className="text-sm" />
    </Link>
  );
}

export default function RecentRequestsTable({
  requests,
  totalCount,
}: Readonly<{ requests: RecentRequest[]; totalCount: number }>) {
  return (
    <div className="lg:col-span-3 bg-white dark:bg-[#171f33] rounded-3xl border border-slate-200 dark:border-[#464554]/10 overflow-hidden shadow-md dark:vibrant-shadow">
      <div className="p-6 md:p-8 border-b border-slate-200 dark:border-[#464554]/10 flex justify-between items-center bg-slate-50/50 dark:bg-[#131b2e]/30">
        <div>
          <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-[#dae2fd]">Recent Maintenance Requests</h3>
          <p className="text-slate-500 dark:text-[#908fa0] text-xs font-semibold mt-1">Live feed of reported issues across campus</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/view-complaints" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#222a3d] flex items-center justify-center text-slate-600 dark:text-[#c7c4d7] hover:text-primary dark:hover:text-[#c0c1ff] transition-colors border border-slate-200 dark:border-[#464554]/20">
            <Icon name="search" className="text-lg" />
          </Link>
          <Link href="/admin/view-complaints" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#222a3d] flex items-center justify-center text-slate-600 dark:text-[#c7c4d7] hover:text-primary dark:hover:text-[#c0c1ff] transition-colors border border-slate-200 dark:border-[#464554]/20">
            <Icon name="tune" className="text-lg" />
          </Link>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="p-8 md:p-16 text-center">
          <Icon name="inbox" className="text-4xl text-slate-400 dark:text-[#908fa0] mb-3 block mx-auto" />
          <h4 className="font-display text-lg font-bold text-slate-900 dark:text-[#dae2fd]">No Requests Yet</h4>
          <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">New maintenance tickets will show up here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#131b2e]/50">
                <th className="px-8 py-4 font-mono text-slate-500 dark:text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Request ID</th>
                <th className="px-8 py-4 font-mono text-slate-500 dark:text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Complaint Details</th>
                <th className="px-8 py-4 font-mono text-slate-500 dark:text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Technician</th>
                <th className="px-8 py-4 font-mono text-slate-500 dark:text-[#908fa0] uppercase tracking-[0.15em] text-[11px]">Status</th>
                <th className="px-8 py-4 font-mono text-slate-500 dark:text-[#908fa0] uppercase tracking-[0.15em] text-[11px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#464554]/10 font-medium text-sm">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-primary/5 dark:hover:bg-[#8083ff]/5 transition-all group">
                  <td className="px-8 py-5 font-mono text-primary dark:text-[#c0c1ff] font-bold">#{request.id}</td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900 dark:text-[#dae2fd] group-hover:text-primary dark:group-hover:text-[#c0c1ff] transition-colors truncate max-w-xs">{request.title}</div>
                    <div className="text-xs text-slate-500 dark:text-[#908fa0] mt-1 flex items-center gap-1.5">
                      <Icon name="calendar_today" className="text-[14px]" /> {request.date}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {request.technicianName ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-[#8083ff]/20 text-primary dark:text-[#c0c1ff] flex items-center justify-center text-[10px] font-bold border border-primary/20 dark:border-[#8083ff]/20">
                          {initials(request.technicianName)}
                        </div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-[#dae2fd]">{request.technicianName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-[#908fa0] font-medium italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={request.status} className="px-3 py-1 text-[11px]" />
                  </td>
                  <td className="px-8 py-5 text-right">{actionFor(request)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-6 bg-slate-50/50 dark:bg-[#131b2e]/30 border-t border-slate-200 dark:border-[#464554]/10 flex justify-between items-center">
        <p className="text-xs font-semibold text-slate-500 dark:text-[#908fa0] uppercase tracking-wider">
          Showing {requests.length} of {totalCount} Results
        </p>
      </div>
    </div>
  );
}
