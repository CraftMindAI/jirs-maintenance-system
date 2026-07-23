"use client";

import { FormEvent, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return `Something went wrong (${error.code}). Please try again.`;
    }
  }
  return "Something went wrong. Please try again.";
}

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
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });
      setSent(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold text-primary">Check Your Email</h2>
        <p className="font-body-md text-on-surface-variant">
          We&rsquo;ve sent a password reset link to your email address. Follow
          the link to choose a new password.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-headline text-2xl font-semibold text-primary">Forgot Password</h2>
        <p className="font-body-md text-on-surface-variant">
          Enter your account email and we&rsquo;ll send you a link to reset
          your password.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="email" className="font-label-md text-on-surface block">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="e.g. admin@jirs.ac.in"
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-4 font-label-md text-white shadow-lg transition-transform active:scale-[0.98] hover:bg-primary-container disabled:opacity-70"
        >
          {submitting ? "SENDING..." : "SEND RESET LINK"}
        </button>
      </form>
    </div>
  );
}
