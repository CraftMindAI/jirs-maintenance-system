import Link from "next/link";

export type ServiceSlice = {
  category: string;
  percent: number;
  color: string;
};

export default function ServiceSplit({ data }: Readonly<{ data: ServiceSlice[] }>) {
  return (
    <div className="bg-white dark:bg-[#171f33] p-8 rounded-3xl border border-slate-200 dark:border-[#464554]/10 flex flex-col justify-between shadow-md dark:vibrant-shadow">
      <div>
        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-[#dae2fd] mb-6">Service Split</h3>

        {data.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-[#908fa0] font-semibold py-4">No complaints logged yet.</p>
        ) : (
          <div className="space-y-6">
            {data.map((slice) => (
              <div key={slice.category} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-800 dark:text-[#dae2fd]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }} /> {slice.category}
                  </span>
                  <span className="text-slate-800 dark:text-[#dae2fd]">{slice.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#131b2e] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${slice.percent}%`, backgroundColor: slice.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/admin/reports"
        className="w-full mt-8 py-3.5 bg-primary/10 dark:bg-[#222a3d] text-primary dark:text-[#c0c1ff] font-extrabold rounded-2xl hover:bg-primary/20 dark:hover:bg-[#2d3449] transition-all text-xs uppercase tracking-widest border border-primary/20 dark:border-[#c0c1ff]/20 text-center block"
      >
        Detailed Analytics
      </Link>
    </div>
  );
}
