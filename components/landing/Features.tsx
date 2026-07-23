import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const FEATURES = [
  {
    icon: "add_circle",
    title: "Raise Complaint",
    description: "Seamless 3-step reporting designed for students, staff, and faculty.",
  },
  {
    icon: "photo_camera",
    title: "Image Upload",
    description: "Attach real-time photos to tickets for immediate visual context.",
  },
  {
    icon: "history",
    title: "Audit Timeline",
    description: "Transparent history logs of every action taken on your request.",
  },
  {
    icon: "admin_panel_settings",
    title: "Role-Based Access",
    description: "Secure permissions for Admins, Technicians, and Users.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-surface-container-low/50">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-20 gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-secondary-container font-label-md uppercase tracking-widest">
              Capabilities
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
              Powerful Core Features
            </h2>
            <p className="font-body-lg text-on-surface-variant">
              Every tool you need to maintain excellence across the
              residential ecosystem with enterprise efficiency.
            </p>
          </div>
          <button className="bg-primary text-white px-8 py-4 rounded-xl font-label-md flex items-center gap-3 hover:opacity-95 shadow-lg shadow-primary/10 shrink-0">
            Explore All Features <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 100}>
              <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-xl transition-all group h-full">
                <div className="bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon name={feature.icon} className="text-2xl" />
                </div>
                <h4 className="font-headline font-semibold text-primary mb-3">{feature.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
