"use client";

import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";

const ADVANTAGES = [
  {
    icon: "apartment",
    title: "World-Class Campus",
    badge: "350 Acres",
    description:
      "A sprawling 350-acre facility featuring modern hostels, advanced STEM laboratories, and expansive green recreation zones.",
    accent: "from-blue-500/20 to-sky-500/10",
    borderHover: "hover:border-sky-400/50",
    iconBg: "bg-sky-500/20 text-sky-400",
  },
  {
    icon: "sports_basketball",
    title: "Sports Excellence",
    badge: "30+ Sports",
    description:
      "Professional-grade athletic complexes, an Olympic-sized swimming pool, and certified coaching across 30+ disciplines.",
    accent: "from-indigo-500/20 to-purple-500/10",
    borderHover: "hover:border-indigo-400/50",
    iconBg: "bg-indigo-500/20 text-indigo-400",
  },
  {
    icon: "school",
    title: "Expert Residential Faculty",
    badge: "100+ Staffs",
    description:
      "100+ dedicated residential faculty members fostering personalized academic care with a tight 1:8 teacher-student ratio.",
    accent: "from-emerald-500/20 to-teal-500/10",
    borderHover: "hover:border-emerald-400/50",
    iconBg: "bg-emerald-500/20 text-emerald-400",
  },
];

export default function AdvantageCards() {
  return (
    <section className="py-24 md:py-32 bg-[#030812] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/10 rounded-full blur-[180px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Campus Standard"
          title="The JIRS Advantage"
          description="Pioneering holistic residential education, world-class sports facilities, and personalized mentorship."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 md:mt-12">
          {ADVANTAGES.map((advantage, i) => (
            <Reveal key={advantage.title} delay={i * 120}>
              <div className={`group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 ${advantage.borderHover} p-8 rounded-3xl h-full flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${advantage.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl ${advantage.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon name={advantage.icon} className="text-3xl" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {advantage.badge}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-white text-2xl mb-3 tracking-tight">
                    {advantage.title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed font-body">
                    {advantage.description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-sky-400 group-hover:text-sky-300">
                  <span>Discover More</span>
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

