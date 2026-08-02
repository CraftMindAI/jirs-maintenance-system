import Icon from "@/components/ui/Icon";

export default function PageHeader({ onAddTechnician }: { onAddTechnician: () => void }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
          User Account Governance
        </h1>
        <p className="text-xs text-slate-600 dark:text-[#c7c4d7] opacity-80 mt-1 font-semibold">
          Oversee profiles, allocate department access roles, and configure administrative authorizations.
        </p>
      </div>

      <button
        onClick={onAddTechnician}
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-extrabold shadow-lg shadow-primary/20 transition-all cursor-pointer"
      >
        <Icon name="engineering" className="text-base" />
        Add Technician
      </button>
    </div>
  );
}
