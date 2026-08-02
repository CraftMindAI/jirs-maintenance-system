"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase";
import RoleSelect from "@/components/auth/RoleSelect";

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "permission-denied":
        return "Your account was created, but saving your profile was blocked by Firestore security rules. Please contact an administrator.";
      default:
        return `Something went wrong (${error.code}). Please try again.`;
    }
  }
  return "Something went wrong. Please try again.";
}

export default function SignupForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const role = (form.elements.namedItem("role") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement)
      .value;

    if (!role) {
      setError("Please select your role.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await setDoc(doc(db, "users", credential.user.uid), {
        name,
        email,
        phone,
        role,
        createdAt: serverTimestamp(),
      });
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-primary dark:text-slate-100 tracking-tight">Create Account</h2>
        <p className="font-body-md text-on-surface-variant dark:text-slate-400 text-sm">
          Register for the JAIN Maintenance Management System.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="name" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5">
              FULL NAME
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="phone" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5">
              PHONE NUMBER
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 00000 00000"
              className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@organization.com"
            className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100"
          />
        </div>

        <RoleSelect />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5">
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5">
              CONFIRM PASSWORD
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100"
            />
          </div>
        </div>

        {error && <p className="text-error text-xs font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 hover:bg-opacity-95 transition-all scale-100 active:scale-[0.98] disabled:opacity-70 text-sm cursor-pointer mt-4"
        >
          {submitting ? "SUBMITTING..." : "REGISTER ACCOUNT"}
        </button>
      </form>
    </div>
  );
}
