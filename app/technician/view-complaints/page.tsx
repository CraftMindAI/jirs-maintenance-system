"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

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
              <div className="pt-4 mt-auto space-y-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Icon name="calendar_today" className="text-[12px]" />
                    {complaint.createdAt ? complaint.createdAt.toDate().toLocaleDateString() : (complaint.date ? new Date(complaint.date).toLocaleDateString() : 'N/A')}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                <Link href={`/technician/view-complaints/${complaint.id}`}>
                  <button className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#0f4c81] text-white shadow-lg shadow-blue-900/20 dark:bg-blue-600 hover:brightness-110 transition-all cursor-pointer">
                    View & Update Task <Icon name="arrow_forward" className="text-base" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
