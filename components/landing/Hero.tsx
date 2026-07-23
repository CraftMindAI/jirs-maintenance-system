import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-[#050b14] dot-pattern">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-float pointer-events-none" />

      <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-white py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and CTA */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-semibold tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              JIRS DIGITAL CAMPUS SYSTEM
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Precision Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Facility Support
              </span>
            </h1>
            
            <p className="font-body-lg text-lg text-slate-300 max-w-xl leading-relaxed">
              Elevating the JIRS residential experience through a centralized, enterprise-grade digital platform for facility operations, asset management, and instant resolutions.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/login" 
                className="bg-primary hover:bg-opacity-90 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Raise Complaint <Icon name="arrow_forward" className="text-sm" />
              </Link>
              <Link 
                href="/login" 
                className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                View Ticket Status
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 max-w-lg">
              <div>
                <div className="text-2xl font-black text-white">98.2%</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">SLA Resolution</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">4.8★</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">User Rating</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">15 Min</div>
                <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Avg Response</div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Dashboard Mockup */}
          <div className="lg:col-span-6 w-full relative flex justify-center">
            {/* Soft backdrop glow behind mockup */}
            <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl transform rotate-3 scale-95 pointer-events-none" />
            
            {/* Main Mockup Container */}
            <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-float">
              {/* Header inside mockup */}
              <div className="flex justify-between items-center pb-4 border-b border-white/15 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
                </div>
                <div className="bg-white/10 text-xs px-3 py-1 rounded-full text-slate-300 font-mono tracking-wider">
                  JMMS-PORTAL v1.2
                </div>
              </div>

              {/* Status Chips */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Active</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">42</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Assigned</span>
                  <span className="text-2xl font-black text-sky-400 mt-1 block">18</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Resolved</span>
                  <span className="text-2xl font-black text-yellow-500 mt-1 block">284</span>
                </div>
              </div>

              {/* Mock Tickets Feed */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 pl-1">
                  Live Maintenance Feed
                </h3>
                
                {/* Item 1 */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <Icon name="bolt" className="text-xl" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Physics Lab AC Water Leakage</div>
                      <div className="text-xs text-slate-400 mt-0.5">Reported by Prof. Sharma • Room 302</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 text-[11px] font-bold rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 uppercase tracking-wider">
                    In Progress
                  </div>
                </div>

                {/* Item 2 */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Icon name="water_drop" className="text-xl" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Hostel Block B Pipe Clog</div>
                      <div className="text-xs text-slate-400 mt-0.5">Reported by Ananya S. • Room 108</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    Resolved
                  </div>
                </div>

                {/* Item 3 */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                      <Icon name="build" className="text-xl" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">Library Door Lock Jammed</div>
                      <div className="text-xs text-slate-400 mt-0.5">Reported by Staff • Gate 1</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 text-[11px] font-bold rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 uppercase tracking-wider">
                    Assigned
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
