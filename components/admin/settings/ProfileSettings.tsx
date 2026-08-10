"use client";

import { useEffect, useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { showToast } from "@/lib/toast";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileSettings() {
  const [uid, setUid] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setUid(user.uid);
      setEmail(user.email || "");

      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const data = docSnap.exists() ? docSnap.data() : null;
        setFullName(data?.name || user.displayName || "");
        setPhone(data?.phone || "");
        setRole(data?.role || "Administrator");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load your profile details.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    setError(null);
    setProfileSaving(true);

    try {
      await updateDoc(doc(db, "users", uid), {
        name: fullName,
        phone,
      });
      setProfileSaving(false);
      setProfileSaved(true);
      showToast.success("Admin profile updated successfully!");
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setProfileSaving(false);
      const msg = "Failed to save profile changes. Please try again.";
      setError(msg);
      showToast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-300 dark:border-[#464554]/30 border-t-primary dark:border-t-[#8083ff] rounded-full animate-spin" />
      </div>
    );
  }

  const initialLetter = (fullName || email || "A").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#464554]/20 pb-4">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-[#dae2fd]">
            Profile Information
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#908fa0]">
            Update your personal details and contact number.
          </p>
        </div>
        <Icon name="person" className="text-primary dark:text-[#8083ff] text-2xl" />
      </div>

      {/* Sleek Profile Banner Card */}
      <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-sm min-w-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto min-w-0">
          {/* Avatar Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-emerald-500/30 dark:from-[#8083ff]/30 dark:to-[#00a572]/30 border border-primary/40 dark:border-[#8083ff]/40 text-slate-800 dark:text-[#dae2fd] text-2xl font-black flex items-center justify-center shadow-lg shrink-0">
            {initialLetter}
          </div>

          <div className="space-y-1 text-center sm:text-left min-w-0 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start min-w-0">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-[#dae2fd] truncate max-w-full">
                {fullName || "Administrator"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/15 dark:bg-[#8083ff]/15 text-primary dark:text-[#c0c1ff] border border-primary/20 dark:border-[#8083ff]/20 shrink-0">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#908fa0] flex items-center gap-2 justify-center sm:justify-start min-w-0 break-all">
              <Icon name="mail" className="text-sm text-primary dark:text-[#8083ff] shrink-0" />
              <span className="break-all min-w-0">{email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#171f33] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#464554]/20 shrink-0 justify-center sm:justify-start w-full sm:w-auto">
          <Icon name="verified_user" className="text-emerald-600 dark:text-[#00a572] text-lg" />
          <span className="text-xs font-mono text-slate-900 dark:text-[#dae2fd] font-bold">Verified Account</span>
        </div>
      </div>

      {/* Form Fields Section */}
      <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                <Icon name="person" className="text-base" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
              />
            </div>
          </div>

          {/* Email Address Field (Read-only) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              Email Address (Primary Login)
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                <Icon name="mail" className="text-base" />
              </div>
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-100 dark:bg-[#131b2e]/40 border border-slate-200 dark:border-[#464554]/20 text-slate-400 dark:text-[#908fa0] font-semibold outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              Contact Phone
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                <Icon name="phone" className="text-base" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
              />
            </div>
          </div>

          {/* Role Designation Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
              System Role Designation
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                <Icon name="badge" className="text-base" />
              </div>
              <input
                type="text"
                disabled
                value={role}
                className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-100 dark:bg-[#131b2e]/40 border border-slate-200 dark:border-[#464554]/20 text-slate-400 dark:text-[#908fa0] font-semibold outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-4 border-t border-slate-200 dark:border-[#464554]/20 flex flex-col sm:flex-row justify-end items-stretch sm:items-center">
          <button
            type="submit"
            disabled={profileSaving}
            className="w-full sm:w-auto px-6 py-3.5 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 dark:shadow-[#8083ff]/20 text-xs cursor-pointer tracking-wider disabled:opacity-60 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
          >
            {profileSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Icon name="save" className="text-base" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
