"use client";

import Image from "next/image";
import { useState } from "react";
import Icon from "@/components/ui/Icon";

export type FeedbackItem = {
  name: string;
  role: string;
  timeAgo: string;
  avatarUrl?: string;
  initials?: string;
  initialsClassName?: string;
  verified?: boolean;
  rating?: number;
  message: string;
  truncate?: boolean;
  tags?: string[];
  likes?: number;
  comments?: number;
};

function StarRating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating - i;
    return filled >= 1 ? "star" : filled >= 0.5 ? "star_half" : null;
  });

  return (
    <div className="flex gap-1">
      {stars.map((icon, i) =>
        icon ? (
          <Icon key={i} name={icon} filled className="text-warning text-[18px]" />
        ) : null
      )}
    </div>
  );
}

export default function FeedbackCard({ item }: { item: FeedbackItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {item.avatarUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-outline-variant/20 dark:border-white/10">
                <Image src={item.avatarUrl} alt={item.name} fill className="object-cover" />
              </div>
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${item.initialsClassName ?? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300"}`}
              >
                {item.initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-label-md text-on-surface dark:text-slate-100 font-bold">{item.name}</h4>
                {item.verified && (
                  <Icon name="verified" filled className="text-primary dark:text-blue-300 text-[16px]" />
                )}
              </div>
              <p className="font-label-sm text-outline dark:text-slate-400 text-xs">
                {item.role} • {item.timeAgo}
              </p>
            </div>
          </div>
          {item.rating && <StarRating rating={item.rating} />}
        </div>

        <p
          className={`font-body-md text-on-surface-variant dark:text-slate-300 text-sm leading-relaxed mb-4 ${
            item.truncate && !expanded ? "line-clamp-3" : ""
          }`}
        >
          {item.message}
        </p>

        {item.truncate && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-primary dark:text-blue-300 font-bold text-sm hover:underline mb-4 cursor-pointer"
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      <div className="mt-auto space-y-4 pt-4 border-t border-outline-variant/10 dark:border-white/5">
        {item.tags && (
          <div className="inline-flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {(item.likes !== undefined || item.comments !== undefined) && (
          <div className="flex items-center gap-4">
            {item.likes !== undefined && (
              <button className="flex items-center gap-1.5 text-outline dark:text-slate-400 font-semibold text-xs hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
                <Icon name="thumb_up" className="text-[18px]" /> {item.likes}
              </button>
            )}
            {item.comments !== undefined && (
              <button className="flex items-center gap-1.5 text-outline dark:text-slate-400 font-semibold text-xs hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
                <Icon name="chat_bubble" className="text-[18px]" /> {item.comments}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
