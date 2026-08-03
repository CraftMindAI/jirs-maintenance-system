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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-primary dark:text-slate-100 tracking-tight">Welcome Back</h2>
        <p className="font-body-md text-on-surface-variant dark:text-slate-400 text-sm">
          Access your facility management dashboard.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block mb-1.5">
            EMAIL ADDRESS
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="e.g. admin@jirs.ac.in"
            className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-slate-300 block">
              PASSWORD
            </label>
            <Link href="/forgot-password" className="font-bold text-xs text-primary dark:text-blue-300 hover:underline">
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
              className="w-full rounded-xl px-4 py-3.5 font-body-md premium-input dark:text-slate-100 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500 hover:text-primary transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[20px]" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 py-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-4 w-4 rounded border-outline-variant/30 text-primary dark:border-white/10 dark:bg-slate-900 focus:ring-primary cursor-pointer"
          />
          <label htmlFor="remember" className="font-bold text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wide cursor-pointer">
            REMEMBER ME ON THIS DEVICE
          </label>
        </div>

        {error && <p className="text-error text-xs font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 hover:bg-opacity-95 transition-all scale-100 active:scale-[0.98] disabled:opacity-70 text-sm cursor-pointer mt-2"
        >
          {submitting ? "SIGNING IN..." : "SIGN IN TO DASHBOARD"}
        </button>
      </form>
    </div>
  );
}
