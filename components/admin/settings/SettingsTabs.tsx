"use client";

import Icon from "@/components/ui/Icon";

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "profile" | "security";
  setActiveTab: (tab: "profile" | "security") => void;
}) {
  const tabs = [
    { key: "profile", label: "Profile Information", icon: "manage_accounts", description: "Personal & contact info" },
    { key: "security", label: "Security & Login", icon: "shield", description: "Password & security controls" },
  ];

  return (
    <div className="md:col-span-3 space-y-3">
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-2xl p-2 space-y-2 shadow-sm">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "profile" | "security")}
              className={`w-full text-left p-3.5 rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                active
                  ? "bg-slate-100 dark:bg-[#131b2e] text-primary dark:text-[#c0c1ff] border border-primary/30 dark:border-[#8083ff]/30 shadow-md"
                  : "text-slate-500 dark:text-[#908fa0] hover:text-slate-900 dark:hover:text-[#dae2fd] hover:bg-slate-50 dark:hover:bg-[#131b2e]/50"
              }`}
            >
              {/* Glowing Indicator Bar */}
              {active && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-emerald-500 dark:from-[#8083ff] dark:to-[#00a572] rounded-r-full" />
              )}

              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  active
                    ? "bg-primary/15 dark:bg-[#8083ff]/15 text-primary dark:text-[#8083ff]"
                    : "bg-slate-100 dark:bg-[#131b2e] text-slate-400 dark:text-[#908fa0] group-hover:text-slate-800 dark:group-hover:text-[#dae2fd]"
                }`}
              >
                <Icon name={tab.icon} className="text-lg" />
              </div>

              <div>
                <span className="block font-bold text-xs">{tab.label}</span>
                <span className="block text-[10px] font-mono text-slate-400 dark:text-[#908fa0] font-normal mt-0.5">
                  {tab.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
