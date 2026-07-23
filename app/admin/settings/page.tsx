"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/settings/PageHeader";
import SettingsTabs from "@/components/admin/settings/SettingsTabs";
import ProfileSettings from "@/components/admin/settings/ProfileSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <title>Settings | JMMS Admin</title>

      <PageHeader />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Left Side: Tabs */}
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Side: Form Panel */}
        <div className="md:col-span-9 bg-[#171f33] border border-[#464554]/10 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden vibrant-shadow">

          {activeTab === "profile" && <ProfileSettings />}

          {activeTab === "security" && <SecuritySettings />}

        </div>
      </div>
    </div>
  );
}
