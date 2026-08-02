import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const TESTIMONIALS = [
  {
    quote:
      "JMMS has revolutionized how we handle campus issues. The speed of response from the maintenance team has drastically improved since we went digital.",
    name: "Dr. Amit Sharma",
    role: "Campus Administrator",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1cGJyD3gqlIGl0XpYxlLf0T5Lo3RmLogtIYJWvTKXff0oNgjIHQ9WiFdW16wHlwrOZFKRtlbBujBjddIjQj8KaYtU0K7jWl1tK3FClKQJ3yoI4Thj_kCU9RVccRWeSJuCHqFBt_atdBznTdoQfG1Tmp2snN5cNDpI3Z29xB3qBW7wmRUGexvoOINOZtfXuONu9gXx1q_AL1_SoD4ul_jFKa4oQOOu4dTH9rITnhas0u-Scc0AaPcXvA",
  },
  {
    quote:
      "As a technician, I can finally see all my tasks in one place without chasing paper slips. The image uploads help me know exactly what tools to bring.",
    name: "Rajesh Kumar",
    role: "Senior Technician",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdn_wtzm58uYrmoBFxW7aFP07uF3JGYJmHqB9owWWGqFmCBdoT4nqNQImVNz0D27eK1p-sI-9slmwKL7_map-QisThrmuKOk31x5slWaSAhj2x-TJg37racpPMxNFru9rq4ssCc-8C_70cB7fmMNoRI95UCSqrkeLdcI3G3wOdzXJbm57p7MFA943f-rVEUFKNfDf_HULz2tak2HujO9Gd4Ac2gQY7PHGb8LGUvg9l70tJXMr4bUMYcw",
  },
];

export default function Testimonials() {
  return (
    <section id="feedback" className="py-24 md:py-32 bg-gradient-to-br from-[#051124] via-[#0f4c81] to-[#1e1b4b] text-white relative overflow-hidden">
      {/* Vibrant Blue Glow decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-blue-600/25 rounded-full blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading eyebrow="Success Stories" title="Trusted by Campus Administrators" light />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {TESTIMONIALS.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 100}>
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/15 p-10 rounded-3xl relative overflow-hidden h-full flex flex-col justify-between hover:border-sky-400/40 transition-all duration-300 shadow-2xl group">
                <Icon
                  name="format_quote"
                  className="absolute -top-4 -right-4 text-9xl opacity-10 text-sky-400 group-hover:scale-110 transition-transform"
                />
                <p className="text-lg mb-10 leading-relaxed italic font-body-lg text-slate-100 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-5 relative z-10 mt-auto border-t border-white/15 pt-6">
                  <div className="w-14 h-14 rounded-full border-2 border-sky-400/60 overflow-hidden relative shrink-0 shadow-lg shadow-sky-500/20">
                    <Image
                      src={testimonial.avatar}
                      alt={`Portrait of ${testimonial.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-white">{testimonial.name}</div>
                    <div className="text-sm text-sky-300 font-mono font-semibold">{testimonial.role}</div>
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
