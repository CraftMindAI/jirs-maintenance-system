"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";

export default function CtaBanner({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryHref = "/signup",
  secondaryHref = "/login",
}: {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-20 md:py-28 bg-[#020611] text-white relative overflow-hidden">
      <Container>
        <div className="relative bg-gradient-to-br from-slate-900 via-[#0b1c30] to-slate-950 rounded-[2.5rem] p-6 md:p-10 md:p-8 md:p-16 text-center border border-white/15 overflow-hidden shadow-2xl group">
          {/* Ambient Corner Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none group-hover:bg-sky-400/25 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
           

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.12]">
              {title}
            </h2>

            <p className="text-slate-300 font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={primaryHref}
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{primaryLabel}</span>
                <Icon name="arrow_forward" className="text-base" />
              </Link>
              <Link
                href={secondaryHref}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/15 text-white px-8 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{secondaryLabel}</span>
                <Icon name="login" className="text-base" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

