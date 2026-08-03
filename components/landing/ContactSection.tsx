"use client";

import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-[#020611] text-white relative overflow-hidden">
      {/* Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-500/10 rounded-full blur-[180px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Clean Typography & Modern Contact Rows */}
          <div className="lg:col-span-6 space-y-10">
            <Reveal>
              <div className="space-y-4">
                
                <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                  Get in Touch
                </h2>
                <p className="font-body text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
                  Reach out to the Jain International Residential School facility team for immediate assistance or administrative support.
                </p>
              </div>
            </Reveal>

            {/* Minimalist Contact Rows */}
            <div className="space-y-8 pt-2">
              <Reveal delay={100}>
                <a
                  href="mailto:jirsmaintenance@gmail.com"
                  className="group flex items-center gap-6 py-3 border-b border-white/10 hover:border-sky-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                    <Icon name="mail" className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider block">Email Support</span>
                    <span className="text-lg font-display font-semibold text-white group-hover:text-sky-300 transition-colors">
                      jirsmaintenance@gmail.com
                    </span>
                  </div>
                  <Icon name="arrow_outward" className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              </Reveal>

              <Reveal delay={200}>
                <a
                  href="tel:+917899888099"
                  className="group flex items-center gap-6 py-3 border-b border-white/10 hover:border-indigo-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <Icon name="call" className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider block">24/7 Emergency Hotline</span>
                    <span className="text-lg font-display font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      +91 7899888099
                    </span>
                  </div>
                  <Icon name="arrow_outward" className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              </Reveal>

              <Reveal delay={300}>
                <a
                  href="https://maps.google.com/?q=Jain+Global+Campus+Kanakapura+Road+Bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 py-3 border-b border-white/10 hover:border-emerald-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                    <Icon name="location_on" className="text-2xl" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider block">Campus Office</span>
                    <span className="text-lg font-display font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Jain Global Campus, Bangalore
                    </span>
                  </div>
                  <Icon name="arrow_outward" className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              </Reveal>
            </div>
          </div>

          {/* Right Column: Clean Address & Google Maps Link Only */}
          <div className="lg:col-span-6">
            <Reveal delay={200}>
              <div className="space-y-6 p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-white/10">
                <div className="flex items-center gap-3">
                  <Icon name="location_on" className="text-3xl text-sky-400" />
                  <h3 className="font-display text-2xl font-bold text-white">Campus Address</h3>
                </div>

                <p className="text-slate-300 text-base leading-relaxed font-body">
                  Main Administration Block, Jain International Residential School, Kanakapura Road, Bangalore, Karnataka – 562112
                </p>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Jain+Global+Campus+Kanakapura+Road+Bangalore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-105 active:scale-95 group"
                  >
                    <Icon name="near_me" className="text-base group-hover:rotate-45 transition-transform duration-300" />
                    <span>Get Directions on Google Maps</span>
                    <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  );
}





