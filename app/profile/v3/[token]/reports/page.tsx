"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { showToast } from "@/lib/toast";
import PageHeader from "@/components/admin/reports/PageHeader";
import FilterParameters from "@/components/admin/reports/FilterParameters";
import GeneratingIndicator from "@/components/admin/reports/GeneratingIndicator";
import ReportSummary, { ReportData } from "@/components/admin/reports/ReportSummary";
import {
  getCurrentMonthRange,
  getRangeForReportType,
  buildReportData,
  exportReportPdf,
  UserInfo,
} from "@/utils/admin/report";

export default function AdminReports() {
  const currentMonthRange = getCurrentMonthRange();

  const [reportType, setReportType] = useState("Monthly Report");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(currentMonthRange.start);
  const [endDate, setEndDate] = useState(currentMonthRange.end);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [adminName, setAdminName] = useState("Admin User");

  // Daily/Weekly/Monthly auto-fill the date range; Custom Report leaves it to the user.
  useEffect(() => {
    const range = getRangeForReportType(reportType);
    if (!range) return;
    setStartDate(range.start);
    setEndDate(range.end);
  }, [reportType]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const data = docSnap.exists() ? docSnap.data() : null;
        setAdminName(data?.name || user.displayName || "Admin User");
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const generateReport = async (rangeStart: string, rangeEnd: string, status: string) => {
    setGenerating(true);

    try {
      const start = new Date(`${rangeStart}T00:00:00`);
      const end = new Date(`${rangeEnd}T23:59:59.999`);

      const constraints = [
        where("createdAt", ">=", Timestamp.fromDate(start)),
        where("createdAt", "<=", Timestamp.fromDate(end)),
      ];
      if (status !== "all") {
        constraints.push(where("status", "==", status));
      }

      const snapshot = await getDocs(query(collection(db, "complaints"), ...constraints));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const complaints = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

      // Fetch every user once: resolves both "Posted By" names and the full technician roster.
      const usersSnapshot = await getDocs(collection(db, "users"));
      const userMap = new Map<string, UserInfo>();
      usersSnapshot.docs.forEach((d) => {
        const data = d.data();
        userMap.set(d.id, { name: data.name || data.email || "Unnamed User", role: data.role || "" });
      });

      setReportData(buildReportData(complaints, userMap, adminName));
    } catch (error) {
      console.error("Error generating report:", error);
      showToast.error("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateReport(startDate, endDate, statusFilter);
  };

  // Show the current month's status by default, without waiting for "Generate Summary".
  useEffect(() => {
    generateReport(startDate, endDate, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportData) return;

    if (!reportData.complaintRows || !reportData.technicianRows) {
      showToast.error("Report data is out of date. Please click \"Generate Summary\" again.");
      return;
    }

    try {
      await exportReportPdf(reportData, reportType, startDate, endDate);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showToast.error("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="space-y-8 pb-12 print:p-0">
      <title>Reports Console | JFM Admin</title>

      <PageHeader />

      <FilterParameters
        reportType={reportType}
        setReportType={setReportType}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onGenerate={handleGenerate}
        reportGenerated={!!reportData}
        onDownloadPDF={handleDownloadPDF}
      />

      {generating && <GeneratingIndicator />}

      {reportData && !generating && <ReportSummary reportType={reportType} data={reportData} />}
    </div>
  );
}
