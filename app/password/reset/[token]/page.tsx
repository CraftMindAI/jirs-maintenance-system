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

  useEffect(() => {
    if (verifying || userFound) return;

    const timer = setTimeout(() => {
      router.push("/auth/v1/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [verifying, userFound, router]);

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
      // Auto-navigate to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/v1/login");
      }, 3000);
    } catch (err: any) {
      console.error("Error submitting password reset:", err);
      setErrorMsg(err.message || "An error occurred while resetting your password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!verifying && !userFound) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 sm:p-6 font-body">
        <div className="w-full max-w-sm text-center space-y-5">
          <Icon name="error_outline" className="text-6xl text-red-500 mx-auto block" />
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-black text-white tracking-tight">Oops!</h1>
            <p className="text-slate-300 text-sm">
              You&rsquo;ve mistakenly landed on the wrong page. Please head back to the login page.
            </p>
            <p className="text-slate-500 text-xs font-mono">{invalidReason}</p>
          </div>
          <Link
            href="/auth/v1/login"
            className="inline-block px-6 py-3 rounded-lg bg-[#00355f] hover:bg-[#0f4c81] text-xs font-bold text-white uppercase tracking-wider transition-colors"
          >
            Go to Login
          </Link>
          <p className="text-[11px] text-slate-500 font-mono">Redirecting to login in 5 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 text-slate-900 font-body">

      {/* 1. BRIGHT CAMPUS BACKGROUND PANEL (LEFT SIDE) */}
      <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-screen overflow-hidden bg-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-105 contrast-105 scale-100 transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/Login.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        {/* QUOTE OVERLAY */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-6 md:p-12 text-white max-w-lg z-10">
          <p className="font-display text-lg sm:text-xl font-medium leading-relaxed italic mb-4 text-slate-100 drop-shadow-md">
            &ldquo;Enlightenment through education is the highest form of service to humanity. We strive to maintain the sanctuary where knowledge meets character.&rdquo;
          </p>
          <div className="h-1 w-16 bg-sky-400 rounded-full mb-3" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-sky-300 drop-shadow-sm">
            JAIN International Residential School
          </p>
          <p className="font-body text-slate-300 text-xs mt-0.5 opacity-90">
            Facilities Management
          </p>
        </div>
      </div>

      {/* 2. RESET PASSWORD FORM CARD PANEL (RIGHT SIDE) */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50/90 via-sky-50/40 to-blue-50/20">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-7 shadow-2xl shadow-slate-300/60 border border-slate-200/80 text-slate-900 transition-all space-y-5">
          
          {/* Top Bar Navigation & Centered Brand Logo */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <Link
                href="/auth/v1/login"
                className="inline-flex items-center gap-1.5 text-[#00355f] font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors group"
              >
                <Icon
                  name="arrow_back"
                  className="text-sm transition-transform group-hover:-translate-x-1 text-[#00355f]"
                />
                Back to Login
              </Link>
            </div>

            {/* Centered Large Brand Logo (Covering 65% Card Width) */}
            <div className="flex justify-center items-center py-1">
              <img
                src="/Logo.png"
                alt="JIRS Official Logo"
                className="w-[65%] max-w-[280px] h-auto max-h-24 object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-2xl font-black text-[#00355f] tracking-tight">Set New Password</h2>
            <p className="font-body text-slate-600 text-xs">
              Choose a strong password to secure your account.
            </p>
          </div>

          {/* Verifying Spinner */}
          {verifying && (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#00355f]/20 border-t-[#00355f] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-mono">Verifying reset security token...</p>
            </div>
          )}

          {/* Password Reset Success Screen */}
          {!verifying && userFound && success && (
            <div className="bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200/80 rounded-2xl p-6 text-center space-y-4 shadow-sm animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#00355f] text-white flex items-center justify-center mx-auto shadow-md">
                <Icon name="check" className="text-2xl" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-lg text-[#00355f]">Password Reset Successful!</h3>
                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  Your password for <strong className="text-[#00355f]">{userEmail}</strong> has been updated successfully.
                </p>
              </div>
              <div className="pt-2 border-t border-sky-100/80">
                <p className="font-mono text-[11px] text-sky-800 font-semibold flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                  Redirecting to login in 3 seconds...
                </p>
              </div>
              <button
                onClick={() => router.push("/auth/v1/login")}
                className="w-full py-3 rounded-lg bg-[#00355f] hover:bg-[#0f4c81] font-bold text-xs text-white uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                GO TO LOGIN NOW
              </button>
            </div>
          )}

          {/* Reset Password Form */}
          {!verifying && userFound && !success && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Read-Only Email Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 block">
                  Account Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={userEmail || ""}
                    readOnly
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-bold text-slate-700 cursor-not-allowed opacity-90 outline-none"
                  />
                  <Icon name="lock" className="text-slate-400 absolute right-3 top-3 text-sm" />
                </div>
              </div>

              {/* New Password Input */}
              <div className="space-y-1">
                <label htmlFor="newPassword" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 block">
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
                  className="w-full bg-[#f8f9ff] border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 block">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#f8f9ff] border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
                />
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-600">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-lg bg-[#00355f] hover:bg-[#0f4c81] text-white font-bold text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "UPDATE PASSWORD"
                )}
              </button>
            </form>
          )}

          {/* COPYRIGHT FOOTER */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="font-mono text-[10px] text-slate-400">
              © 2026 JAIN International Residential School. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

