"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement).value.trim();

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-slate-900">
        <h2 className="font-display text-2xl font-black text-[#00355f]">Check Your Email</h2>
        <p className="font-body text-slate-600 text-sm leading-relaxed">
          We&rsquo;ve sent a password reset link to your email address. Follow the instructions in the email to set a new password.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-black text-[#00355f] tracking-tight">Forgot Password</h2>
        <p className="font-body text-slate-600 text-sm">
          Enter your account email and we&rsquo;ll send you a link to reset your password.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="email" className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="e.g. admin@jirs.ac.in"
            className="w-full rounded-lg px-4 py-3 font-body text-sm bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
          />
        </div>

        {error && <p className="text-red-600 text-xs font-mono font-semibold bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#00355f] hover:bg-[#0f4c81] py-3.5 font-bold text-white shadow-lg transition-all scale-100 active:scale-[0.98] disabled:opacity-70 text-xs uppercase tracking-widest cursor-pointer mt-2"
        >
          {submitting ? "SENDING..." : "SEND RESET INSTRUCTIONS"}
        </button>
      </form>
    </div>
  );
}
