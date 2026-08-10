"use client";

import PageHeader from "@/components/admin/settings/PageHeader";
import ProfileSettings from "@/components/admin/settings/ProfileSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";

export default function AdminSettings() {
  return (
    <div className="space-y-8 pb-28 sm:pb-12 max-w-5xl mx-auto">
      <title>Settings & Profile | JFM Admin</title>

      <PageHeader />

      {/* Unified Single View for Profile Information & Password Security */}
      <div className="space-y-8">
        {/* Section 1: Profile Information */}
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden dark:vibrant-shadow">
          <ProfileSettings />
        </div>

        {/* Section 2: Security & Password Update */}
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden dark:vibrant-shadow">
          <SecuritySettings />
        </div>
      </div>
    </div>
  );
}
