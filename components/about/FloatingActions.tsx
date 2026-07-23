"use client";

import Icon from "@/components/ui/Icon";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 flex flex-col gap-4 z-40">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-12 h-12 bg-white text-primary rounded-full shadow-xl border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-all"
        aria-label="Scroll to top"
      >
        <Icon name="arrow_upward" />
      </button>
      <button className="bg-secondary text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all font-bold">
        <Icon name="add_comment" />
        <span className="hidden md:block">Raise Complaint</span>
      </button>
    </div>
  );
}
