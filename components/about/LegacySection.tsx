"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import LegacyImage from "@/public/Legacy.png";

const STATS = [
  { value: "350+", label: "ACRE CAMPUS", icon: "square_foot" },
  { value: "Global", label: "CURRICULUM", icon: "public" },
  { value: "700+", label: "STUDENTS", icon: "groups" },
  { value: "100+", label: "TEACHERS", icon: "diversity_3" },
];

export default function LegacySection() {
  return (
    <section className="py-24 md:py-32 bg-[#050b14] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 relative">
            <Reveal>
              <div className="relative group">
                <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative aspect-[4/3] bg-slate-900">
                  <Image
                    src={LegacyImage}
                    alt="Entrance gate of JIRS campus"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>
                
                {/* Floating Founded Badge */}
                <div className="absolute -bottom-6 -right-4 sm:right-6 bg-slate-900/90 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-sky-400/30 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Icon name="military_tech" className="text-2xl" />
                  </div>
                  <div>
                    <span className="text-sky-400 font-display font-black text-2xl block tracking-tight">Est. 1999</span>
                    <span className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider block">25+ Years Legacy</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Content & Stats */}
          <div className="lg:col-span-6 space-y-8">
            <Reveal delay={100}>
              <div className="space-y-4">
               
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                  Legacy of Excellence
                </h2>
                <p className="font-body text-slate-300 text-base md:text-lg leading-relaxed">
                  Founded in 1999 by visionary educationist Dr. Chenraj Roychand, JAIN International Residential School (JIRS) has evolved into one of India&rsquo;s premier residential institutions.
                </p>
                <p className="font-body text-slate-400 text-sm md:text-base leading-relaxed">
                  Our 350-acre global learning hub blends international academic rigour with Indian cultural values, nurturing over 700+ residential students from across the globe.
                </p>
              </div>
            </Reveal>

            {/* Modern Stats Grid */}
            <Reveal delay={200}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-sky-400/40 transition-all duration-300 group hover:-translate-y-1"
                  >
                    <Icon name={stat.icon} className="text-sky-400 text-xl mb-2 group-hover:scale-110 transition-transform" />
                    <span className="block text-white font-display font-black text-xl sm:text-2xl">{stat.value}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mt-0.5 block">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  );
}

