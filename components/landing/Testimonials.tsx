"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import founder from "@/public/founder.png";

const TESTIMONIALS = [
  {
    quote:
      "JMMS has completely transformed our campus operations. Maintenance complaints that used to take days of paper routing are now resolved within 24 hours.",
    name: "Dr. Chenraj Roychand",

    role: "Founder Chairman",
    tag: "Verified Leadership",
    rating: 5,
    avatar:
      founder.src,
  },
  {
    quote:
      "As a senior technician, I can see all my daily assignments on my tablet with photo attachments. I know exact room numbers and issues before stepping out.",
    name: "Rajesh Kumar",
    role: "Senior Facility Technician",
    tag: "Technical Team",
    rating: 5,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdn_wtzm58uYrmoBFxW7aFP07uF3JGYJmHqB9owWWGqFmCBdoT4nqNQImVNz0D27eK1p-sI-9slmwKL7_map-QisThrmuKOk31x5slWaSAhj2x-TJg37racpPMxNFru9rq4ssCc-8C_70cB7fmMNoRI95UCSqrkeLdcI3G3wOdzXJbm57p7MFA943f-rVEUFKNfDf_HULz2tak2HujO9Gd4Ac2gQY7PHGb8LGUvg9l70tJXMr4bUMYcw",
  },
];

export default function Testimonials() {
  return (
    <section id="feedback" className="py-24 md:py-32 bg-[#050c18] text-white relative overflow-hidden">
      {/* Vibrant Blue Glow decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by Campus Administrators & Staff"
          description="Hear how our digital maintenance system brings peace of mind to parents, students, and facility leaders."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 md:mt-12">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 100}>
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 sm:p-6 md:p-10 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between hover:border-sky-400/40 transition-all duration-500 hover:-translate-y-1 shadow-2xl group">
                <Icon
                  name="format_quote"
                  className="absolute -top-4 -right-4 text-9xl opacity-10 text-sky-400 group-hover:scale-110 transition-transform pointer-events-none"
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(testimonial.rating)].map((_, index) => (
                        <Icon key={index} name="star" className="text-lg fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                      {testimonial.tag}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg mb-8 leading-relaxed font-body text-slate-200 relative z-10">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-white/10">
                  <div className="w-14 h-14 rounded-full border-2 border-sky-400/60 overflow-hidden relative shrink-0 shadow-lg shadow-sky-500/20">
                    <Image
                      src={testimonial.avatar}
                      alt={`Portrait of ${testimonial.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-white tracking-tight">{testimonial.name}</div>
                    <div className="text-xs text-sky-300 font-mono font-semibold">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

