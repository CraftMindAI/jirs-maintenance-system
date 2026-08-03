"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Icon from "@/components/ui/Icon";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Compact Scroll Track (160vh) for fast, smooth card transition before page scrolls
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth physics spring for 60 FPS transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  // Circular Card State Transformations
  // Step A: Initial Quote Fade out (0.00 -> 0.35)
  const quoteOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);
  const quoteScale = useTransform(smoothProgress, [0, 0.35], [1, 0.9]);

  // Step B: Static Portal Image Fade in (0.25 -> 0.65)
  const imageOpacity = useTransform(smoothProgress, [0.25, 0.65], [0, 1]);
  const imageScale = useTransform(smoothProgress, [0.25, 0.65], [0.95, 1]);

  return (
    <div ref={containerRef} className="relative h-[160vh] bg-[#050b14] select-none dot-pattern">
      {/* STICKY VIEWPORT FOR SMOOTH CARD TRANSITION */}
      <div className="sticky top-0 pt-16 md:pt-20 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background radial glow decorations */}
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-full px-4 md:px-8 max-w-7xl mx-auto text-white py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 md:space-y-8 text-left">
              
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight">
                Precision Campus <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-sky-400">
                  Facility Support
                </span>
              </h1>
              
              <p className="font-body-lg text-xs sm:text-base md:text-lg text-slate-300 max-w-xl leading-relaxed">
                Elevating the JIRS residential experience through a centralized, enterprise-grade digital platform for facility operations, asset management, and instant 3-day SLA resolutions.
              </p>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-1">
                <Link 
                  href="/login" 
                  className="bg-primary hover:bg-primary/90 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Raise Complaint <Icon name="arrow_forward" className="text-base" />
                </Link>
                <Link 
                  href="/login" 
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-extrabold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  View Ticket Status
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-3 sm:pt-6 border-t border-white/10 max-w-lg">
                <div>
                  <div className="text-lg sm:text-3xl font-black text-white">98.4%</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 uppercase tracking-wider font-mono">3-Day SLA Target</div>
                </div>
                <div>
                  <div className="text-lg sm:text-3xl font-black text-white">4.9★</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 uppercase tracking-wider font-mono">Campus Rating</div>
                </div>
                <div>
                  <div className="text-lg sm:text-3xl font-black text-white">15 Min</div>
                  <div className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 uppercase tracking-wider font-mono">Avg Response</div>
                </div>
              </div>
            </div>

            {/* Right Column: CIRCULAR RADIUS GLASS CARD MOCKUP */}
            <div className="lg:col-span-5 w-full relative flex justify-center pt-2 lg:pt-0">
              {/* Soft backdrop glow behind circular card */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform scale-95 pointer-events-none" />
              
              {/* Circular Card Container - Resized for mobile screens */}
              <div className="relative w-[230px] h-[230px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px] rounded-full bg-slate-900/90 backdrop-blur-2xl border-2 border-white/20 p-4 sm:p-6 shadow-2xl flex items-center justify-center text-center overflow-hidden group hover:border-primary/50 transition-all shrink-0">
                
                {/* Glowing Circular Ring Outline */}
                <div className="absolute inset-2 rounded-full border border-primary/30 pointer-events-none" />

                {/* STATE 1: INITIAL MOTIVATIONAL QUOTE */}
                <motion.div
                  style={{ opacity: quoteOpacity, scale: quoteScale }}
                  className="absolute inset-0 z-10 p-5 sm:p-8 flex flex-col justify-between items-center text-center bg-gradient-to-br from-slate-900 via-[#0b1c30] to-slate-950 text-white rounded-full"
                >
                  <div className="space-y-1.5 my-auto max-w-xs">
                    <p className="font-display text-[11px] sm:text-base lg:text-lg font-bold leading-relaxed tracking-tight italic text-slate-100">
                      &ldquo;JMMS helps students focus on their studies by ensuring seamless academic teaching infrastructure & rapid facility maintenance.&rdquo;
                    </p>
                    <span className="text-[8px] sm:text-[10px] font-mono text-slate-400 block uppercase tracking-widest">
                      — JIRS Student Success Motto
                    </span>
                  </div>
                </motion.div>

                {/* STATE 2: STATIC PORTAL IMAGE INSIDE CIRCLE */}
                <motion.div
                  style={{ opacity: imageOpacity, scale: imageScale }}
                  className="absolute inset-0 z-0 overflow-hidden rounded-full p-2 bg-slate-950 flex items-center justify-center"
                >
                  <img
                    src="/landing.png"
                    alt="JIRS Maintenance System Portal Overview"
                    className="w-full h-full object-cover rounded-full border border-white/10 shadow-2xl"
                  />
                </motion.div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
