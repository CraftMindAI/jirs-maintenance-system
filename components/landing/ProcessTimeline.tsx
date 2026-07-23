import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const STEPS = [
  {
    number: 1,
    title: "Report",
    description: "Initiate a request with comprehensive details and media.",
    accent: "border-primary text-primary group-hover:bg-primary",
  },
  {
    number: 2,
    title: "Assign",
    description: "Smart allocation to specialized technicians based on load.",
    accent: "border-primary text-primary group-hover:bg-primary",
  },
  {
    number: 3,
    title: "Resolve",
    description: "On-site technical resolution and digital progress logging.",
    accent: "border-primary text-primary group-hover:bg-primary",
  },
  {
    number: 4,
    title: "Verify",
    description: "Final satisfaction check before the ticket is archived.",
    accent: "border-success text-success group-hover:bg-success",
  },
];

export default function ProcessTimeline() {
  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <Container>
        <SectionHeading eyebrow="Process" title="The Maintenance Journey" />
        <div className="relative max-w-5xl mx-auto mt-12">
          <div className="absolute top-[32px] left-0 w-full h-[3px] bg-gradient-to-r from-primary/30 to-emerald-500/30 hidden lg:block" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="flex flex-col items-center text-center group">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 ${step.accent} flex items-center justify-center text-xl font-black relative z-10 mb-8 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}
                  >
                    {step.number}
                  </div>
                  <h5 className="font-headline font-bold text-primary dark:text-slate-100 mb-3 text-lg">{step.title}</h5>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm px-4 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
