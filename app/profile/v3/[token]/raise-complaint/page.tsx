"use client";

import { use } from "react";
import PageHeader from "@/components/admin/raise-complaint/PageHeader";
import ComplaintForm from "@/components/admin/raise-complaint/ComplaintForm";

export default function AdminRaiseComplaint({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v3/${token}`;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <title>Raise Complaint | JFM Admin</title>

      <PageHeader backHref={`${basePath}/view-complaints`} />

      <ComplaintForm basePath={basePath} />
    </div>
  );
}
