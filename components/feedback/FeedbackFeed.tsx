"use client";

import { useEffect, useState } from "react";
import FeedbackCard, { FeedbackItem } from "@/components/feedback/FeedbackCard";
import Icon from "@/components/ui/Icon";
import { FEEDBACK_UPDATED_EVENT } from "@/components/feedback/FeedbackFormCard";

type StoredFeedback = {
  name: string;
  role: string;
  date: string;
  initials: string;
  message: string;
  verified: boolean;
};

function loadFeedback(): FeedbackItem[] {
  const stored = localStorage.getItem("jmms_feedback");
  const list: StoredFeedback[] = stored ? JSON.parse(stored) : [];
  return list.map((f) => ({
    name: f.name,
    role: f.role,
    timeAgo: f.date,
    initials: f.initials,
    verified: f.verified,
    message: f.message,
  }));
}

export default function FeedbackFeed() {
  const [items, setItems] = useState<FeedbackItem[]>([]);

  // Load real feedback (no mock seeding) and stay in sync with new submissions
  useEffect(() => {
    setItems(loadFeedback());

    const refresh = () => setItems(loadFeedback());
    window.addEventListener(FEEDBACK_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(FEEDBACK_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/50 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-16 text-center shadow-sm">
        <Icon name="comment" className="text-4xl text-outline dark:text-slate-500 mb-4 block" />
        <h4 className="font-bold text-on-surface dark:text-slate-200">No Feedback Yet</h4>
        <p className="text-sm text-outline dark:text-slate-500 mt-1 max-w-xs mx-auto">
          Be the first to share your experience with the maintenance portal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <FeedbackCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}
