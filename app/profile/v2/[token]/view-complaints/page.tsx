"use client";

import { use, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface Complaint {
  id: string;
  ticketNumber?: string;
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

export default function TechnicianViewComplaints({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v2/${token}`;

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
              data.technicianId === currentUser.uid ||
              data.technicianEmail === currentUser.email ||
              data.technicianName === techName
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
      case "High": return "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30";
      case "Medium": return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30";
      case "Low": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Completed" || status === "Closed") return "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30";
    if (status === "In Progress") return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30";
    if (status === "Assigned") return "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30";
    return "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-500/30";
  };

  return (
    <div className="space-y-10 pb-16 max-w-[1440px] mx-auto">
      <title>View Complaints | Technician | JFM</title>

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
        <div className="py-32 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#0f4c81] dark:border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            <Icon name="build" className="absolute text-slate-400 dark:text-slate-500 animate-pulse" />
          </div>
          <p className="font-bold text-sm tracking-widest uppercase text-slate-400 mt-6 animate-pulse">Loading Tasks...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2.5rem] p-8 md:p-16 text-center shadow-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <Icon name="done_all" className="text-5xl text-white" />
          </div>
          <h3 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">All caught up!</h3>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto font-medium leading-relaxed">
            You don&apos;t have any active complaints assigned to you right now. Great job keeping the facilities running smoothly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden">
              
              {/* Subtle hover glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Priority Ribbon */}
              <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-3xl border-b border-l backdrop-blur-sm ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority} Priority
              </div>

              {/* Header */}
              <div className="flex items-start gap-5 mb-6 mt-2 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 text-[#0f4c81] dark:text-blue-400 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-110 group-hover:shadow-blue-500/20 group-hover:border-blue-500/30 transition-all duration-500">
                  <Icon name="handyman" className="text-2xl" />
                </div>
                <div className="pt-1 pr-16 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0f4c81] dark:text-blue-400">
                    Complaint #{complaint.ticketNumber ?? "-"}
                  </span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xl leading-tight line-clamp-1 group-hover:text-[#0f4c81] dark:group-hover:text-blue-400 transition-colors mt-0.5" title={complaint.category}>
                    {complaint.category}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium bg-slate-100 dark:bg-slate-800/50 w-fit px-2.5 py-1 rounded-md">
                    <Icon name="location_on" className="text-[14px]" />
                    <span className="truncate max-w-[120px]">{complaint.location}</span>
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-5 mb-8 flex-1 border border-slate-100 dark:border-slate-800 relative z-10 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors duration-500">
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-medium">
                  {complaint.description || "No description provided."}
                </p>
              </div>

              {/* Footer Details & CTA */}
              <div className="relative z-10 mt-auto flex flex-col gap-5">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Icon name="schedule" className="text-[14px]" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {complaint.createdAt ? complaint.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : (complaint.date ? new Date(complaint.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A')}
                    </span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                <Link href={`${basePath}/view-complaints/${complaint.id}`}>
                  <button className="w-full relative overflow-hidden group/btn flex justify-center items-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transition-all duration-300">
                    <div className="absolute inset-0 bg-[#0f4c81] dark:bg-blue-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10 flex items-center gap-2 group-hover/btn:text-white">
                      {complaint.status === "Verified" || complaint.status === "Closed" ? "View Ticket" : "Resolve Ticket"} <Icon name="arrow_forward" className="text-base group-hover/btn:translate-x-1 transition-transform" />
                    </span>
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
