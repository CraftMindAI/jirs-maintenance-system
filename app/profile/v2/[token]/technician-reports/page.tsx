"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { showToast } from "@/lib/toast";
import PageHeader from "@/components/admin/reports/PageHeader";
import FilterParameters from "@/components/admin/reports/FilterParameters";
import GeneratingIndicator from "@/components/admin/reports/GeneratingIndicator";
import ReportSummary, { ReportData } from "@/components/admin/reports/ReportSummary";
import { getCurrentMonthRange, getRangeForReportType, buildReportData, exportReportPdf, UserInfo, RawComplaintDoc } from "@/utils/admin/report";

export default function TechnicianReportsPage() {
  const currentMonthRange = getCurrentMonthRange();

  const [techName, setTechName] = useState("Technician");
  const [allComplaints, setAllComplaints] = useState<RawComplaintDoc[]>([]);
  const [userMap, setUserMap] = useState<Map<string, UserInfo>>(new Map());
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState("Monthly Report");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(currentMonthRange.start);
  const [endDate, setEndDate] = useState(currentMonthRange.end);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Daily/Weekly/Monthly auto-fill the date range; Custom Report leaves it to the user.
  useEffect(() => {
    const range = getRangeForReportType(reportType);
    if (!range) return;
    setStartDate(range.start);
    setEndDate(range.end);
  }, [reportType]);

  // Fetch this technician's identity, and keep their assigned tickets live.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAllComplaints([]);
        setLoading(false);
        return;
      }

      let name = currentUser.displayName || "Technician";
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().name) {
          name = userDoc.data().name;
        }
        setTechName(name);
      } catch (error) {
        console.error("Error fetching technician profile:", error);
      }

      const complaintsRef = collection(db, "complaints");
      const unsubscribeSnapshot = onSnapshot(
        complaintsRef,
        (snapshot) => {
          const fetchedComplaints: RawComplaintDoc[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const isAssignedToMe =
              data.technicianId === currentUser.uid ||
              data.technicianEmail === currentUser.email ||
              data.technicianName === name;

            if (isAssignedToMe) {
              fetchedComplaints.push({ id: docSnap.id, ...data });
            }
          });
          setAllComplaints(fetchedComplaints);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching reports:", error);
          setLoading(false);
        },
      );

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  // Resolve "Posted By" names once.
  useEffect(() => {
    getDocs(collection(db, "users"))
      .then((usersSnapshot) => {
        const map = new Map<string, UserInfo>();
        usersSnapshot.docs.forEach((d) => {
          const data = d.data();
          map.set(d.id, { name: data.name || data.email || "Unnamed User", role: data.role || "" });
        });
        setUserMap(map);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const generateReport = (rangeStart: string, rangeEnd: string, status: string) => {
    setGenerating(true);

    try {
      const start = new Date(`${rangeStart}T00:00:00`).getTime();
      const end = new Date(`${rangeEnd}T23:59:59.999`).getTime();

      const complaints = allComplaints.filter((c) => {
        const created = c.createdAt?.toDate ? c.createdAt.toDate().getTime() : (c.date ? new Date(c.date).getTime() : 0);
        const inRange = created >= start && created <= end;
        const matchesStatus = status === "all" || c.status === status;
        return inRange && matchesStatus;
      });

      setReportData(buildReportData(complaints, userMap, techName));
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
    if (loading) return;
    generateReport(startDate, endDate, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, allComplaints, userMap]);

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
      <title>Reports | Technician | JFM</title>

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

      {(generating || loading) && <GeneratingIndicator />}

      {reportData && !generating && !loading && (
        <ReportSummary reportType={reportType} data={reportData} hideTechnicianCompliance />
      )}
    </div>
  );
}
