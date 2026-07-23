"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { dashboardPathForRole } from "@/lib/roleRedirect";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", credential.user.uid);

      const existing = await getDoc(userRef);
      if (!existing.exists()) {
        // Firebase auto-creates the Authentication user on first Google
        // sign-in — since this account was never registered, delete it
        // rather than leaving an orphaned Authentication record behind.
        await credential.user.delete();
        setError("No account found for this Google account. Please sign up first.");
        setSubmitting(false);
        return;
      }

      router.push(dashboardPathForRole(existing.data()?.role));
    } catch {
      setError("Google sign-in failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-white py-3 font-label-md transition-all hover:bg-surface-container-low w-full disabled:opacity-70"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.38-2.04 4.52-1.14 1.14-2.8 2.36-5.8 2.36-4.82 0-8.6-3.88-8.6-8.7s3.78-8.7 8.6-8.7c2.6 0 4.5 1.02 5.9 2.34l2.3-2.3c-1.9-1.9-4.7-3.24-8.2-3.24-6.4 0-11.64 5.24-11.64 11.64s5.24 11.64 11.64 11.64c3.48 0 6.12-1.14 8.12-3.24 2.1-2.1 2.76-5.04 2.76-7.38 0-.48-.04-.96-.12-1.44H12.48z"
            fill="#EA4335"
          />
        </svg>
        {submitting ? "CONNECTING..." : "GOOGLE"}
      </button>
      {error && <p className="text-error text-sm mt-2 text-center">{error}</p>}
    </div>
  );
}
