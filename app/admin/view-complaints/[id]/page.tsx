"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import BackToComplaintsButton from "@/components/admin/view-complaints/detail/BackToComplaintsButton";
import PostedByCard from "@/components/admin/view-complaints/detail/PostedByCard";
import ComplaintInfoCard from "@/components/admin/view-complaints/detail/ComplaintInfoCard";
import ComplaintTrackDetailsCard from "@/components/admin/view-complaints/detail/ComplaintTrackDetailsCard";
import ComplaintImagesCard from "@/components/admin/view-complaints/detail/ComplaintImagesCard";
import ComplaintDetailSkeleton from "@/components/admin/view-complaints/detail/ComplaintDetailSkeleton";
import { showToast } from "@/lib/toast";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";
import { useUserRole } from "@/hooks/useUserRole";
import { approveComplaint, rejectComplaint, verifyComplaint } from "@/utils/admin/complaints";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Icon from "@/components/ui/Icon";

export default function ViewComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const complaintId = resolvedParams.id;
  const router = useRouter();

  const { complaint, poster, images, loading, error } = useComplaintDetail(complaintId);
  const { isAdmin } = useUserRole();

  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  const currentComplaint = complaint
    ? {
        ...complaint,
        status: (statusOverride || complaint.status) as any,
      }
    : null;

  const handleApprove = async () => {
    if (!complaintId) return;
    try {
      setUpdatingStatus(true);
      await approveComplaint(complaintId);
      setStatusOverride("Approved");
      showToast.success("Complaint ticket approved successfully!");
      setTimeout(() => {
        router.push("/admin/view-complaints");
      }, 500);
    } catch (err) {
      console.error("Error approving complaint:", err);
      showToast.error("Failed to approve complaint.");
      setUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    if (!complaintId) return;
    try {
      setUpdatingStatus(true);
      await rejectComplaint(complaintId);
      setStatusOverride("Rejected");
      showToast.warning("Complaint ticket marked as Rejected.");
      setTimeout(() => {
        router.push("/admin/view-complaints");
      }, 500);
    } catch (err) {
      console.error("Error rejecting complaint:", err);
      showToast.error("Failed to reject complaint.");
      setUpdatingStatus(false);
    }
  };

  const handleVerify = async () => {
    if (!complaintId) return;
    try {
      setUpdatingStatus(true);
      await verifyComplaint(complaintId);
      setStatusOverride("Verified");
      showToast.success("Complaint ticket verified and closed.");
      setTimeout(() => {
        router.push("/admin/view-complaints");
      }, 500);
    } catch (err) {
      console.error("Error verifying complaint:", err);
      showToast.error("Failed to verify complaint.");
      setUpdatingStatus(false);
    }
  };

  const handleReopen = async () => {
    if (!complaintId) return;
    try {
      setUpdatingStatus(true);
      await updateDoc(doc(db, "complaints", complaintId), {
        status: "In Progress",
      });
      setStatusOverride("In Progress");
      showToast.info("Complaint status changed back to In Progress.");
      setTimeout(() => {
        router.push("/admin/view-complaints");
      }, 500);
    } catch (err) {
      console.error("Error setting status to In Progress:", err);
      showToast.error("Failed to update status.");
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <title>{`Complaint #${complaintId} | JMMS Admin`}</title>

      {/* Top Header Row with Transparent Back Button */}
      <div className="flex items-center justify-between">
        <BackToComplaintsButton />
        <span className="text-xs font-mono text-[#908fa0]">
          Ticket Details Module
        </span>
      </div>

      {loading ? (
        <ComplaintDetailSkeleton />
      ) : error || !currentComplaint ? (
        <div className="bg-white dark:bg-[#171f33] border border-rose-500/20 dark:border-[#ff516a]/20 rounded-3xl p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 dark:bg-[#ff516a]/10 rounded-full flex items-center justify-center text-rose-500 dark:text-[#ff516a] mx-auto">
            <Icon name="error_outline" className="text-4xl" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-[#dae2fd]">
            {error || "Complaint Not Found"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#908fa0]">
            The requested ticket details could not be retrieved from the database.
          </p>
          <div className="pt-2">
            <BackToComplaintsButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <ComplaintInfoCard
              complaint={currentComplaint}
              isAdmin={isAdmin}
              onApprove={handleApprove}
              onReject={handleReject}
              onVerify={handleVerify}
              onReopen={handleReopen}
              updatingStatus={updatingStatus}
            />
            <ComplaintTrackDetailsCard complaint={currentComplaint} />
          </div>

          {/* Sidebar Modules: Posted By & Images */}
          <div className="space-y-6">
            <PostedByCard poster={poster} />
            <ComplaintImagesCard images={images} />
          </div>
        </div>
      )}
    </div>
  );
}
