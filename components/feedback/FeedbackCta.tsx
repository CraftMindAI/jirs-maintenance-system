"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";

export default function FeedbackCta() {
  return (
    <section className="bg-[#020611] py-20 border-t border-white/10 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Your Feedback Drives Continuous Improvement
        </h2>
        <p className="font-body text-slate-300 text-sm sm:text-base leading-relaxed">
          Every suggestion, critique, or compliment helps us build a more reliable, 3-day SLA maintenance ecosystem across all JIRS residential facilities.
        </p>
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Share Your Experience</span>
            <Icon name="rate_review" className="text-base" />
          </Link>
        </div>
      </Container>
    </section>
  );
}


