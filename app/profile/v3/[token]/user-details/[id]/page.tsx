"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { doc, getDoc, collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/ui/StatusBadge";

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface LatestTicket {
  id: string;
  category: string;
  status: string;
  date: string;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("default", { year: "numeric", month: "short", day: "numeric" });
}

export default function UserDetailsPage({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = use(params);
  const basePath = `/profile/v3/${token}`;
  const [user, setUser] = useState<UserDetail | null>(null);
  const [latestTicket, setLatestTicket] = useState<LatestTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const createdAt = data.createdAt as Timestamp | undefined;
          setUser({
            id: userDoc.id,
            name: data.name || "Unnamed User",
            email: data.email || "",
            phone: data.phone || "",
            role: data.role || "Student",
            active: data.active !== false,
            createdAt: createdAt ? createdAt.toDate().toISOString() : "",
          });
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id]);

  const isTechnician = user?.role === "Technician";

  useEffect(() => {
    if (!user) return;

    const complaintsQuery = isTechnician
      ? query(collection(db, "complaints"), where("technicianId", "==", id))
      : query(collection(db, "complaints"), where("userId", "==", id));

    const unsub = onSnapshot(complaintsQuery, (snapshot) => {
      let bestScore = -1;
      let bestAt = -1;
      let latest: LatestTicket | null = null;

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt as Timestamp | undefined;
        const at = createdAt ? createdAt.toMillis() : 0;

        // For technicians, prefer whichever ticket is actively being worked on
        // (In Progress > Assigned > everything else) before falling back to recency.
        const score = isTechnician
          ? data.status === "In Progress"
            ? 2
            : data.status === "Assigned"
              ? 1
              : 0
          : 0;

        if (score > bestScore || (score === bestScore && at > bestAt)) {
          bestScore = score;
          bestAt = at;
          latest = {
            id: docSnap.id,
            category: data.category || "Uncategorized",
            status: data.status || "Pending",
            date: createdAt ? createdAt.toDate().toISOString() : data.date || "",
          };
        }
      });

      setLatestTicket(latest);
    });

    return () => unsub();
  }, [id, user, isTechnician]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#464554]/30 border-t-[#8083ff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-8 md:p-16 text-center shadow-sm">
        <Icon name="person_off" className="text-4xl text-slate-400 dark:text-[#908fa0] mb-3 block mx-auto" />
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-[#dae2fd]">User Not Found</h3>
        <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">This account may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b101d] text-slate-900 dark:text-[#dae2fd] p-6 lg:p-6 md:p-10 space-y-8">
      <title>{user.name} | User Details | JFM Admin</title>

      <div>
        <Link
          href={`${basePath}/user-management`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-[#908fa0] hover:text-primary dark:hover:text-[#c0c1ff] mb-2 transition-colors"
        >
          <Icon name="arrow_back" className="text-sm" />
          Back to User Management
        </Link>
        <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          User Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8083ff] to-[#4edea3] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-xs text-slate-500 dark:text-[#908fa0]">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 dark:border-[#464554]/10">
            <div className="space-y-1">
              <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">Phone</span>
              <span className="font-bold text-slate-800 dark:text-[#dae2fd]">{user.phone || "—"}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">Role</span>
              <span className="font-bold text-slate-800 dark:text-[#dae2fd]">{user.role}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">Registered</span>
              <span className="font-bold text-slate-800 dark:text-[#dae2fd]">{formatDate(user.createdAt)}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">Status</span>
              <span className={`font-bold ${user.active ? "text-emerald-600 dark:text-[#4edea3]" : "text-slate-500 dark:text-[#908fa0]"}`}>
                {user.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Latest Ticket Card */}
        <div className="lg:col-span-2 bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="confirmation_number" className="text-sm text-primary" />
            {isTechnician ? "Latest Ticket Working On" : "Latest Ticket"}
          </h3>

          {latestTicket ? (
            <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-primary dark:text-[#c0c1ff] mb-1">{latestTicket.id}</p>
                <p className="font-bold text-slate-900 dark:text-[#dae2fd] text-base">{latestTicket.category}</p>
                <p className="text-xs text-slate-500 dark:text-[#908fa0] mt-1">{formatDate(latestTicket.date)}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <StatusBadge status={latestTicket.status} />
                <Link
                  href={`${basePath}/view-complaints/${latestTicket.id}`}
                  className="text-xs font-bold text-primary dark:text-[#c0c1ff] hover:underline flex items-center gap-1"
                >
                  View Ticket <Icon name="open_in_new" className="text-sm" />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-[#908fa0]">
              {isTechnician ? "No tickets assigned yet." : "No tickets raised yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
