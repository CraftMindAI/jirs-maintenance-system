"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const REASONS = [
  {
    icon: "description",
    title: "100% Digital Workflow",
    tagline: "Zero Paperwork",
    description:
      "Eliminate manual paperwork with digital ticket submission, instant campus-wide approval chains, and automated maintenance records.",
    accent: "from-blue-500 to-indigo-600",
    badge: "Efficiency",
  },
  {
    icon: "my_location",
    title: "Real-time Tracking",
    tagline: "Live Status Updates",
    description:
      "Track your maintenance requests step-by-step from dispatch to completion with live status notifications and technician assignments.",
    accent: "from-sky-400 to-blue-600",
    badge: "Visibility",
  },
  {
    icon: "bolt",
    title: "Guaranteed Rapid SLA",
    tagline: "3-Day Max Resolution",
    description:
      "Smart priority routing ensures urgent campus maintenance gets addressed immediately, adhering strictly to our 3-day resolution guarantee.",
    accent: "from-indigo-500 to-purple-600",
    badge: "Speed",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-jmms" className="py-24 md:py-32 relative overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Why JMMS"
          title="Why Choose JMMS?"
          description="Transforming traditional facility operations into a seamless, high-speed digital service for students, parents, and campus staff."
          light
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 md:mt-12">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 120}>
              <div className="group relative h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-sky-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between overflow-hidden">
                {/* Top Ambient Glow on Hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${reason.accent} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-full pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.accent} flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={reason.icon} className="text-3xl" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-300">
                      {reason.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
                    {reason.title}
                  </h3>
                  <p className="text-xs font-mono text-sky-400 font-semibold mb-4 uppercase tracking-wide">
                    {reason.tagline}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed font-body">
                    {reason.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                  <span>Explore Feature</span>
                  <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

