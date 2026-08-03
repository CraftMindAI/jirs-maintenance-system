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
  message: string;
  truncate?: boolean;
};

export default function FeedbackCard({ item }: { item: FeedbackItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-4 px-2 sm:px-6">
      {/* DIAGONAL SKEWED CARD CONTAINER */}
      <div className="group relative transform -skew-x-6 sm:-skew-x-12 bg-gradient-to-br from-slate-900 via-[#0b1c30] to-slate-950 border-2 border-sky-400/40 hover:border-sky-400 rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-sky-500/25 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
        
        {/* Glowing Diagonal Accent Slash Line */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl group-hover:bg-sky-400/35 transition-all duration-500 pointer-events-none" />
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-sky-400 via-indigo-500 to-emerald-400" />
        
        {/* UN-SKEW CONTENT CONTAINER SO TEXT & AVATAR REMAIN UPRIGHT */}
        <div className="transform skew-x-6 sm:skew-x-12 relative z-10 space-y-4">
          
          {/* Top Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-3.5">
              {item.avatarUrl ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden relative border-2 border-sky-400 shadow-md shrink-0">
                  <Image src={item.avatarUrl} alt={item.name} fill className="object-cover" />
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-sm shrink-0 border-2 border-sky-400/60 shadow-md ${item.initialsClassName ?? "bg-gradient-to-br from-sky-500/30 to-blue-600/40 text-sky-300"}`}
                >
                  {item.initials}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display text-white font-black text-base tracking-tight">{item.name}</h4>
                  {item.verified && (
                    <Icon name="verified" className="text-sky-400 text-base" />
                  )}
                </div>
                <p className="font-mono text-slate-400 text-xs mt-0.5">
                  {item.role} • {item.timeAgo}
                </p>
              </div>
            </div>

            {/* Glowing Pill Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/20 border border-sky-400/40 text-sky-300 shadow-md">
              <Icon name="verified_user" className="text-xs" /> Verified
            </span>
          </div>

          {/* Feedback Story Content */}
          <div className="relative pt-1">
            <Icon name="format_quote" className="text-sky-400/30 text-3xl mb-1 -ml-1" />
            <p
              className={`font-body text-slate-100 text-sm sm:text-base leading-relaxed italic ${
                item.truncate && !expanded ? "line-clamp-3" : ""
              }`}
            >
              &ldquo;{item.message}&rdquo;
            </p>

            {item.truncate && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-sky-400 font-mono text-xs font-bold hover:underline mt-3 cursor-pointer inline-flex items-center gap-1"
              >
                <span>{expanded ? "Show Less" : "Read Full Story"}</span>
                <Icon name="arrow_forward" className="text-xs" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}




