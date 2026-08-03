"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const STEPS = [
  {
    number: "01",
    title: "Instant Report",
    subtitle: "Submit in 60s",
    icon: "edit_note",
    description: "Submit tickets via phone or desktop with diagnostic details and visual photo uploads.",
    gradient: "from-blue-500 to-sky-400",
  },
  {
    number: "02",
    title: "Smart Dispatch",
    subtitle: "Automated Routing",
    icon: "hub",
    description: "Auto-allocated to specialized campus technicians based on issue domain and location.",
    gradient: "from-sky-400 to-indigo-500",
  },
  {
    number: "03",
    title: "Rapid Execution",
    subtitle: "On-Site Repair",
    icon: "engineering",
    description: "Technicians receive instant alerts and resolve issues on-site with real-time status logging.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    number: "04",
    title: "Admin & User Audit",
    subtitle: "Guaranteed Satisfaction",
    icon: "verified",
    description: "Final verification and student/staff rating before ticket closure and database archiving.",
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function ProcessTimeline() {
  return (
    <section className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading 
          eyebrow="Workflow Engine" 
          title="The Maintenance Journey" 
          description="How JMMS ensures swift 3-day turnaround from initial ticket submission to final facility sign-off."
          light
        />

        <div className="relative max-w-6xl mx-auto mt-16">
          {/* Glowing Animated Connecting Pipe */}
          <div className="absolute top-[52px] left-[5%] right-[5%] h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 opacity-30 rounded-full hidden lg:block" />
          <div className="absolute top-[52px] left-[5%] right-[5%] h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full hidden lg:block blur-sm opacity-50" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <div className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-full flex flex-col justify-between hover:border-sky-400/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
                  <div>
                    {/* Header: Step Badge & Icon */}
                    <div className="flex items-center justify-between mb-8 relative">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        <Icon name={step.icon} className="text-2xl" />
                      </div>
                      <span className="font-mono text-3xl font-black text-white/20 group-hover:text-sky-400/40 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <h5 className="font-display font-bold text-white text-xl mb-1 tracking-tight">
                      {step.title}
                    </h5>
                    <div className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider mb-4">
                      {step.subtitle}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-body">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>Phase {step.number}</span>
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

