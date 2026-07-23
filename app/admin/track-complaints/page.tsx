"use client";

import { useEffect, useState } from "react";
import { Complaint } from "../../dashboard/page";
import PageHeader from "@/components/admin/track-complaints/PageHeader";
import SearchFilterBar from "@/components/admin/track-complaints/SearchFilterBar";
import TimelineList from "@/components/admin/track-complaints/TimelineList";

export default function AdminTrackComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("jmms_complaints");
    if (stored) {
      setComplaints(JSON.parse(stored));
    }
  }, []);

  const filtered = complaints.filter((c) => {
    const matchQuery =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      <title>Technician Audit | JMMS Admin</title>

      <PageHeader />

      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TimelineList complaints={filtered} />
    </div>
  );
}
