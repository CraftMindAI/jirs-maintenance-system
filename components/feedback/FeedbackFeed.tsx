"use client";

import FeedbackCard from "@/components/feedback/FeedbackCard";
import Icon from "@/components/ui/Icon";
import { useFeedbackFeed } from "@/hooks/useFeedbackFeed";

export default function FeedbackFeed() {
  const { feedback: items } = useFeedbackFeed();

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
        {items.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
