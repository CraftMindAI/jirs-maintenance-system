export default function PageHeader() {
  return (
    <div className="print:hidden">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
        System Reports Console
      </h1>
      <p className="text-xs text-slate-600 dark:text-[#c7c4d7] opacity-80 mt-1 font-semibold">
        Export analytical summaries, SLA resolution averages, and technician performances.
      </p>
    </div>
  );
}
