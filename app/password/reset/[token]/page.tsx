"use client";

import { useEffect, useState, use, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Icon from "@/components/ui/Icon";
import { decryptResetToken } from "@/utils/crypto";

export default function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();

  const [verifying, setVerifying] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userFound, setUserFound] = useState(false);
  const [invalidReason, setInvalidReason] = useState<string | null>(null);

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyAndFindUser() {
      setVerifying(true);
      try {
        const res = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok || !data.exists) {
          setUserFound(false);
          setInvalidReason(data.error || "Invalid reset link or unregistered user email.");
        } else {
          setUserEmail(data.email);
          setUserName(data.name);
          setUserFound(true);
        }
      } catch (err: any) {
        console.error("Token verification error:", err);
        setUserFound(false);
        setInvalidReason("Failed to process reset link.");
      } finally {
        setVerifying(false);
      }
    }

    verifyAndFindUser();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: userEmail,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      setSuccess(true);
    } catch (err: any) {
      console.error("Error submitting password reset:", err);
      setErrorMsg(err.message || "An error occurred while resetting your password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Logo / Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center mx-auto shadow-lg shadow-primary/25">
            <Icon name="lock_reset" className="text-2xl text-white" />
          </div>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">
            JMMS Password Reset
          </h1>
          <p className="text-xs text-slate-400">
            Secure password modification portal
          </p>
        </div>

        {/* Verifying Spinner */}
        {verifying && (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Verifying reset token and user account...</p>
          </div>
        )}

        {/* Invalid Token / User Not Found */}
        {!verifying && !userFound && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center space-y-4">
            <Icon name="error_outline" className="text-3xl text-red-400 mx-auto block" />
            <div>
              <h3 className="font-bold text-sm text-red-300">Link Invalid or Unregistered Email</h3>
              <p className="text-xs text-red-200/80 mt-1">{invalidReason}</p>
            </div>
            <Link
              href="/login"
              className="inline-block px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors"
            >
              Return to Login
            </Link>
          </div>
        )}

        {/* Password Reset Success Screen */}
        {!verifying && userFound && success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-4">
            <Icon name="check_circle" className="text-4xl text-emerald-400 mx-auto block" />
            <div>
              <h3 className="font-bold text-lg text-emerald-300">Password Reset Complete!</h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                Your password for <strong>{userEmail}</strong> has been updated successfully.
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Proceed to Login
            </button>
          </div>
        )}

        {/* Reset Password Form */}
        {!verifying && userFound && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Read-Only Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                User Email Address (Read-Only)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userEmail || ""}
                  readOnly
                  disabled
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-bold text-slate-300 cursor-not-allowed opacity-90 select-all focus:outline-none"
                />
                <Icon name="lock" className="text-slate-500 absolute right-3.5 top-3.5 text-sm" />
              </div>
            </div>

            {/* New Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-medium text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-medium text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
