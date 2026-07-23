"use client";

import { useState, FormEvent } from "react";
import Icon from "@/components/ui/Icon";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [securityUpdating, setSecurityUpdating] = useState(false);
  const [securityUpdated, setSecurityUpdated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "None", color: "bg-[#464554]" };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-[#ff516a]" };
    if (score <= 4) return { score, label: "Medium", color: "bg-amber-400" };
    return { score, label: "Strong", color: "bg-[#4edea3]" };
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
    <div className="space-y-6">
      {securityUpdated && (
        <div className="p-4 bg-[#00a572]/10 border border-[#00a572]/20 text-[#4edea3] rounded-2xl text-xs font-bold flex items-center gap-3 animate-fade-in">
          <Icon name="check_circle" /> Password updated successfully!
        </div>
      )}

      {passwordError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold flex items-center gap-3 animate-fade-in">
          <Icon name="error" /> {passwordError}
        </div>
      )}

      <h3 className="font-display text-base font-bold text-[#dae2fd] border-b border-[#464554]/20 pb-3">
        Security & Password Update
      </h3>

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none pr-12 focus:border-[#8083ff]"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#908fa0]">
              <Icon name={showCurrent ? "visibility_off" : "visibility"} className="text-lg" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none pr-12 focus:border-[#8083ff]"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#908fa0]">
              <Icon name={showNew ? "visibility_off" : "visibility"} className="text-lg" />
            </button>
          </div>

          {newPassword && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-[#908fa0]">Strength:</span>
                <span className="uppercase text-[#dae2fd]">{strength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-[#131b2e] rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 5) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase text-[#908fa0]">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-xs bg-[#131b2e] border border-[#464554]/20 text-[#dae2fd] font-semibold outline-none pr-12 focus:border-[#8083ff]"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#908fa0]">
              <Icon name={showConfirm ? "visibility_off" : "visibility"} className="text-lg" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={securityUpdating}
          className="w-full py-3.5 vibrant-gradient text-white rounded-xl font-bold text-xs shadow-lg shadow-[#8083ff]/20 uppercase tracking-wider cursor-pointer"
        >
          {securityUpdating ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
