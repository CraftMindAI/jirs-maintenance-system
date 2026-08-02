"use client";

import { useEffect, useState, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

interface Complaint {
  id: string;
  category: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  date: string;
  createdAt?: any;
  technicianName?: string;
  technicianEmail?: string;
  remarks?: string;
  [key: string]: any;
}

export default function TechnicianViewComplaints() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfileName, setUserProfileName] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Photo Upload & View State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);
  const [completionRemarks, setCompletionRemarks] = useState("");

  const STATUS_OPTIONS = ["Assigned", "In Progress", "Completed"];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let techName = currentUser.displayName || "";
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().name) {
            techName = userDoc.data().name;
            setUserProfileName(techName);
          }
        } catch (e) {
          console.error("Error fetching user profile:", e);
        }

        const complaintsRef = collection(db, "complaints");
        const unsubscribeSnapshot = onSnapshot(complaintsRef, (snapshot) => {
          const fetchedComplaints: Complaint[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Complaint;
            if (
              data.technicianEmail === currentUser.email || 
              data.technicianName === techName ||
              !data.technicianName
            ) {
              fetchedComplaints.push({ ...data, id: docSnap.id });
            }
          });
          
          fetchedComplaints.sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.toMillis() : new Date(a.date).getTime();
            const timeB = b.createdAt ? b.createdAt.toMillis() : new Date(b.date).getTime();
            return timeB - timeA;
          });
          
          setComplaints(fetchedComplaints);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching complaints:", error);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setComplaints([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleUpdateStatus = async (complaintId: string, newStatus: string) => {
    if (newStatus === "Completed") {
      setSelectedComplaintId(complaintId);
      setShowUploadModal(true);
      return;
    }

    setUpdatingId(complaintId);
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please check your permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmCompletion = async () => {
    if (!selectedComplaintId) return;
    if (!photoFile) {
      alert("Please select a photo to upload before completing the task.");
      return;
    }

    setUploadingPhoto(true);
    try {
      // Convert photo to Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      reader.readAsDataURL(photoFile);
      const base64Photo = await base64Promise;

      // Update Document
      const complaintRef = doc(db, "complaints", selectedComplaintId);
      await updateDoc(complaintRef, { 
        status: "Completed",
        completionPhotoUrl: base64Photo,
        remarks: completionRemarks,
        completedAt: new Date()
      });

      // Cleanup
      setShowUploadModal(false);
      setSelectedComplaintId(null);
      setPhotoFile(null);
      setCompletionRemarks("");
    } catch (error) {
      console.error("Error completing complaint:", error);
      alert("Failed to upload photo or update status.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedComplaintId(null);
    setPhotoFile(null);
    setCompletionRemarks("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      case "Medium": return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Low": return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      default: return "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Completed" || status === "Closed") return "bg-emerald-500 text-white shadow-emerald-500/30";
    if (status === "In Progress") return "bg-[#0f4c81] text-white shadow-[#0f4c81]/30 dark:bg-blue-500 dark:shadow-blue-500/30";
    return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 shadow-slate-200/50";
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1440px] mx-auto">
      <title>View Complaints | Technician | JMMS</title>

      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Assigned Complaints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and update the status of maintenance tasks assigned to you.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0f4c81] dark:border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="font-bold text-sm tracking-widest uppercase">Loading Assignments...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-lg shadow-slate-200/20 dark:shadow-none">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="check_circle_outline" className="text-4xl text-emerald-500" />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">All caught up!</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto">
            You don&apos;t have any active complaints assigned to you right now. Great job keeping the facilities running smoothly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden group">
              
              {/* Priority Ribbon */}
              <div className={`absolute top-0 right-0 px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl border-b border-l ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority} Priority
              </div>

              {/* Header */}
              <div className="flex items-start gap-5 mb-5 mt-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0f4c81]/10 dark:bg-blue-500/10 text-[#0f4c81] dark:text-blue-400 flex items-center justify-center shrink-0 border border-[#0f4c81]/20 dark:border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="build" className="text-2xl" />
                </div>
                <div className="pt-1 pr-16">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight line-clamp-1" title={complaint.category}>
                    {complaint.category}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    <Icon name="location_on" className="text-[14px] text-slate-400" />
                    <span className="truncate">{complaint.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 flex-1 border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {complaint.description || "No description provided."}
                </p>
              </div>

              {/* Footer Controls */}
              <div className="pt-4 mt-auto space-y-5">
                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Icon name="calendar_today" className="text-[12px]" />
                    {complaint.createdAt ? complaint.createdAt.toDate().toLocaleDateString() : (complaint.date ? new Date(complaint.date).toLocaleDateString() : 'N/A')}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                {/* Status Updater */}
                {complaint.status !== "Completed" && complaint.status !== "Closed" && (
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 focus-within:ring-2 ring-[#0f4c81]/20 dark:ring-blue-500/20 transition-all">
                    <div className="flex-1 relative">
                      <select
                        disabled={updatingId === complaint.id}
                        value={complaint.status}
                        onChange={(e) => handleUpdateStatus(complaint.id, e.target.value)}
                        className="w-full bg-transparent appearance-none px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none disabled:opacity-50 cursor-pointer z-10 relative"
                      >
                        <option value={complaint.status} disabled>{complaint.status} (Current)</option>
                        {STATUS_OPTIONS.filter(s => s !== complaint.status).map(opt => (
                          <option key={opt} value={opt}>Update to: {opt}</option>
                        ))}
                      </select>
                      <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    {updatingId === complaint.id && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#0f4c81] dark:border-blue-500 border-t-transparent animate-spin shrink-0 mx-2" />
                    )}
                  </div>
                )}
                
                {(complaint.status === "Completed" || complaint.status === "Closed") && complaint.completionPhotoUrl && (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-3">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <Icon name="image" className="text-lg" />
                      Photo Uploaded
                    </span>
                    <button onClick={() => setViewPhotoUrl(complaint.completionPhotoUrl)} className="text-[10px] font-black uppercase tracking-wider bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                      View
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] w-full max-w-md shadow-2xl relative z-10 animate-fade-in flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">Task Completion</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload a photo to verify completion.</p>
            </div>
            
            <div className="p-8 flex flex-col items-center">
              <div className="w-full mb-6 text-left">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Completion Remarks / Issue Details</label>
                <textarea 
                  value={completionRemarks} 
                  onChange={(e) => setCompletionRemarks(e.target.value)}
                  placeholder="Explain what was fixed, the root cause, or any additional notes..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/50 resize-none dark:text-slate-100"
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
              
              {!photoFile ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-[#0f4c81] dark:hover:border-blue-500 hover:text-[#0f4c81] dark:hover:text-blue-400 transition-all cursor-pointer"
                >
                  <Icon name="add_a_photo" className="text-4xl" />
                  <span className="font-bold text-sm">Click to select photo</span>
                </button>
              ) : (
                <div className="w-full relative group">
                  <img src={URL.createObjectURL(photoFile)} alt="Preview" className="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-700" />
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setPhotoFile(null)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-center text-slate-500 mt-2 font-mono truncate px-4">{photoFile.name}</p>
                </div>
              )}
            </div>
            
            <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                disabled={uploadingPhoto}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmCompletion}
                disabled={!photoFile || uploadingPhoto}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#0f4c81] dark:bg-blue-600 text-white shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all cursor-pointer"
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
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setViewPhotoUrl(null)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] w-full max-w-2xl shadow-2xl relative z-10 animate-fade-in flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100">Completion Photo</h2>
              <button 
                onClick={() => setViewPhotoUrl(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>
            <div className="p-4 flex justify-center bg-slate-50 dark:bg-slate-950 max-h-[70vh] overflow-auto custom-scrollbar">
              <img src={viewPhotoUrl} alt="Completion" className="max-w-full rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
