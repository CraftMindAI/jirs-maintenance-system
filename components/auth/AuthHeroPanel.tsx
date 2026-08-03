"use client";

import Icon from "@/components/ui/Icon";

export default function AuthHeroPanel() {
  return (
    <div className="relative hidden min-h-screen w-full lg:flex lg:w-1/2 overflow-hidden bg-[#00355f] select-none">
      {/* Background Image Showcase */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center opacity-70 scale-105 transition-transform duration-1000"
          role="img"
          aria-label="Cinematic view of the JAIN International Residential School campus"
          style={{
            backgroundImage: "url('/Login.png')",
          }}
        />
        <div className="absolute inset-0 bg-[#00355f]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30] via-transparent to-[#00355f]/60" />
      </div>

      {/* Glassmorphism Content Panel */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-6 md:p-12 text-white">
        {/* Glassmorphism Quote Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl max-w-lg rounded-3xl p-8 sm:p-6 md:p-10 shadow-2xl border border-white/15 space-y-5 my-auto">
          <Icon name="format_quote" className="text-5xl text-sky-400 opacity-90" />
          <p className="font-display text-lg sm:text-xl font-medium leading-relaxed italic text-slate-100">
            &ldquo;Enlightenment through education is the highest form of service to humanity. We strive to maintain the sanctuary where knowledge meets character.&rdquo;
          </p>
          <div className="h-1 w-16 bg-sky-400 rounded-full" />
          <div>
            <p className="font-mono text-xs uppercase tracking-widest font-bold text-sky-300">
              JAIN International Residential School
            </p>
            <p className="font-body text-slate-400 text-xs mt-1">
              Infrastructure &amp; Maintenance Division
            </p>
          </div>
        </div>

        {/* Heritage Footer Bar */}
        <div className="flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-widest text-slate-300 opacity-80 mt-auto">
          <span>Precision</span>
          <span>•</span>
          <span>Efficiency</span>
          <span>•</span>
          <span>Heritage</span>
        </div>
      </div>
    </div>
  );
}

