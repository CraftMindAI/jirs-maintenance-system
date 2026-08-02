"use client";

import { useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { auth } from "@/lib/firebase";
import { showToast } from "@/lib/toast";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Your current password is incorrect.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/weak-password":
        return "New password should be at least 6 characters.";
      case "auth/requires-recent-login":
        return "Please sign out and sign in again before changing your password.";
      default:
        return `Something went wrong (${error.code}). Please try again.`;
    }
  }
  return "Something went wrong. Please try again.";
}

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [securityUpdating, setSecurityUpdating] = useState(false);

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

    const user = auth.currentUser;
    if (!user || !user.email) {
      showToast.error("You must be signed in to update your password.");
      return;
    }

    if (currentPassword === newPassword) {
      showToast.warning("New password cannot be the same as your current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.warning("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      showToast.warning("Password must be at least 6 characters.");
      return;
    }

    setSecurityUpdating(true);

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSecurityUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast.success("Password updated successfully!");
    } catch (err) {
      console.error("Error updating password:", err);
      setSecurityUpdating(false);
      showToast.error(friendlyError(err));
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#464554]/20 pb-4">
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

      <form onSubmit={handleUpdatePassword} className="space-y-5">
        {/* Current Password Field */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
              <Icon name="lock" className="text-base" />
            </div>
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full rounded-xl pl-10 pr-12 py-3 text-xs bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-[#464554]/20 text-slate-800 dark:text-[#dae2fd] font-semibold outline-none focus:border-primary dark:focus:border-[#8083ff] focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#8083ff]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0] hover:text-slate-800 dark:hover:text-[#dae2fd] p-1 cursor-pointer"
            >
              <Icon name={showCurrent ? "visibility_off" : "visibility"} className="text-base" />
            </button>
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
              <Icon name="key" className="text-base" />
            </div>
            <input
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
                <span className="text-slate-400 dark:text-[#908fa0]">Password Strength:</span>
                <span
                  className={`uppercase font-black ${
                    strength.label === "Weak"
                      ? "text-red-500"
                      : strength.label === "Medium"
                        ? "text-amber-500"
                        : "text-emerald-500"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-[#131b2e] rounded-full overflow-hidden">
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
          <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-[#908fa0] tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#908fa0]">
              <Icon name="lock_reset" className="text-base" />
            </div>
            <input
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
  );
}
