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
    <div className="space-y-3 text-slate-900">
      <div className="space-y-0.5">
        <h2 className="font-display text-2xl font-black text-[#00355f] tracking-tight">Create Account</h2>
        <p className="font-body text-slate-600 text-xs">
          Register for the JAIN Facilities Management.
        </p>
      </div>

      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="space-y-0.5">
            <label htmlFor="name" className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full rounded-lg px-3 py-2 font-body text-xs bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-0.5">
            <label htmlFor="phone" className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 00000 00000"
              className="w-full rounded-lg px-3 py-2 font-body text-xs bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="space-y-0.5">
            <label htmlFor="email" className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@organization.com"
              className="w-full rounded-lg px-3 py-2 font-body text-xs bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
            />
          </div>

          <RoleSelect />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="space-y-0.5">
            <label htmlFor="password" className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2 font-body text-xs bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
            />
          </div>
          <div className="space-y-0.5">
            <label htmlFor="confirmPassword" className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2 font-body text-xs bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-xs font-mono font-semibold bg-red-50 p-2 rounded-lg border border-red-200">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#00355f] hover:bg-[#0f4c81] py-2.5 font-bold text-white shadow-md transition-all scale-100 active:scale-[0.98] disabled:opacity-70 text-xs uppercase tracking-widest cursor-pointer mt-2"
        >
          {submitting ? "REGISTERING..." : "REQUEST REGISTRATION"}
        </button>
      </form>
    </div>
  );
}


