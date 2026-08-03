"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { useComplaintDetail } from "@/hooks/useComplaintDetail";

// Create a component that consumes the search params
function TrackComplaintContent() {
  const searchParams = useSearchParams();
  const ticketParam = searchParams.get("ticket");

  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    email: string;
  } | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [visibleComplaints, setVisibleComplaints] = useState<any[]>([]);

  // Sync auth state (role decides which complaints this user may see)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          const data = docSnap.exists() ? docSnap.data() : null;
          setUserProfile({
            name: data?.name || user.displayName || "Technician",
            role: data?.role || "Technician",
            email: user.email || "",
          });
          setUserId(user.uid);
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Technician",
            role: "Technician",
            email: "technician@jirs.ac.in",
          });
          setUserId(user.uid);
        }
      } else {
        // Mock fallback for presentation
        setUserProfile({
          name: "Technician",
          role: "Technician",
          email: "technician@jirs.ac.in",
        });
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch complaints assigned to this technician
  useEffect(() => {
    if (!userProfile) return;
    
    const complaintsRef = collection(db, "complaints");
    const unsubscribeSnapshot = onSnapshot(complaintsRef, (snapshot) => {
      const fetchedComplaints: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.technicianEmail === userProfile.email || 
          data.technicianName === userProfile.name ||
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
      
      setVisibleComplaints(fetchedComplaints);
    });

    return () => unsubscribeSnapshot();
  }, [userProfile]);

  // Select ticket: parameter priority -> otherwise keep the current selection
  // if it's still visible, else fall back to the first visible item.
  useEffect(() => {
    if (ticketParam && visibleComplaints.some((c) => c.id === ticketParam)) {
      setSelectedTicketId(ticketParam);
      return;
    }

    const stillVisible = visibleComplaints.some(
      (c) => c.id === selectedTicketId,
    );
    if (!stillVisible) {
      setSelectedTicketId(visibleComplaints[0]?.id || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketParam, visibleComplaints, userProfile]);

  const selectedComplaint =
    visibleComplaints.find((c) => c.id === selectedTicketId) || null;

  const { images: selectedImages } = useComplaintDetail(selectedTicketId);

  const [complainantName, setComplainantName] = useState<string>("Resident / Staff");

  useEffect(() => {
    async function fetchComplainantName() {
      if (!selectedComplaint) return;
      if (selectedComplaint.submittedBy) {
        setComplainantName(selectedComplaint.submittedBy);
        return;
      }
      if (selectedComplaint.userId) {
        try {
          const userDoc = await getDoc(doc(db, "users", selectedComplaint.userId));
          if (userDoc.exists() && userDoc.data().name) {
            setComplainantName(userDoc.data().name);
            return;
          }
        } catch(e) {
          console.error("Error fetching complainant name", e);
        }
      }
      setComplainantName("Resident / Staff");
    }
    fetchComplainantName();
  }, [selectedComplaint]);
  // Timeline steps config — mirrors the real status flow written in utils/admin/complaints.ts
  // (Pending -> Approved -> Assigned -> In Progress -> Completed -> Verified).
  const STEPS = [
    {
      key: "Pending",
      label: "Complaint Submitted",
      desc: "Your ticket has been logged and queued.",
    },
    {
      key: "Approved",
      label: "Approved by Admin",
      desc: "Support confirmed specifications and details.",
    },
    {
      key: "Assigned",
      label: "Technician Assigned",
      desc: "A specialized technician has been allocated.",
    },
    {
      key: "In Progress",
      label: "Work Started",
      desc: "Technician is on-site resolving the problem.",
    },
    {
      key: "Completed",
      label: "Completed",
      desc: "Work completed. Awaiting final verification.",
    }
  ];

  // Helper to determine if a step is active/completed
  const getStepStatus = (statusKey: string, currentStatus: string) => {
    const statusOrder = [
      "Pending",
      "Approved",
      "Assigned",
      "In Progress",
      "Completed",
    ];
    
    let effectiveStatus = currentStatus;
    if (currentStatus === "Verified" || currentStatus === "Closed") {
      effectiveStatus = "Completed";
    }

    const currentIdx = statusOrder.indexOf(effectiveStatus);
    const stepIdx = statusOrder.indexOf(statusKey);

    if (currentIdx >= stepIdx) return "completed";
    if (currentIdx + 1 === stepIdx) return "active";
    return "pending";
  };

  return (
    <div className="space-y-8 pb-12">
      <title>Track Complaint | JMMS</title>

      {/* Header and selector dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Live Ticket Tracking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time resolution pipelines and technician comments.
          </p>
        </div>

        {/* Ticket Selector Dropdown */}
        {visibleComplaints.length > 0 && (
          <div className="w-full md:w-64 space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
              Select Ticket to Track
            </label>
            <div className="relative">
              <select
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 font-body-md text-sm font-bold outline-none focus:border-primary cursor-pointer"
              >
                {visibleComplaints.map((c, idx) => (
                  <option key={c.id} value={c.id}>
                    #{idx + 1} — {c.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {selectedComplaint ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column: Progress Timeline */}
          <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Icon name="route" className="text-primary" />
              Resolution Journey
            </h2>

            {/* Vertical timeline steps */}
            <div className="relative pl-10 space-y-10 py-2">
              {/* Stepper vertical guide line */}
              <div className="absolute top-4 bottom-4 left-[15px] w-[3px] bg-slate-100 dark:bg-slate-800 rounded" />

              {STEPS.map((step, idx) => {
                const status = getStepStatus(
                  step.key,
                  selectedComplaint.status,
                );

                return (
                  <div
                    key={idx}
                    className="relative flex flex-col items-start gap-1 group"
                  >
                    {/* Circle Indicator */}
                    <span
                      className={`absolute left-[-35px] top-[2px] w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                        status === "completed"
                          ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20"
                          : status === "active"
                            ? "bg-white dark:bg-slate-900 border-primary text-primary animate-pulse"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                      }`}
                    >
                      {status === "completed" ? (
                        <Icon name="check" className="text-[16px] font-black" />
                      ) : (
                        idx + 1
                      )}
                    </span>

                    {/* Step details */}
                    <div
                      className={`text-sm font-black uppercase tracking-wide transition-colors ${
                        status === "completed"
                          ? "text-slate-800 dark:text-slate-100"
                          : status === "active"
                            ? "text-primary dark:text-blue-300"
                            : "text-slate-400 dark:text-slate-600"
                      }`}
                    >
                      {step.label}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Ticket Details & Technician Cards */}
          <div className="xl:col-span-4 space-y-6">
            {/* Ticket Information Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Ticket Details
              </h3>
              <div className="space-y-3 font-semibold text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-800 dark:text-slate-100 text-right max-w-[60%] break-words">
                    {selectedComplaint.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400">Urgency</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedComplaint.priority === "High"
                        ? "bg-red-500/10 text-red-500"
                        : selectedComplaint.priority === "Medium"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-slate-500/10 text-slate-500"
                    }`}
                  >
                    {selectedComplaint.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-400">Location</span>
                  <span className="text-slate-800 dark:text-slate-100 text-xs text-right max-w-[150px] sm:max-w-[200px] break-words">
                    {selectedComplaint.location}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Expected ETA</span>
                  <span className="text-slate-800 dark:text-slate-100 text-xs">
                    Within 24 Hours
                  </span>
                </div>
              </div>
            </div>

            {/* Complainant Profile */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Raised By
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 font-black text-lg flex items-center justify-center">
                  {complainantName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                    {complainantName}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <div>
                  <span className="font-bold text-slate-400 uppercase">
                    Submitted On:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 ml-2 font-semibold">
                    {selectedComplaint.date || "N/A"}
                  </span>
                </div>
                {selectedComplaint.remarks && (
                  <div>
                    <span className="font-bold text-slate-400 uppercase">
                      Admin Remarks:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed mt-1">
                      {selectedComplaint.remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Attached Reference Photo(s) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Reference Photo
              </h3>

              {selectedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {selectedImages.map((src, idx) => (
                    <div
                      key={idx}
                      onClick={() => setZoomImage(src)}
                      className="rounded-2xl overflow-hidden aspect-square relative border border-slate-100 dark:border-slate-800/50 group cursor-zoom-in"
                    >
                      <img
                        src={src}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Icon name="zoom_in" className="text-2xl" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                  No attachment provided for this ticket.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-8 md:p-16 text-center shadow-sm">
          <Icon
            name="search_off"
            className="text-4xl text-slate-300 mb-4 block"
          />
          <h3 className="font-display text-xl font-bold">No Ticket Selected</h3>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-xs mx-auto">
            You don&apos;t have any complaints registered right now. Rise one to
            start tracking.
          </p>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-3xl w-full aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-2 border border-white/10 animate-scale-in">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon name="close" />
            </button>
            <img
              src={zoomImage}
              alt="Attachment Zoomed"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackComplaint() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <TrackComplaintContent />
    </Suspense>
  );
}
