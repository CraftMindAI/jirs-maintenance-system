import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const STATS = [
  { value: "350+", label: "ACRE CAMPUS" },
  { value: "Global", label: "CURRICULUM" },
];

export default function LegacySection() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/3]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcw9E2gmS-NkVbJzzPuYf3L9IjlcuWsmS4IvsHaDFWasP-CvR8udLPVEfTnkkcwU41NKRLxG108csYXMRwSBhTJImMgBPDqGe6vanLKebMvDsLNdl1xtCamIonsKQkh_tjGI-k6KR_rfOxpQ9s3WQ6IweZwS_8m55REPRmIDTuovOrth2VnSO_bgtvYZcMkA272RQXCr5Pw4a-4S6TJYP8j7HblfRuWyU1MaNUxl1GlVCF3e54iF-mMw"
                  alt="Entrance gate of JIRS campus"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 glass-card p-8 rounded-2xl shadow-xl border border-white/50 hidden lg:block">
                <div className="flex flex-col">
                  <span className="text-primary font-bold text-3xl">1999</span>
                  <span className="text-on-surface-variant font-label-md">YEAR FOUNDED</span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-6">
                Legacy of Excellence
              </h2>
              <p className="font-body-lg text-on-surface-variant mb-6">
                Founded in 1999 by the visionary educationist Dr. Chenraj
                Roychand, JAIN International Residential School (JIRS) has
                grown into one of India&rsquo;s premier residential schools.
                Our 350-acre sprawling campus is more than just a school;
                it&rsquo;s a global learning hub.
              </p>
              <p className="font-body-lg text-on-surface-variant mb-8">
                Guided by an international curriculum and traditional Indian
                values, we foster an environment where 700+ learners from
                across the globe grow into ethical leaders of tomorrow.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="p-4 bg-surface-container rounded-xl">
                    <span className="block text-primary font-bold text-xl">{stat.value}</span>
                    <span className="text-label-md opacity-70">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
