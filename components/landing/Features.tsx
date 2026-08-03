"use client";

import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

const FEATURES = [
  {
    icon: "add_circle",
    title: "Instant Ticket Creation",
    badge: "Smart Dispatch",
    description: "Seamless 3-step reporting designed for students, parents, staff, and campus administration.",
    gradient: "from-blue-500/20 to-sky-500/10",
    borderHover: "hover:border-blue-400/50",
    iconBg: "bg-blue-500/20 text-blue-400",
  },
  {
    icon: "photo_camera",
    title: "Visual Evidence Upload",
    badge: "Media Attach",
    description: "Attach high-resolution photos and diagnostic notes to tickets for immediate visual context.",
    gradient: "from-indigo-500/20 to-purple-500/10",
    borderHover: "hover:border-indigo-400/50",
    iconBg: "bg-indigo-500/20 text-indigo-400",
  },
  {
    icon: "history",
    title: "Real-Time Audit Timeline",
    badge: "Complete Transparency",
    description: "Transparent, immutable history logs showing step-by-step progress on every maintenance ticket.",
    gradient: "from-cyan-500/20 to-teal-500/10",
    borderHover: "hover:border-cyan-400/50",
    iconBg: "bg-cyan-500/20 text-cyan-400",
  },
  {
    icon: "admin_panel_settings",
    title: "Enterprise Access Control",
    badge: "Role-Based Security",
    description: "Encrypted, role-based permissions protecting access for Admins, Technicians, Staff, and Students.",
    gradient: "from-emerald-500/20 to-green-500/10",
    borderHover: "hover:border-emerald-400/50",
    iconBg: "bg-emerald-500/20 text-emerald-400",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#060d19] text-white relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
          <div className="space-y-4 max-w-2xl">
          
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Powerful Core Features
            </h2>
            <p className="font-body text-slate-300 text-base md:text-lg leading-relaxed">
              Every tool required to maintain world-class residential facilities across Jain International Residential School.
            </p>
          </div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore All Features</span>
            <Icon name="arrow_forward" className="text-base" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 100}>
              <div className={`group relative bg-slate-900/50 backdrop-blur-xl border border-white/10 ${feature.borderHover} p-8 rounded-3xl h-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={feature.icon} className="text-2xl" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h4 className="font-display font-bold text-white mb-3 text-xl tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-sky-400 group-hover:text-sky-300">
                  <span>Learn details</span>
                  <Icon name="chevron_right" className="text-sm group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

