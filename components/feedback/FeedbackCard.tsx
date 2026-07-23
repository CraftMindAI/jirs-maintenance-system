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
    <div className="bg-white border border-outline-variant/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {item.avatarUrl ? (
            <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
              <Image src={item.avatarUrl} alt={item.name} fill className="object-cover" />
            </div>
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${item.initialsClassName ?? "bg-secondary-container/20 text-secondary"}`}
            >
              {item.initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-label-md text-on-surface">{item.name}</h4>
              {item.verified && (
                <Icon name="verified" filled className="text-secondary text-[16px]" />
              )}
            </div>
            <p className="font-label-sm text-outline">
              {item.role} • {item.timeAgo}
            </p>
          </div>
        </div>
        {item.rating && <StarRating rating={item.rating} />}
      </div>

      <p
        className={`font-body-md text-on-surface-variant mb-4 ${
          item.truncate && !expanded ? "line-clamp-3" : ""
        }`}
      >
        {item.message}
      </p>

      {item.truncate && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-secondary font-label-md hover:underline"
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}

      {item.tags && (
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm">
          {item.tags.map((tag) => `#${tag}`).join(" ")}
        </div>
      )}

      {(item.likes !== undefined || item.comments !== undefined) && (
        <div className="flex items-center gap-4 border-t border-outline-variant/10 pt-4">
          {item.likes !== undefined && (
            <button className="flex items-center gap-1 text-outline font-label-sm hover:text-primary transition-colors">
              <Icon name="thumb_up" className="text-[18px]" /> {item.likes}
            </button>
          )}
          {item.comments !== undefined && (
            <button className="flex items-center gap-1 text-outline font-label-sm hover:text-primary transition-colors">
              <Icon name="chat_bubble" className="text-[18px]" /> {item.comments}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
