"use client";

import { useState } from "react";
import PageHeader from "@/components/admin/reports/PageHeader";
import FilterParameters from "@/components/admin/reports/FilterParameters";
import GeneratingIndicator from "@/components/admin/reports/GeneratingIndicator";
import ReportSummary from "@/components/admin/reports/ReportSummary";

export default function AdminReports() {
  const [reportType, setReportType] = useState("Monthly Report");
  const [statusFilter, setStatusFilter] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReportGenerated(true);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 print:p-0">
      <title>Reports Console | JMMS Admin</title>

      <PageHeader />

      <FilterParameters
        reportType={reportType}
        setReportType={setReportType}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onGenerate={handleGenerate}
        reportGenerated={reportGenerated}
        onDownloadPDF={handleDownloadPDF}
      />

      {generating && <GeneratingIndicator />}

      {reportGenerated && !generating && <ReportSummary reportType={reportType} />}
    </div>
  );
}
