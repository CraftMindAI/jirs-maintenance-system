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
      className="bg-white rounded-xl shadow-sm border border-outline-variant/30 p-8 lg:sticky lg:top-24"
    >
      <h2 className="font-headline text-lg font-semibold text-primary mb-2">
        Share Your Thoughts
      </h2>
      <p className="font-body-md text-on-surface-variant mb-8">
        Tell us what you love or how we can improve.
      </p>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block font-label-md text-on-surface-variant mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-label-md text-on-surface-variant mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="john@jirs.ac.in"
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="message" className="font-label-md text-on-surface-variant">
              Your Message
            </label>
            <span
              className={`font-label-sm ${
                message.length > 450 ? "text-error" : "text-outline"
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
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={status !== "idle"}
            className={`flex-1 text-white font-label-md py-3 rounded-lg transition-opacity active:scale-95 flex items-center justify-center gap-2 disabled:opacity-80 ${
              status === "submitted" ? "bg-success" : "bg-primary hover:opacity-95"
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
            className="px-6 border border-outline-variant text-on-surface-variant font-label-md rounded-lg hover:bg-surface-container-high transition-colors"
          >
            Clear
          </button>
        </div>
        <p className="font-label-sm text-outline italic text-center mt-4">
          * Feedback will be published after admin verification.
        </p>
      </form>
    </div>
  );
}
