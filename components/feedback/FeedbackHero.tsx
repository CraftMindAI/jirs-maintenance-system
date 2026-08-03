"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";

export default function FeedbackHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#050b14] text-white border-b border-white/10">
      {/* Dynamic Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Breadcrumb Pill */}
         
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Your Voice Shapes Our <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400">
              Campus Facilities
            </span>
          </h1>

          <p className="font-body text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            We value your experience! Share your feedback, report suggestions, or commend facility staff to help us continuously elevate residential life at Jain International Residential School.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-white font-display">4.9★</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Satisfaction Rating</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-display">100%</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Audited Feedback</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-display">&lt;24 hrs</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Admin Review</div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

