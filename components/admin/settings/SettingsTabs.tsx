import Icon from "@/components/ui/Icon";

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: "profile" | "security";
  setActiveTab: (tab: "profile" | "security") => void;
}) {
  return (
    <div className="md:col-span-3 space-y-2">
      {[
        { key: "profile", label: "Profile Settings", icon: "person" },
        { key: "security", label: "Security & Login", icon: "lock" },
      ].map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "profile" | "security")}
            className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all text-xs cursor-pointer ${
              active
                ? "bg-[#171f33] text-[#c0c1ff] border border-[#c0c1ff]/30 shadow-sm"
                : "text-[#c7c4d7] hover:bg-[#171f33]/40"
            }`}
          >
            <Icon name={tab.icon} className="text-lg" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
