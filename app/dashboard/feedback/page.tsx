"use client";

import { FormEvent, useState } from "react";
import Icon from "@/components/ui/Icon";

type FeedbackItem = {
  name: string;
  role: string;
  date: string;
  initials: string;
  message: string;
  verified: boolean;
  rating: number;
};

const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    name: "Ananya Singh",
    role: "Hostel Wing B",
    date: "2 days ago",
    initials: "AS",
    verified: true,
    rating: 5,
    message: "The new digital JMMS interface is much cleaner. I found it very easy to track my plumber request. Thanks to the support team for quick fixes!",
  },
  {
    name: "Vikram Mehta",
    role: "Grade 12 Student",
    date: "5 days ago",
    initials: "VM",
    verified: true,
    rating: 4,
    message: "Great work on the mobile responsiveness! The portal is super fast even when loaded on low campus hostel Wi-Fi networks.",
  },
  {
    name: "Priya Sharma",
    role: "Science Faculty",
    date: "1 week ago",
    initials: "PS",
    verified: true,
    rating: 5,
    message: "Requested for AC repair in Science Lab 3. The complaint was assigned and resolved within 4 hours. Extremely satisfied with this digital workflow.",
  },
  {
    name: "Rahul Verma",
    role: "Grade 11 Student",
    date: "2 weeks ago",
    initials: "RV",
    verified: false,
    rating: 4,
    message: "The dashboard status timeline is highly transparent. Makes tracking maintenance tasks really easy compared to writing paper logs.",
  },
];

export default function DashboardFeedback() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      const newFeedback: FeedbackItem = {
        name,
        role: email.includes("staff") || email.includes("faculty") ? "Staff member" : "Student",
        date: "Just now",
        initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        verified: true,
        rating,
        message,
      };

      setFeedbackList([newFeedback, ...feedbackList]);
      setName("");
      setEmail("");
      setMessage("");
      setRating(5);
      setSubmitting(false);
      setSubmitted(true);
      
      setTimeout(() => setSubmitted(false), 2000);
    }, 1200);
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");
    setRating(5);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <title>Community Feedback | JMMS</title>

      {/* Header Info */}
      <div>
        <h1 className="font-display text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Community Feedback
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Share your experience with the maintenance portal and help us optimize facilities management.
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
              <h4 className="font-display text-lg font-black text-slate-800 dark:text-slate-100">Feedback Published!</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">Your feedback is live on the community board below.</p>
            </div>
          )}

          {submitting && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-30 flex flex-col items-center justify-center space-y-3 animate-fade-in">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Posting feedback logs...</p>
            </div>
          )}

          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Icon name="rate_review" className="text-primary" />
            Share Your Experience
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. Siddharth Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="e.g. name@jirs.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 font-body-md text-sm premium-input dark:text-slate-100"
              />
            </div>

            {/* Rating Stars */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Overall Rating
              </span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl text-amber-400 focus:outline-none hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Icon name="star" filled={rating >= star} />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Feedback Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
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
                className="flex-1 py-3 bg-primary hover:bg-opacity-95 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all text-xs cursor-pointer scale-100 active:scale-95 flex items-center justify-center gap-1.5"
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
          <h3 className="font-display text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Icon name="comment" className="text-primary" />
            What JIRS Community Says
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackList.map((item, idx) => (
              <div
                key={idx}
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
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{item.name}</h4>
                          {item.verified && (
                            <Icon name="verified" filled className="text-primary dark:text-blue-300 text-[14px]" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.role} • {item.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold italic">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Icon key={i} name="star" filled className="text-xs" />
                    ))}
                  </div>
                  <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
