"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function AdminReports() {
  const [reportType, setReportType] = useState("Monthly Report");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true); // default preview on

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReportGenerated(true);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    // Trigger browser printing for clean print simulation
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 print:p-0">
      <title>Reports Generator | JMMS Admin</title>

      {/* Header Info (hidden on printing) */}
      <div className="print:hidden">
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          System Reports Console
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Export analytical summaries, SLA resolution averages, and technician performances.
        </p>
      </div>

      {/* Report Filter Card (hidden on printing) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm print:hidden">
        <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Icon name="filter_list" className="text-primary" />
          Filter Parameters
        </h3>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
              <input type="date" defaultValue="2026-07-01" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none cursor-pointer" />
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
              <input type="date" defaultValue="2026-07-31" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none cursor-pointer" />
            </div>

            {/* Report Type */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none cursor-pointer">
                <option value="Daily Report">Daily Report</option>
                <option value="Weekly Report">Weekly Report</option>
                <option value="Monthly Report">Monthly Report</option>
                <option value="Custom Report">Custom Report</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-sm outline-none cursor-pointer">
                <option value="all">All Statuses</option>
                <option value="Completed">Completed Only</option>
                <option value="Pending">Pending Only</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800/40 pt-4">
            <button type="submit" className="px-6 py-3.5 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-md">
              <Icon name="refresh" className="text-sm" />
              Generate Summary
            </button>
            {reportGenerated && (
              <button type="button" onClick={handleDownloadPDF} className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-md">
                <Icon name="picture_as_pdf" className="text-sm" />
                Download PDF
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 3. GENERATED REPORT PREVIEW */}
      {generating && (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-450">Filing database logs...</p>
        </div>
      )}

      {reportGenerated && !generating && (
        <div className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
          
          {/* Print Header */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Icon name="school" className="text-3xl text-primary" />
                <h2 className="font-display text-2xl font-black text-slate-800 dark:text-slate-100 tracking-wider">JMMS Summary</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">{reportType} (July 2026)</p>
            </div>
            <div className="text-right text-[10px] font-black uppercase text-slate-400">
              <div>Export Date: {new Date().toISOString().split("T")[0]}</div>
              <div className="mt-1">Generated by: Admin Principal</div>
            </div>
          </div>

          {/* Metric counter grids */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              { label: "Complaints Logged", val: "148 Tickets", color: "text-primary" },
              { label: "Resolution Rate", val: "94.2%", color: "text-emerald-500" },
              { label: "Pending Backlogs", val: "9 Tickets", color: "text-amber-500" },
              { label: "Avg Resolution Time", val: "3.2 Hours", color: "text-sky-500" },
            ].map((metric, idx) => (
              <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{metric.label}</span>
                <span className={`text-2xl font-black mt-2 block ${metric.color}`}>{metric.val}</span>
              </div>
            ))}
          </div>

          {/* Performance Lists / visual mock grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Left: Department Performance */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/40 pb-2">Department Allocations</h4>
              <div className="space-y-3 font-semibold text-xs text-slate-500">
                {[
                  { name: "Electrical Division", tickets: 48, percentage: "88% resolved" },
                  { name: "Plumbing Division", tickets: 36, percentage: "94% resolved" },
                  { name: "Carpentry Division", tickets: 28, percentage: "100% resolved" },
                  { name: "HVAC Operations", tickets: 20, percentage: "90% resolved" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/40">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{item.name}</span>
                    <span className="text-slate-400">{item.tickets} Tickets ({item.percentage})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Technician Output */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/40 pb-2">Technician Output</h4>
              <div className="space-y-3 font-semibold text-xs text-slate-500">
                {[
                  { name: "Rajesh Kumar (Plumber)", score: "★★★★★", rating: "98% compliance" },
                  { name: "S. Murthy (Electrician)", score: "★★★★☆", rating: "92% compliance" },
                  { name: "Amit Pal (Carpenter)", score: "★★★★★", rating: "100% compliance" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850/40">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">{item.name}</span>
                    <span className="text-slate-400">{item.score} ({item.rating})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer warning */}
          <div className="pt-6 border-t border-slate-150 dark:border-slate-800 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            *** End of Generated Report — Jain International Residential School ***
          </div>
        </div>
      )}
    </div>
  );
}
