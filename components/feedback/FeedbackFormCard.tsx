"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { submitFeedback } from "@/utils/feedback";

const MAX_LENGTH = 500;

export default function FeedbackFormCard() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          const data = docSnap.exists() ? docSnap.data() : null;
          setName(data?.name || user.displayName || "");
          setEmail(user.email || "");
          setRole(data?.role || "Student");
        } catch (error) {
          console.error("Error fetching user doc:", error);
        }
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !message.trim()) return;

    setStatus("submitting");
    try {
      await submitFeedback({ userId, name, role, message });
      setStatus("submitted");
      setMessage("");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus("idle");
    }
  };

  if (userId === null) {
    return (
      <div
        id="feedback-form"
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/15 p-8 lg:sticky lg:top-24 shadow-2xl text-center space-y-4 text-white"
      >
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
          <Icon name="rate_review" className="text-2xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-white tracking-tight">
          Share Your Thoughts
        </h2>
        <p className="font-body text-slate-300 text-sm leading-relaxed">
          Sign in to your JIRS account to leave feedback for the maintenance administration team.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-500/20 transition-all text-xs uppercase tracking-wider"
        >
          <Icon name="login" className="text-base" />
          <span>Post Feedback</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      id="feedback-form"
      className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/15 p-8 lg:sticky lg:top-24 shadow-2xl text-white space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-1 tracking-tight">
          Share Your Thoughts
        </h2>
        <p className="font-body text-slate-400 text-xs sm:text-sm">
          Tell us what you love or how we can improve.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-mono text-slate-400 font-bold mb-1.5 text-[10px] uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            disabled
            value={name}
            className="w-full rounded-2xl p-3.5 font-body text-xs sm:text-sm border border-white/10 bg-slate-950/60 text-slate-400 outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-mono text-slate-400 font-bold mb-1.5 text-[10px] uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            disabled
            value={email}
            className="w-full rounded-2xl p-3.5 font-body text-xs sm:text-sm border border-white/10 bg-slate-950/60 text-slate-400 outline-none"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="message" className="font-mono text-slate-300 font-bold text-[10px] uppercase tracking-wider">
              Your Message
            </label>
            <span
              className={`font-mono text-[10px] font-bold ${
                message.length > 450 ? "text-red-400" : "text-slate-400"
              }`}
            >
              {message.length} / {MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="message"
            rows={4}
            required
            maxLength={MAX_LENGTH}
            placeholder="Write your experience here..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full rounded-2xl p-3.5 font-body text-xs sm:text-sm border border-white/10 bg-slate-950/40 focus:border-sky-400 text-white placeholder-slate-500 outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={status !== "idle"}
            className={`flex-1 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-80 text-xs uppercase tracking-wider cursor-pointer ${
              status === "submitted"
                ? "bg-emerald-400 text-slate-950"
                : "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20"
            }`}
          >
            <Icon name={status === "submitted" ? "check_circle" : "send"} className="text-base" />
            {status === "submitted"
              ? "Submitted!"
              : status === "submitting"
                ? "Submitting..."
                : "Submit Feedback"}
          </button>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="px-4 border border-white/15 text-slate-300 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-colors text-xs uppercase tracking-wider cursor-pointer"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

