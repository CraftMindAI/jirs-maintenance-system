"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Dropdown, { DropdownOption } from "@/components/ui/Dropdown";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";
import ComplaintTrackDetailsCard from "@/components/admin/view-complaints/detail/ComplaintTrackDetailsCard";
import ComplaintDetailSkeleton from "@/components/admin/view-complaints/detail/ComplaintDetailSkeleton";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { compressImageToBase64 } from "@/lib/image";

export default function TechnicianComplaintDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const complaintId = resolvedParams.id;

  const { complaint, images, loading, error, setComplaint } = useComplaintDetail(complaintId);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [completionRemarks, setCompletionRemarks] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusOptions = (currentStatus: string): DropdownOption[] => {
    if (currentStatus === "Assigned") {
      return [
        { value: "In Progress", label: "In Progress" },
        { value: "Completed", label: "Completed" },
      ];
    }
    if (currentStatus === "In Progress") {
      return [{ value: "Completed", label: "Completed" }];
    }
    return [];
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!complaint) return;
    if (newStatus === "Completed") {
      setShowUploadModal(true);
      return;
    }

    setUpdatingStatus(true);
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, { status: newStatus });
      setComplaint((prev) => (prev ? { ...prev, status: newStatus as typeof prev.status } : prev));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please check your permissions.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmCompletion = async () => {
    if (!photoFile && !complaint?.completionPhotoUrl) {
      alert("Please select a photo to upload before completing the task.");
      return;
    }

    setUploadingPhoto(true);
    try {
      let base64Photo = complaint?.completionPhotoUrl || "";
      if (photoFile) {
        base64Photo = await compressImageToBase64(photoFile);
      }

      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        status: "Completed",
        completionPhotoUrl: base64Photo,
        remarks: completionRemarks,
        completedAt: new Date()
      });
      setComplaint((prev) =>
        prev
          ? { ...prev, status: "Completed", completionPhotoUrl: base64Photo, remarks: completionRemarks }
          : prev,
      );

      setShowUploadModal(false);
      setPhotoFile(null);
      setCompletionRemarks("");
    } catch (err) {
      console.error("Error completing complaint:", err);
      alert("Failed to upload photo or update status.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditCompletion = () => {
    setCompletionRemarks(complaint?.remarks || "");
    setPhotoFile(null);
    setShowUploadModal(true);
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setPhotoFile(null);
    setCompletionRemarks("");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <ComplaintDetailSkeleton />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        <div className="bg-white dark:bg-[#171f33] border border-rose-500/20 dark:border-[#ff516a]/20 rounded-3xl p-6 md:p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 dark:bg-[#ff516a]/10 rounded-full flex items-center justify-center text-rose-500 dark:text-[#ff516a] mx-auto">
            <Icon name="error_outline" className="text-4xl" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-[#dae2fd]">
            Complaint Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-[#908fa0]">
            The ticket you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/technician/view-complaints">
            <button className="mt-4 px-6 py-2.5 bg-slate-100 dark:bg-[#131b2e] hover:bg-slate-200 dark:hover:bg-[#131b2e]/80 text-slate-700 dark:text-[#dae2fd] rounded-xl font-bold text-sm transition-colors cursor-pointer">
              Back to Assigned Complaints
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <title>{`Task #${complaintId} | Technician | JMMS`}</title>

      {/* Top Header Row with Transparent Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/technician/view-complaints">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-[#908fa0] hover:bg-slate-100 dark:hover:bg-[#171f33] hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all font-bold text-sm cursor-pointer">
            <Icon name="arrow_back" className="text-lg" />
            <span>Back to List</span>
          </button>
        </Link>
        <span className="text-xs font-mono text-[#908fa0]">
          Task Detail Module
        </span>
      </div>

      <div className="space-y-6">
        {/* Main Task Card */}
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-slate-800 dark:text-[#dae2fd] leading-tight">
                {complaint.category}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="px-3 py-1 bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-[#908fa0] rounded-lg text-xs font-mono border border-slate-200 dark:border-[#464554]/30">
                  ID: {complaint.id}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-[#908fa0]">
                  <Icon name="event" className="text-sm" />
                  {complaint.date ? new Date(complaint.date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm shrink-0
              ${complaint.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-[#ff516a]/10 dark:text-[#ff516a] dark:border-[#ff516a]/20' : 
                complaint.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : 
                'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-[#00a572]/10 dark:text-[#00a572] dark:border-[#00a572]/20'}`}
            >
              {complaint.priority} Priority
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-100 dark:border-[#464554]/20 rounded-2xl p-4 md:p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-[#8083ff]/20 text-blue-600 dark:text-[#8083ff] flex items-center justify-center shrink-0">
              <Icon name="location_on" className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#908fa0] block mb-1">
                Task Location
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-[#dae2fd]">
                {complaint.location}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#908fa0]">
              Task Description
            </span>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {complaint.description || "No description provided."}
            </div>
          </div>

          {/* Evidence Images */}
          {images && images.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-[#464554]/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#908fa0] mb-3 block">
                Attached Evidence
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((url: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setViewPhotoUrl(url)}
                    className="shrink-0 relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 cursor-pointer block"
                  >
                    <img 
                      src={url} 
                      alt={`Evidence ${idx + 1}`} 
                      className="w-24 h-24 object-cover block"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="zoom_in" className="text-white text-xl" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Completion Photo (if already completed) */}
          {(complaint.status === "Completed" || complaint.status === "Closed") && complaint.completionPhotoUrl && (
            <div className="pt-4 border-t border-slate-100 dark:border-[#464554]/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#908fa0] mb-3 block">
                Completion Evidence
              </span>
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon name="image" className="text-xl" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Photo Uploaded</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">Verified completion evidence.</p>
                  </div>
                </div>
                <button onClick={() => setViewPhotoUrl(complaint.completionPhotoUrl!)} className="text-xs font-black uppercase tracking-wider bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-sm">
                  View Photo
                </button>
              </div>
              {complaint.remarks && (
                 <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <span className="font-bold block mb-1">Completion Remarks:</span>
                   {complaint.remarks}
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Action Card */}
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm">
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-[#dae2fd] mb-4 flex items-center gap-2">
            <Icon name="update" className="text-[#0f4c81] dark:text-[#8083ff]" />
            Update Task Status
          </h3>
          
          {complaint.status === "Verified" || complaint.status === "Closed" ? (
            <div className="bg-emerald-50 dark:bg-[#00a572]/10 border border-emerald-200 dark:border-[#00a572]/20 rounded-2xl p-4 text-center max-w-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-[#00a572]/20 text-emerald-600 dark:text-[#00a572] rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="verified" className="text-2xl" />
              </div>
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Ticket is Closed</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">This task has been verified and closed by the admin.</p>
            </div>
          ) : complaint.status === "Completed" ? (
            <div className="bg-emerald-50 dark:bg-[#00a572]/10 border border-emerald-200 dark:border-[#00a572]/20 rounded-2xl p-4 text-center max-w-lg space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-[#00a572]/20 text-emerald-600 dark:text-[#00a572] rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name="task_alt" className="text-2xl" />
              </div>
              <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Task Completed</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">This task is fully resolved and awaiting admin verification.</p>
              <button
                onClick={handleEditCompletion}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <Icon name="edit" className="text-sm" />
                Edit Remarks / Reupload Photo
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-lg">
              <p className="text-xs text-slate-500 dark:text-[#908fa0]">
                Select a new status below to reflect your current progress on this task.
              </p>
              <div className={updatingStatus ? "opacity-50 pointer-events-none" : ""}>
                <Dropdown
                  options={getStatusOptions(complaint.status)}
                  value=""
                  onChange={handleUpdateStatus}
                  placeholder={`${complaint.status} — select new status`}
                />
              </div>

              {updatingStatus && (
                 <div className="flex items-center gap-2 text-xs text-[#0f4c81] dark:text-[#8083ff] font-bold animate-pulse">
                   <Icon name="sync" className="animate-spin" /> Updating Status...
                 </div>
              )}
            </div>
          )}
        </div>

        <ComplaintTrackDetailsCard complaint={complaint as any} />
      </div>

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/20 rounded-[2rem] w-full max-w-md shadow-2xl relative z-10 animate-fade-in flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-[#464554]/20">
              <h2 className="font-display text-xl font-bold text-slate-800 dark:text-[#dae2fd]">Task Completion</h2>
              <p className="text-sm text-slate-500 dark:text-[#908fa0] mt-1">Upload a photo to verify completion.</p>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="w-full mb-6 text-left">
                <label className="block text-xs font-bold text-slate-500 dark:text-[#908fa0] uppercase tracking-widest mb-2">Completion Remarks / Notes</label>
                <textarea 
                  value={completionRemarks} 
                  onChange={(e) => setCompletionRemarks(e.target.value)}
                  placeholder="Explain what was fixed..."
                  className="w-full bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8083ff]/50 resize-none dark:text-slate-100"
                  rows={3}
                />
              </div>

              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
              />
              
              {!photoFile && complaint?.completionPhotoUrl ? (
                <div className="w-full relative group">
                  <img src={complaint.completionPhotoUrl} alt="Current completion photo" className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-[#464554]/20" />
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
                    >
                      Replace Photo
                    </button>
                  </div>
                  <p className="text-xs text-center text-slate-500 dark:text-[#908fa0] mt-2 font-mono">Current completion photo</p>
                </div>
              ) : !photoFile ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-[#464554]/40 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-[#908fa0] hover:bg-slate-50 dark:hover:bg-[#131b2e] hover:border-[#0f4c81] dark:hover:border-[#8083ff] hover:text-[#0f4c81] dark:hover:text-[#8083ff] transition-all cursor-pointer"
                >
                  <Icon name="add_a_photo" className="text-4xl" />
                  <span className="font-bold text-sm">Click to select photo</span>
                </button>
              ) : (
                <div className="w-full relative group">
                  <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-[#464554]/20" />
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setPhotoFile(null)}
                      className="bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors"
                    >
                      Remove & Reselect
                    </button>
                  </div>
                  <p className="text-xs text-center text-slate-500 dark:text-[#908fa0] mt-2 font-mono truncate px-4">{photoFile.name}</p>
                </div>
              )}
            </div>
            
            <div className="px-8 py-5 bg-slate-50 dark:bg-[#131b2e] border-t border-slate-100 dark:border-[#464554]/20 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                disabled={uploadingPhoto}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmCompletion}
                disabled={(!photoFile && !complaint?.completionPhotoUrl) || uploadingPhoto}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold vibrant-gradient text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all cursor-pointer"
              >
                {uploadingPhoto ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" className="text-lg" />
                    Confirm Completion
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Photo Modal */}
      {viewPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setViewPhotoUrl(null)} />
          <div className="bg-transparent w-full max-w-4xl relative z-10 animate-fade-in flex flex-col">
             <button 
                onClick={() => setViewPhotoUrl(null)}
                className="self-end mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md transition-colors border border-white/20"
              >
                <Icon name="close" className="text-2xl" />
              </button>
            <div className="flex justify-center">
              <img src={viewPhotoUrl} alt="Completion" className="max-w-full max-h-[80vh] rounded-xl shadow-2xl object-contain border border-white/10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
