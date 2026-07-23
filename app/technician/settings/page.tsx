"use client";

import { useEffect, useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updatePassword, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function TechnicianSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
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

  return (
      <div className="space-y-8 pb-12 max-w-5xl mx-auto">
        <title>Settings | Technician | JMMS</title>

        {/* Header info */}
        <div>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Technician Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal information, contact details, and secure your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        
        {/* Left Side: Navigation Tabs */}
        <div className="md:col-span-3 space-y-2">
          {[
            { key: "profile", label: "Profile Settings", icon: "person" },
            { key: "security", label: "Security & Login", icon: "lock" },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "profile" | "security")}
                className={`w-full flex items-center gap-4 py-3.5 px-4 rounded-2xl font-bold transition-all text-sm cursor-pointer ${
                  active
                    ? "bg-white dark:bg-slate-900 text-primary border border-slate-200 dark:border-slate-800 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/30"
                }`}
              >
                <Icon name={tab.icon} className="text-xl" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab panel Container */}
        <div className="md:col-span-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
          
          {/* TAB 1: PROFILE FORM */}
          {activeTab === "profile" && (
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

              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/40">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 text-primary text-3xl font-black flex items-center justify-center relative">
                  {fullName ? fullName.charAt(0).toUpperCase() : <Icon name="person" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg leading-tight">
                    {fullName || "Technician"}
                  </h3>
                  <span className="text-xs text-slate-400 mt-1 block">{role} • {department}</span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fullname" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Full Name
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      disabled
                      value={email}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="dept" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Department / Expertise
                    </label>
                    <input
                      id="dept"
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    System Role Designation
                  </label>
                  <input
                    id="role"
                    type="text"
                    disabled
                    value={role}
                    className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 outline-none"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/40">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex-1 py-3.5 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all text-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {profileSaving ? "Saving changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY PASSWORD RESET */}
          {activeTab === "security" && (
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

              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800/40 pb-4">
                Update Security Credentials
              </h3>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                
                {/* New password */}
                <div className="space-y-1.5">
                  <label htmlFor="newpass" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newpass"
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none focus:border-primary transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Icon name={showNew ? "visibility_off" : "visibility"} className="text-xl" />
                    </button>
                  </div>

                  {/* Password strength meter bar */}
                  {newPassword && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className={`uppercase font-black ${
                          strength.label === "Weak" ? "text-red-500" :
                          strength.label === "Medium" ? "text-amber-500" :
                          "text-emerald-500"
                        }`}>{strength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} transition-all duration-300`}
                          style={{ width: `${(strength.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmpass" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmpass"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 outline-none focus:border-primary transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Icon name={showConfirm ? "visibility_off" : "visibility"} className="text-xl" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/40">
                  <button
                    type="submit"
                    disabled={securityUpdating}
                    className="flex-1 py-3.5 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all text-xs cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {securityUpdating ? "Updating password..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
