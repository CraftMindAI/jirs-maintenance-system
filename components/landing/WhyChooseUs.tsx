import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const REASONS = [
  {
    icon: "description",
    iconBg: "bg-primary/5",
    hoverBg: "group-hover:bg-primary",
    title: "Paperless Management",
    description:
      "Eliminate bureaucratic delays with a 100% digital workflow for all maintenance logging, approvals, and archives.",
  },
  {
    icon: "my_location",
    iconBg: "bg-secondary-container/10",
    hoverBg: "group-hover:bg-secondary-container",
    title: "Real-time Tracking",
    description:
      "Stay informed with live status updates and geolocation-based assignments for maximum operational transparency.",
  },
  {
    icon: "bolt",
    iconBg: "bg-success/10",
    hoverBg: "group-hover:bg-success",
    title: "Faster Resolution",
    description:
      "Reduce turnaround time significantly using our automated smart-routing and priority assignment engine.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-jmms" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Innovation"
          title="Why Choose JMMS?"
          description="Optimizing campus operations through modern digital infrastructure designed for the prestigious JIRS ecosystem."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 100}>
              <div className="glass-card p-12 rounded-3xl shadow-xl shadow-primary/5 hover:-translate-y-2 transition-all duration-300 group h-full">
                <div
                  className={`w-16 h-16 ${reason.iconBg} rounded-2xl flex items-center justify-center mb-8 ${reason.hoverBg} group-hover:text-white transition-colors`}
                >
                  <Icon name={reason.icon} className="text-4xl" />
                </div>
                <h3 className="font-headline text-2xl font-semibold text-primary mb-4">
                  {reason.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed opacity-80">
                  {reason.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
