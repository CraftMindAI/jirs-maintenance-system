import Link from "next/link";
import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Complaint } from "@/app/dashboard/page";
import { getDeadlineInfo } from "@/utils/deadline";

export default function ComplaintsTable({
  complaints,
  currentUserId,
  isAdmin,
  isTechnician,
  onView,
  onApprove,
  onAssign,
  onDeleteRequest,
  onUpdateRequest,
}: {
  complaints: Complaint[];
  currentUserId: string | null;
  isAdmin: boolean;
  isTechnician: boolean;
  onView: (id: string) => void;
  onApprove: (id: string) => void;
  onAssign: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onUpdateRequest: (id: string) => void;
}) {
  if (complaints.length === 0) {
    return (
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
        <Icon name="search_off" className="text-4xl text-slate-400 dark:text-[#908fa0] mb-3 block mx-auto" />
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-[#dae2fd]">No Requests Found</h3>
        <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">Adjust search terms or reset options.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl overflow-hidden shadow-sm dark:vibrant-shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#131b2e]/50 border-b border-slate-200 dark:border-[#464554]/10">
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Ticket ID</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">User / Location</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Category</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Priority</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Technician</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em]">Status</th>
              <th className="py-4 px-6 font-mono text-slate-500 dark:text-[#908fa0] uppercase text-[11px] tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#464554]/10 font-medium text-xs">
            {complaints.map((item, index) => {
              const isOwner = !!currentUserId && item.userId === currentUserId;
              const canManage = isOwner && item.status === "Pending";
              const canAssign = isAdmin && (item.status === "Pending" || item.status === "Approved" || item.status === "Assigned" || item.status === "In Progress");
              const canUpdateProgress = isTechnician && (item.status === "Assigned" || item.status === "In Progress");
              const deadline = getDeadlineInfo(item.assignedAt, item.assignedDate, item.status);
              const displayStatus =
                item.status === "Pending" || item.status === "Approved" ? "Unassigned" : item.status;
              return (
              <tr key={item.id} className="hover:bg-primary/5 dark:hover:bg-[#8083ff]/5 transition-colors">
                <td className="py-4 px-6 font-mono text-primary dark:text-[#c0c1ff] font-bold">
                  <Link href={`/admin/view-complaints/${item.id}`} className="hover:underline">
                    {index + 1}
                  </Link>
                </td>
                <td className="py-4 px-6">
                  <div className="text-slate-900 dark:text-[#dae2fd] font-bold">{isOwner ? "You" : "Community Member"}</div>
                  <div className="text-[10px] text-slate-500 dark:text-[#908fa0] truncate max-w-[140px]">{item.location}</div>
                </td>
                <td className="py-4 px-6 text-slate-700 dark:text-[#c7c4d7]">{item.category}</td>
                <td className="py-4 px-6">
                  <PriorityBadge priority={item.priority} />
                </td>
                <td className="py-4 px-6 text-slate-800 dark:text-[#dae2fd]">
                  {item.technicianName ? (
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Icon name="person" className="text-slate-400 dark:text-[#908fa0] text-sm" />
                      {item.technicianName}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-[#908fa0] italic">Unassigned</span>
                  )}
                </td>
               
                <td className="py-4 px-6">
                  <StatusBadge status={displayStatus} />
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-3 text-slate-400 dark:text-[#908fa0]">
                    <Link href={`/admin/view-complaints/${item.id}`} title="View Details" className="hover:text-primary dark:hover:text-[#c0c1ff] transition-colors cursor-pointer">
                      <Icon name="visibility" className="text-lg" />
                    </Link>
                    {canManage && (
                      <>
                        <Link href={`/admin/complaint/edit/${item.id}`} title="Edit Ticket" className="hover:text-amber-500 transition-colors cursor-pointer">
                          <Icon name="edit" className="text-lg" />
                        </Link>
                        <button onClick={() => onDeleteRequest(item.id)} title="Delete Ticket" className="hover:text-red-500 transition-colors cursor-pointer">
                          <Icon name="delete" className="text-lg" />
                        </button>
                      </>
                    )}
                    {canAssign && (
                      <button
                        onClick={() => onAssign(item.id)}
                        title={item.status === "Assigned" ? "Reassign Technician" : "Assign Technician"}
                        className="hover:text-emerald-500 transition-colors cursor-pointer"
                      >
                        <Icon name={item.status === "Assigned" ? "sync" : "assignment_turned_in"} className="text-lg" />
                      </button>
                    )}
                    {canUpdateProgress && (
                      <button onClick={() => onUpdateRequest(item.id)} title="Update Progress" className="hover:text-emerald-500 transition-colors cursor-pointer">
                        <Icon name="update" className="text-lg" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
