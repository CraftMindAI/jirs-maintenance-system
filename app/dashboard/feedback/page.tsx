"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useFeedbackFeed } from "@/hooks/useFeedbackFeed";
import { submitFeedback } from "@/utils/feedback";

const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;
const PAGE_SIZE = 6;

export default function DashboardFeedback() {
  const { feedback: feedbackList, loading: feedLoading } = useFeedbackFeed();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Community board filters
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Prefill the form with the signed-in user's details
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!userId) {
      setFormError("Please sign in to submit feedback.");
      return;
    }
    if (message.trim().length < MESSAGE_MIN_LENGTH) {
      setFormError(`Please write at least ${MESSAGE_MIN_LENGTH} characters so we can act on it.`);
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({ userId, name, role, message: message.trim() });
      setMessage("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFormError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setFormError(null);
  };

  const filteredFeedback = useMemo(
    () =>
      feedbackList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.message.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [feedbackList, searchQuery],
  );

  const visibleFeedback = filteredFeedback.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFeedback.length;
  const isFiltering = searchQuery.trim() !== "";

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <title>Community Feedback | JMMS</title>

      {/* Header Info */}
      <div>
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Community Feedback
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Share your experience with the maintenance portal and help us optimize
          facilities management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
          {submitted && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-30 flex flex-col items-center justify-center space-y-3 animate-fade-in text-center p-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <Icon name="verified" className="text-4xl animate-bounce" />
              </div>
              <h4 className="font-display text-lg font-black text-slate-800 dark:text-slate-100">
                Feedback Published!
              </h4>
              <p className="text-xs text-slate-400 max-w-[200px]">
                Your feedback is live on the community board below.
              </p>
            </div>
          )}

          {submitting && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-30 flex flex-col items-center justify-center space-y-3 animate-fade-in">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">
                Posting feedback logs...
              </p>
            </div>
          )}

          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Icon name="rate_review" className="text-primary" />
            Share Your Experience
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
                <Icon name="error" className="text-base shrink-0" />
                {formError}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                disabled
                placeholder="e.g. Siddharth Roy"
                value={name}
                className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input text-slate-400 cursor-not-allowed appearance-none"
              />
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Icon name="lock" className="text-[12px]" />
                Synced from your account — update it in Settings.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled
                placeholder="e.g. name@jirs.ac.in"
                value={email}
                className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input text-slate-400 cursor-not-allowed appearance-none"
              />
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Icon name="lock" className="text-[12px]" />
                Synced from your account — update it in Settings.
              </p>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="message"
                  className="block text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Feedback Message
                </label>
                <span
                  className={`text-[10px] font-bold ${
                    message.length > MESSAGE_MAX_LENGTH
                      ? "text-red-500"
                      : "text-slate-400"
                  }`}
                >
                  {message.length}/{MESSAGE_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="message"
                rows={4}
                required
                maxLength={MESSAGE_MAX_LENGTH}
                placeholder="How was your maintenance experience?..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl p-4 font-body-md text-sm premium-input dark:text-slate-100 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <button
                type="submit"
                disabled={submitting || message.trim().length < MESSAGE_MIN_LENGTH}
                className="flex-1 py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all text-xs cursor-pointer scale-100 active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <Icon name="send" className="text-sm" />
                Submit
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Published Feedback cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Icon name="comment" className="text-primary" />
              What JIRS Community Says
            </h3>
          </div>

          {/* Search Toolbar */}
          {feedbackList.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
              <div className="relative">
                <Icon
                  name="search"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"
                />
                <input
                  type="text"
                  placeholder="Search feedback by name or message..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-body-md text-xs outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {feedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                      <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-2.5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleFeedback.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleFeedback.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden card-shine h-full"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-black text-sm flex items-center justify-center">
                            {item.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                                {item.name}
                              </h4>
                              {item.verified && (
                                <Icon
                                  name="verified"
                                  filled
                                  className="text-primary dark:text-blue-300 text-[14px]"
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {item.role} • {item.timeAgo}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 flex justify-end items-center text-[10px] font-bold text-slate-400">
                      <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="px-6 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Icon name="expand_more" className="text-sm" />
                    Load More ({filteredFeedback.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
              <Icon
                name={isFiltering ? "search_off" : "comment"}
                className="text-4xl text-slate-300 mb-4 block"
              />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">
                {isFiltering ? "No Matching Feedback" : "No Feedback Yet"}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                {isFiltering
                  ? "Try a different search term."
                  : "Be the first to share your experience with the maintenance portal."}
              </p>
              {isFiltering && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
