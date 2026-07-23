"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp, doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { showToast } from "@/lib/toast";
import PageHeader from "@/components/admin/reports/PageHeader";
import FilterParameters from "@/components/admin/reports/FilterParameters";
import GeneratingIndicator from "@/components/admin/reports/GeneratingIndicator";
import ReportSummary, { ReportData } from "@/components/admin/reports/ReportSummary";

const RESOLVED_STATUSES = ["Completed", "Verified"];
const ACTIVE_STATUSES = ["Assigned", "In Progress"];

function formatDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: formatDate(start), end: formatDate(end) };
}

function getCurrentWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday ... 6 = Saturday
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: formatDate(monday), end: formatDate(sunday) };
}

// Daily/Weekly/Monthly ranges are computed automatically; only Custom Report
// leaves the date pickers open for manual entry.
function getRangeForReportType(type: string): { start: string; end: string } | null {
  if (type === "Daily Report") {
    const today = formatDate(new Date());
    return { start: today, end: today };
  }
  if (type === "Weekly Report") return getCurrentWeekRange();
  if (type === "Monthly Report") return getCurrentMonthRange();
  return null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

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
      const userMap = new Map<string, { name: string; role: string }>();
      usersSnapshot.docs.forEach((d) => {
        const data = d.data();
        userMap.set(d.id, { name: data.name || data.email || "Unnamed User", role: data.role || "" });
      });

      const total = complaints.length;
      const resolvedCount = complaints.filter((c) => RESOLVED_STATUSES.includes(c.status)).length;
      const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 1000) / 10 : 0;
      const pendingBacklog = complaints.filter((c) => c.status === "Pending").length;
      const inProgress = complaints.filter((c) => c.status === "In Progress").length;

      const deptMap = new Map<string, { count: number; resolved: number }>();
      complaints.forEach((c) => {
        const category = c.category || "Uncategorized";
        const entry = deptMap.get(category) || { count: 0, resolved: 0 };
        entry.count += 1;
        if (RESOLVED_STATUSES.includes(c.status)) entry.resolved += 1;
        deptMap.set(category, entry);
      });
      const departmentOutput = Array.from(deptMap.entries())
        .map(([category, { count, resolved }]) => ({
          category,
          sharePercent: total > 0 ? Math.round((count / total) * 100) : 0,
          resolvedPercent: count > 0 ? Math.round((resolved / count) * 100) : 0,
        }))
        .sort((a, b) => b.sharePercent - a.sharePercent);

      // Tally per-technician stats from tickets, keyed by both id and name
      // (older tickets may only have technicianName, not technicianId).
      const statsById = new Map<string, { count: number; resolved: number; active: string | null }>();
      const statsByName = new Map<string, { count: number; resolved: number; active: string | null }>();
      complaints.forEach((c) => {
        if (!c.technicianName) return;
        const isResolved = RESOLVED_STATUSES.includes(c.status);
        const isActive = ACTIVE_STATUSES.includes(c.status);
        const activeLabel = isActive ? `${c.id} - ${c.status}` : null;

        if (c.technicianId) {
          const entry = statsById.get(c.technicianId) || { count: 0, resolved: 0, active: null };
          entry.count += 1;
          if (isResolved) entry.resolved += 1;
          if (activeLabel && !entry.active) entry.active = activeLabel;
          statsById.set(c.technicianId, entry);
        }

        const entry = statsByName.get(c.technicianName) || { count: 0, resolved: 0, active: null };
        entry.count += 1;
        if (isResolved) entry.resolved += 1;
        if (activeLabel && !entry.active) entry.active = activeLabel;
        statsByName.set(c.technicianName, entry);
      });

      // Show every registered technician, not just the ones with tickets in this period.
      const technicianEntries = Array.from(userMap.entries()).filter(([, u]) => u.role === "Technician");
      const technicianCompliance = technicianEntries
        .map(([id, u]) => {
          const stats = statsById.get(id) || statsByName.get(u.name) || { count: 0, resolved: 0, active: null };
          return {
            name: u.name,
            ticketCount: stats.count,
            slaScore: stats.count > 0 ? Math.round((stats.resolved / stats.count) * 100) : 0,
          };
        })
        .sort((a, b) => b.slaScore - a.slaScore);

      const technicianRows = technicianEntries
        .map(([id, u]) => {
          const stats = statsById.get(id) || statsByName.get(u.name) || { count: 0, resolved: 0, active: null };
          return {
            technicianName: u.name,
            totalTickets: stats.count,
            currentStatus: stats.active || "Available – no ticket assigned",
          };
        })
        .sort((a, b) => b.totalTickets - a.totalTickets);

      const complaintRows = complaints.map((c) => ({
        ticketId: c.id,
        category: c.category || "-",
        priority: c.priority || "-",
        description: c.description || "-",
        postedBy: (c.userId && userMap.get(c.userId)?.name) || "Unknown",
        technicianName: c.technicianName || "Unassigned",
        status: c.status || "-",
      }));

      setReportData({
        totalComplaints: total,
        resolutionRate,
        pendingBacklog,
        inProgress,
        departmentOutput,
        technicianCompliance,
        complaintRows,
        technicianRows,
        generatedAt: new Date().toISOString().split("T")[0],
        generatedBy: adminName,
      });
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
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();

      try {
        const logo = await loadImage("/Logo.png");
        const logoWidth = 26;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        pdf.addImage(logo, "PNG", (pageWidth - logoWidth) / 2, 10, logoWidth, logoHeight);
      } catch (imgError) {
        console.error("Error loading logo for PDF:", imgError);
      }

      let cursorY = 42;
      pdf.setFontSize(15);
      pdf.setFont("helvetica", "bold");
      pdf.text("JAIN International Residential School", pageWidth / 2, cursorY, { align: "center" });

      cursorY += 6;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(reportType, pageWidth / 2, cursorY, { align: "center" });

      cursorY += 10;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Report Details (${startDate} - ${endDate})`, 14, cursorY);

      autoTable(pdf, {
        startY: cursorY + 4,
        head: [["Ticket ID", "Category", "Priority", "Description", "Posted By", "Assigned Technician", "Status"]],
        body: reportData.complaintRows.map((r) => [
          r.ticketId,
          r.category,
          r.priority,
          r.description,
          r.postedBy,
          r.technicianName,
          r.status,
        ]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [15, 23, 42] },
        columnStyles: { 3: { cellWidth: 50 } },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let afterTableY = (pdf as any).lastAutoTable.finalY + 12;

      if (afterTableY > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        afterTableY = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Technician Report (${startDate} - ${endDate})`, 14, afterTableY);

      autoTable(pdf, {
        startY: afterTableY + 4,
        head: [["Technician Name", "Total Tickets", "Current Status"]],
        body: reportData.technicianRows.map((r) => [r.technicianName, String(r.totalTickets), r.currentStatus]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [15, 23, 42] },
      });

      const monthName = new Date(`${startDate}T00:00:00`).toLocaleString("default", { month: "long" });
      pdf.save(`Report${monthName}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      showToast.error("Failed to export PDF. Please try again.");
    }
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
