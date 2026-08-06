"use client";

import { useEffect, useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updatePassword, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function TechnicianSettings() {
  const [user, setUser] = useState<User | null>(null);

  // Profile states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Maintenance");
  const [role, setRole] = useState("Technician");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Security states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [securityUpdating, setSecurityUpdating] = useState(false);
  const [securityUpdated, setSecurityUpdated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Listen to auth state and fetch profile from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setEmail(currentUser.email || "");

        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFullName(data.name || "");
            setPhone(data.phone || "");
            setDepartment(data.department || "Maintenance");
            setRole(data.role || "Technician");
          } else {
            // Document doesn't exist yet, populate with auth defaults
            setFullName(currentUser.displayName || "");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfileError("Failed to load profile details.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileSaving(true);
    setProfileError(null);
    setProfileSaved(false);

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: fullName,
        email: email,
        phone: phone,
        department: department,
        role: role,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setProfileError(error.message || "An error occurred while saving.");
    } finally {
      setProfileSaving(false);
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "None", color: "bg-slate-200" };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score, label: "Medium", color: "bg-amber-500" };
    return { score, label: "Strong", color: "bg-emerald-500" };
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSecurityUpdated(false);

    if (!user) {
      setPasswordError("You must be logged in to update your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setSecurityUpdating(true);

    try {
      await updatePassword(user, newPassword);
      setSecurityUpdated(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSecurityUpdated(false), 3000);
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === 'auth/requires-recent-login') {
        setPasswordError("This action requires a recent login. Please log out and log back in to change your password.");
      } else {
        setPasswordError(error.message || "Failed to update password.");
      }
    } finally {
      setSecurityUpdating(false);
    }
  };

  const strength = getPasswordStrength();
  const initialLetter = (fullName || email || "T").charAt(0).toUpperCase();

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <title>Settings | Technician | JFM</title>

      {/* Header info */}
      <div>
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Technician Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information, contact details, and secure your account.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Profile Information */}
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden dark:vibrant-shadow">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#464554]/20 pb-4 mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                Profile Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#908fa0]">
                Update your personal details and professional designation.
              </p>
            </div>
            <Icon name="person" className="text-primary dark:text-[#8083ff] text-2xl" />
          </div>

          <div className="space-y-6">
            {profileSaved && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
                <Icon name="check_circle" />
                Profile details updated successfully!
              </div>
            )}

            {profileError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
                <Icon name="error" />
                {profileError}
              </div>
            )}

            {/* Sleek Profile Banner Card */}
            <div className="bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                {/* Avatar Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-emerald-500/30 dark:from-[#8083ff]/30 dark:to-[#00a572]/30 border border-primary/40 dark:border-[#8083ff]/40 text-slate-800 dark:text-[#dae2fd] text-2xl font-black flex items-center justify-center shadow-lg shrink-0">
                  {initialLetter}
                </div>

                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-[#dae2fd]">
                      {fullName || "Technician"}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/15 dark:bg-[#8083ff]/15 text-primary dark:text-[#c0c1ff] border border-primary/20 dark:border-[#8083ff]/20">
                      {role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#908fa0] flex items-center gap-2 justify-center sm:justify-start">
                    <Icon name="mail" className="text-sm text-primary dark:text-[#8083ff]" />
                    <span>{email}</span>
                  </p>
                </div>
              </div>


            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name Field */}
                <div className="space-y-1.5">
                  <label htmlFor="fullname" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                      <Icon name="person" className="text-base" />
                    </div>
                    <input
                      id="fullname"
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
                  <label htmlFor="email" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                    Email Address (Primary Login)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                      <Icon name="mail" className="text-base" />
                    </div>
                    <input
                      id="email"
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
                  <label htmlFor="phone" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                      <Icon name="phone" className="text-base" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Department Field */}
                <div className="space-y-1.5">
                  <label htmlFor="dept" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                    Department / Expertise
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                      <Icon name="business" className="text-base" />
                    </div>
                    <input
                      id="dept"
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Maintenance"
                      className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Role Designation Field */}
              <div className="space-y-1.5">
                <label htmlFor="role" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                  System Role Designation
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                    <Icon name="badge" className="text-base" />
                  </div>
                  <input
                    id="role"
                    type="text"
                    disabled
                    value={role}
                    className="w-full rounded-xl pl-10 pr-4 py-3 text-xs bg-slate-100 dark:bg-[#131b2e]/40 border border-slate-200 dark:border-[#464554]/20 text-slate-400 dark:text-[#908fa0] font-semibold outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Button Row */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#464554]/20 flex justify-end">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-3.5 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 dark:shadow-[#8083ff]/20 text-xs cursor-pointer tracking-wider disabled:opacity-60 flex items-center gap-2 hover:scale-[1.01] transition-transform"
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
        </div>

        {/* Section 2: Security & Password Update */}
        <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden dark:vibrant-shadow">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#464554]/20 pb-4 mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-[#dae2fd]">
                Security & Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#908fa0]">
                Update your login password and review active account security settings.
              </p>
            </div>
            <Icon name="lock" className="text-primary dark:text-[#8083ff] text-2xl" />
          </div>

          <div className="space-y-6">
            {securityUpdated && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
                <Icon name="check_circle" />
                Password updated successfully!
              </div>
            )}

            {passwordError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
                <Icon name="error" />
                {passwordError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-5 pt-2">

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="newpass" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                    <Icon name="key" className="text-base" />
                  </div>
                  <input
                    id="newpass"
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="w-full rounded-xl pl-10 pr-12 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0] hover:text-slate-800 dark:hover:text-[#dae2fd] p-1 cursor-pointer"
                  >
                    <Icon name={showNew ? "visibility_off" : "visibility"} className="text-base" />
                  </button>
                </div>

                {/* Password strength meter bar */}
                {newPassword && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">Password Strength:</span>
                      <span className={`uppercase font-black ${strength.label === "Weak" ? "text-red-500" :
                        strength.label === "Medium" ? "text-amber-500" :
                          "text-emerald-500"
                        }`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-[#131b2e]/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="confirmpass" className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
                    <Icon name="lock_reset" className="text-base" />
                  </div>
                  <input
                    id="confirmpass"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl pl-10 pr-12 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0] hover:text-slate-800 dark:hover:text-[#dae2fd] p-1 cursor-pointer"
                  >
                    <Icon name={showConfirm ? "visibility_off" : "visibility"} className="text-base" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#464554]/20 flex justify-end">
                <button
                  type="submit"
                  disabled={securityUpdating}
                  className="px-6 py-3.5 vibrant-gradient text-white rounded-xl font-bold shadow-lg shadow-primary/20 dark:shadow-[#8083ff]/20 text-xs cursor-pointer tracking-wider disabled:opacity-60 flex items-center gap-2 hover:scale-[1.01] transition-transform"
                >
                  {securityUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="shield" className="text-base" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
