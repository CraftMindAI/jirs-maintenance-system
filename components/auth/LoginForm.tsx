"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { dashboardPathForRole } from "@/lib/roleRedirect";
import Icon from "@/components/ui/Icon";

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return `Something went wrong (${error.code}). Please try again.`;
    }
  }
  return "Something went wrong. Please try again.";
}

interface LoginFormProps {
  defaultRole?: string;
}

export default function LoginForm({ defaultRole }: LoginFormProps = {}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setSubmitting(true);
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await getDoc(doc(db, "users", credential.user.uid));
      router.push(dashboardPathForRole(profile.data()?.role));
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-slate-900">
      {/* Official School Brand Header */}
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-black text-[#00355f] tracking-tight">Welcome Back</h2>
        <p className="font-body text-slate-600 text-xs">
          Access your facility management dashboard.
        </p>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="email" className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="e.g. admin@jirs.ac.in"
            className="w-full rounded-lg px-3.5 py-2.5 font-body text-sm bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Password
            </label>
            <Link href="/auth/v1/forgot-password" className="font-mono font-bold text-xs text-[#005cba] hover:underline">
              FORGOT PASSWORD?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-3 font-body text-sm bg-[#f8f9ff] border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/20 outline-none transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#00355f] focus:ring-[#00355f] cursor-pointer"
          />
          <label htmlFor="remember" className="font-mono font-bold text-xs text-slate-600 uppercase tracking-wider cursor-pointer">
            REMEMBER ME ON THIS DEVICE
          </label>
        </div>

        {error && <p className="text-red-600 text-xs font-mono font-semibold bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#00355f] hover:bg-[#0f4c81] py-3.5 font-bold text-white shadow-lg transition-all scale-100 active:scale-[0.98] disabled:opacity-70 text-xs uppercase tracking-widest cursor-pointer mt-2"
        >
          {submitting ? "SIGNING IN..." : "SIGN IN TO DASHBOARD"}
        </button>
      </form>
    </div>
  );
}


