"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/expired-action-code":
        return "This reset link has expired. Please request a new one.";
      case "auth/invalid-action-code":
        return "This reset link is invalid or has already been used.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return `Something went wrong (${error.code}). Please try again.`;
    }
  }
  return "Something went wrong. Please try again.";
}

type Status = "verifying" | "valid" | "invalid" | "done";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<Status>("verifying");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      setError("This reset link is missing required information.");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("valid");
      })
      .catch((err) => {
        setError(friendlyError(err));
        setStatus("invalid");
      });
  }, [oobCode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!oobCode) return;

    const form = event.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement)
      .value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  if (status === "verifying") {
    return <p className="font-body-md text-on-surface-variant">Verifying reset link...</p>;
  }

  if (status === "invalid") {
    return (
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold text-primary">Link Invalid</h2>
        <p className="text-error text-sm">{error}</p>
        <Link
          href="/forgot-password"
          className="inline-block text-primary font-bold hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-semibold text-primary">Password Reset</h2>
        <p className="font-body-md text-on-surface-variant">
          Your password has been reset successfully. Redirecting you to login...
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-lg bg-primary py-4 font-label-md text-white shadow-lg transition-transform active:scale-[0.98] hover:bg-primary-container"
        >
          GO TO LOGIN
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-headline text-2xl font-semibold text-primary">Reset Password</h2>
        <p className="font-body-md text-on-surface-variant">
          Choose a new password for <span className="font-semibold">{email}</span>.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="password" className="font-label-md text-on-surface block">
            NEW PASSWORD
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="font-label-md text-on-surface block">
            CONFIRM NEW PASSWORD
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-4 font-label-md text-white shadow-lg transition-transform active:scale-[0.98] hover:bg-primary-container disabled:opacity-70"
        >
          {submitting ? "RESETTING..." : "RESET PASSWORD"}
        </button>
      </form>
    </div>
  );
}
