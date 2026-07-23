"use client";

import { useEffect, useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile states
  const [fullName, setFullName] = useState("Siddharth Roy");
  const [email, setEmail] = useState("siddharth.r@jirs.ac.in");
  const [phone, setPhone] = useState("+91 99001 12233");
  const [department, setDepartment] = useState("Hostel Block B");
  const [role, setRole] = useState("Student");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [securityUpdating, setSecurityUpdating] = useState(false);
  const [securityUpdated, setSecurityUpdated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sync profile details on mount
  useEffect(() => {
    const stored = localStorage.getItem("jmms_profile");
    if (stored) {
      const data = JSON.parse(stored);
      setFullName(data.name || "Siddharth Roy");
      setEmail(data.email || "siddharth.r@jirs.ac.in");
      setPhone(data.phone || "+91 99001 12233");
      setDepartment(data.department || "Hostel Block B");
      setRole(data.role || "Student");
    }
  }, []);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);

    setTimeout(() => {
      const updated = { name: fullName, email, phone, department, role };
      localStorage.setItem("jmms_profile", JSON.stringify(updated));
      
      // Also update the global custom event so the layout shell can re-render if it listens, 
      // or at least updates the localStorage values.
      setProfileSaving(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }, 1200);
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

  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setSecurityUpdating(true);
    setTimeout(() => {
      setSecurityUpdating(false);
      setSecurityUpdated(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSecurityUpdated(false), 2000);
    }, 1500);
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <title>Settings | JMMS</title>

      {/* Header info */}
      <div>
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update your profile contact coordinates or configure security login details.
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

              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/40">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 text-primary text-3xl font-black flex items-center justify-center relative">
                  {fullName.charAt(0).toUpperCase()}
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary hover:bg-opacity-95 text-white flex items-center justify-center border border-white dark:border-slate-900 cursor-pointer shadow-md">
                    <Icon name="photo_camera" className="text-sm" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg leading-tight">{fullName}</h3>
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
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100"
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
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="dept" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Department / Location
                    </label>
                    <input
                      id="dept"
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100"
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
                    className="flex-1 py-3.5 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all text-xs cursor-pointer scale-100 active:scale-95"
                  >
                    {profileSaving ? "Saving changes..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFullName("Siddharth Roy");
                      setEmail("siddharth.r@jirs.ac.in");
                      setPhone("+91 99001 12233");
                      setDepartment("Hostel Block B");
                    }}
                    className="px-6 border border-slate-200 dark:border-slate-800 text-slate-500 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer"
                  >
                    Cancel
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
                Update Portal Password
              </h3>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {/* Current password */}
                <div className="space-y-1.5">
                  <label htmlFor="currentpass" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="currentpass"
                      type={showCurrent ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Icon name={showCurrent ? "visibility_off" : "visibility"} className="text-xl" />
                    </button>
                  </div>
                </div>

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
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100 pr-12"
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
                      className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100 pr-12"
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
                    className="flex-1 py-3.5 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all text-xs cursor-pointer scale-100 active:scale-95"
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
