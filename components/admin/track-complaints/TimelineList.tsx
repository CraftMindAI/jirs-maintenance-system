import Icon from "@/components/ui/Icon";
import { Complaint } from "@/app/dashboard/page";

const TIMELINE_STEPS = [
  { key: "Pending", label: "Submitted" },
  { key: "Verified", label: "Approved" },
  { key: "Assigned", label: "Assigned" },
  { key: "In Progress", label: "Started" },
  { key: "Completed", label: "Completed" },
  { key: "Closed", label: "Closed" },
];

const getStepStatus = (stepKey: string, currentStatus: string) => {
  const order = ["Pending", "Verified", "Assigned", "In Progress", "Completed", "Closed"];
  const normCurrent = currentStatus;
  const currentIdx = order.indexOf(normCurrent);
  const stepIdx = order.indexOf(stepKey);

  if (currentIdx >= stepIdx) return "completed";
  if (currentIdx + 1 === stepIdx) return "active";
  return "pending";
};

export default function TimelineList({ complaints }: { complaints: Complaint[] }) {
  if (complaints.length === 0) {
    return (
      <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-16 text-center shadow-sm">
        <Icon name="engineering" className="text-4xl text-[#908fa0] mb-3 block mx-auto" />
        <h3 className="font-display text-xl font-bold text-[#dae2fd]">No Tracking Data</h3>
        <p className="text-xs text-[#908fa0] mt-1">No tickets fit the chosen filter specifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {complaints.map((item) => (
        <div
          key={item.id}
          className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-6 shadow-sm space-y-6 vibrant-shadow relative overflow-hidden card-shine"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#464554]/20 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#dae2fd]">
                {item.category} ({item.id})
              </h3>
              <p className="text-xs text-[#908fa0] mt-0.5">Location: {item.location} • Reporter: Siddharth Roy</p>
            </div>
            <div className="text-xs font-semibold text-[#908fa0] flex gap-4">
              <div>
                <span>Staff:</span>
                <span className="text-[#c0c1ff] ml-1.5 font-bold">{item.technicianName || "Unassigned"}</span>
              </div>
              <div>
                <span>SLA Target:</span>
                <span className="text-[#dae2fd] ml-1.5 font-bold">24 Hrs</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto py-2">
            <div className="min-w-[600px] flex items-center justify-between relative px-4">
              <div className="absolute top-[15px] left-8 right-8 h-[2px] bg-[#131b2e] pointer-events-none" />

              {TIMELINE_STEPS.map((step, idx) => {
                const status = getStepStatus(step.key, item.status);
                return (
                  <div key={idx} className="relative flex flex-col items-center gap-2 text-center z-10 w-24">
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      status === "completed"
                        ? "bg-[#8083ff] border-[#8083ff] text-white scale-110 shadow-lg shadow-[#8083ff]/30"
                        : status === "active"
                        ? "bg-[#171f33] border-[#8083ff] text-[#c0c1ff] animate-pulse"
                        : "bg-[#171f33] border-[#464554]/30 text-[#908fa0]"
                    }`}>
                      {status === "completed" ? <Icon name="check" className="text-xs font-black" /> : idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      status === "completed" ? "text-[#dae2fd] font-bold" :
                      status === "active" ? "text-[#c0c1ff] font-extrabold" :
                      "text-[#908fa0]"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
