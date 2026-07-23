import Icon from "@/components/ui/Icon";
import { Complaint } from "@/app/dashboard/page";

export default function ComplaintsTable({
  complaints,
  onView,
  onAssign,
  onDeleteRequest,
}: {
  complaints: Complaint[];
  onView: (id: string) => void;
  onAssign: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}) {
  if (complaints.length === 0) {
    return (
      <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
        <Icon name="search_off" className="text-4xl text-[#908fa0] mb-3 block mx-auto" />
        <h3 className="font-display text-xl font-bold text-[#dae2fd]">No Requests Found</h3>
        <p className="text-xs text-[#908fa0] mt-1">Adjust search terms or reset options.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl overflow-hidden shadow-sm vibrant-shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#131b2e]/50 border-b border-[#464554]/10">
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Ticket ID</th>
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">User / Location</th>
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Category</th>
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Priority</th>
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Technician</th>
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Status</th>
              <th className="py-4 px-6 font-mono text-[#908fa0] uppercase text-[11px] tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#464554]/10 font-medium text-xs">
            {complaints.map((item) => (
              <tr key={item.id} className="hover:bg-[#8083ff]/5 transition-colors">
                <td className="py-4 px-6 font-mono text-[#c0c1ff] font-bold">{item.id}</td>
                <td className="py-4 px-6">
                  <div className="text-[#dae2fd] font-bold">Siddharth Roy</div>
                  <div className="text-[10px] text-[#908fa0] truncate max-w-[140px]">{item.location}</div>
                </td>
                <td className="py-4 px-6 text-[#c7c4d7]">{item.category}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.priority === "High" ? "bg-[#ff516a]/15 text-[#ffb2b7] border border-[#ff516a]/20" :
                    item.priority === "Medium" ? "bg-amber-500/15 text-amber-300 border border-amber-500/20" :
                    "bg-[#908fa0]/15 text-[#908fa0] border border-[#908fa0]/20"
                  }`}>{item.priority}</span>
                </td>
                <td className="py-4 px-6 text-[#dae2fd]">
                  {item.technicianName ? (
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Icon name="person" className="text-[#908fa0] text-sm" />
                      {item.technicianName}
                    </span>
                  ) : (
                    <span className="text-[#908fa0] italic">Unassigned</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    item.status === "Pending" ? "bg-[#ff516a]/10 text-[#ffb2b7] border border-[#ff516a]/20" :
                    item.status === "Assigned" ? "bg-[#8083ff]/10 text-[#c0c1ff] border border-[#8083ff]/20" :
                    item.status === "In Progress" ? "bg-[#00a572]/10 text-[#4edea3] border border-[#00a572]/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>{item.status}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-3 text-[#908fa0]">
                    <button onClick={() => onView(item.id)} title="View Details" className="hover:text-[#c0c1ff] transition-colors cursor-pointer">
                      <Icon name="visibility" className="text-lg" />
                    </button>
                    {item.status === "Pending" && (
                      <button onClick={() => onAssign(item.id)} title="Assign Technician" className="hover:text-[#4edea3] transition-colors cursor-pointer">
                        <Icon name="assignment_turned_in" className="text-lg" />
                      </button>
                    )}
                    <button onClick={() => onDeleteRequest(item.id)} title="Delete Ticket" className="hover:text-red-400 transition-colors cursor-pointer">
                      <Icon name="delete" className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
