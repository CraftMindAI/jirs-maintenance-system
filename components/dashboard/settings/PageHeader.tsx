import Icon from "@/components/ui/Icon";

export default function PageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#464554]/10 pb-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-primary dark:text-[#8083ff] mb-1">
          <Icon name="tune" className="text-sm" />
          <span>Account / Settings</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-[#dae2fd] tracking-tight">
          Settings & Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1 font-medium">
          Manage your account credentials, contact details, and login security.
        </p>
      </div>
    </div>
  );
}
