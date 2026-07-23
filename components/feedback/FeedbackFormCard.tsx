"use client";

import { FormEvent, useState } from "react";
import Icon from "@/components/ui/Icon";

const MAX_LENGTH = 500;

export default function FeedbackFormCard() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("submitted");
      setMessage("");
      event.currentTarget.reset();
      setTimeout(() => setStatus("idle"), 1500);
    }, 1200);
  };

  return (
    <div
      id="feedback-form"
      className="bg-white dark:bg-slate-900/50 rounded-3xl border border-outline-variant/20 dark:border-white/5 p-8 lg:sticky lg:top-24 shadow-xl"
    >
      <h2 className="font-headline text-xl font-bold text-primary dark:text-slate-100 mb-2 tracking-tight">
        Share Your Thoughts
      </h2>
      <p className="font-body-md text-on-surface-variant dark:text-slate-400 mb-8 text-sm">
        Tell us what you love or how we can improve.
      </p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-label-md text-on-surface-variant dark:text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full rounded-xl p-3.5 font-body-md premium-input dark:text-slate-100"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-label-md text-on-surface-variant dark:text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="john@jirs.ac.in"
            className="w-full rounded-xl p-3.5 font-body-md premium-input dark:text-slate-100"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="message" className="font-label-md text-on-surface-variant dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
              Your Message
            </label>
            <span
              className={`font-label-sm font-bold text-xs ${
                message.length > 450 ? "text-error" : "text-outline dark:text-slate-500"
              }`}
            >
              {message.length} / {MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="message"
            rows={5}
            required
            maxLength={MAX_LENGTH}
            placeholder="Write your experience here..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full rounded-xl p-3.5 font-body-md premium-input dark:text-slate-100 resize-none"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={status !== "idle"}
            className={`flex-1 text-white font-bold py-3.5 rounded-xl transition-all scale-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-80 text-sm cursor-pointer ${
              status === "submitted" ? "bg-emerald-500" : "bg-primary hover:bg-opacity-95 shadow-md hover:shadow-primary/20"
            }`}
          >
            <Icon name={status === "submitted" ? "check_circle" : "send"} className="text-[18px]" />
            {status === "submitted"
              ? "Submitted!"
              : status === "submitting"
                ? "Submitting..."
                : "Submit Feedback"}
          </button>
          <button
            type="reset"
            onClick={() => setMessage("")}
            className="px-6 border border-outline-variant dark:border-white/10 text-on-surface-variant dark:text-slate-300 font-bold rounded-xl hover:bg-surface-container-high dark:hover:bg-slate-800 transition-colors text-sm cursor-pointer"
          >
            Clear
          </button>
        </div>
        <p className="font-label-sm text-outline dark:text-slate-500 italic text-center mt-4 text-xs">
          * Feedback will be published after admin verification.
        </p>
      </form>
    </div>
  );
}
