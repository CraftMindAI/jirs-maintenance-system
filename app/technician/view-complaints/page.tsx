"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

interface Complaint {
  id: string;
  category: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  date: string;
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

  // Status options for the technician to update
  const STATUS_OPTIONS = ["Assigned", "In Progress", "Completed"];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch technician's name from their profile to match against assigned complaints
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

        // Setup real-time listener for complaints
        // Note: For MVP we fetch all and filter client-side to avoid index requirement issues,
        // or we can query if we are sure about the field. We will fetch all and filter to be safe 
        // if the assignment uses name or email.
        const complaintsRef = collection(db, "complaints");
        const unsubscribeSnapshot = onSnapshot(complaintsRef, (snapshot) => {
          const fetchedComplaints: Complaint[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Complaint;
            // Filter: Only show complaints assigned to this technician
            if (
              data.technicianEmail === currentUser.email || 
              data.technicianName === techName ||
              !data.technicianName // optionally show unassigned if you want a pool, but we stick to assigned
            ) {
              fetchedComplaints.push({ ...data, id: docSnap.id });
            }
          });
          
          // Sort by date descending
          fetchedComplaints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
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
    setUpdatingId(complaintId);
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, { status: newStatus });
      // UI will update automatically via onSnapshot
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please check your permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Low": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Completed" || status === "Closed") return "bg-emerald-500 text-white";
    if (status === "In Progress") return "bg-blue-500 text-white";
    return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  };

  return (
      <div className="space-y-8 pb-12 max-w-6xl mx-auto px-4 md:px-8">
        <title>View Complaints | Technician | JMMS</title>

        {/* Header info */}
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Assigned Complaints
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and update the status of maintenance tasks assigned to you.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
            <p className="font-bold animate-pulse">Loading assignments...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-16 text-center shadow-sm">
            <Icon name="check_circle_outline" className="text-6xl text-emerald-400 mb-4 block mx-auto" />
            <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">All caught up!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              You don&apos;t have any active complaints assigned to you right now. Great job keeping the facilities running smoothly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
                
                {/* Priority Indicator Ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority} Priority
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon name="build" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight line-clamp-1" title={complaint.category}>
                      {complaint.category}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Icon name="location_on" className="text-[14px]" />
                      <span className="truncate">{complaint.location}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-1">
                  {complaint.description || "No description provided."}
                </p>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">{new Date(complaint.date).toLocaleDateString()}</span>
                    <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>

                  {/* Status Updater */}
                  <div className="flex items-center gap-2">
                    <select
                      disabled={updatingId === complaint.id}
                      value={complaint.status}
                      onChange={(e) => handleUpdateStatus(complaint.id, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-primary disabled:opacity-50 cursor-pointer"
                    >
                      <option value={complaint.status} disabled>{complaint.status} (Current)</option>
                      {STATUS_OPTIONS.filter(s => s !== complaint.status).map(opt => (
                        <option key={opt} value={opt}>Update to: {opt}</option>
                      ))}
                    </select>
                    {updatingId === complaint.id && (
                      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
  );
}
