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
            <span className="text-primary font-bold uppercase tracking-widest text-sm">
              Capabilities
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary dark:text-slate-100">
              Powerful Core Features
            </h2>
            <p className="font-body-lg text-on-surface-variant dark:text-slate-400">
              Every tool you need to maintain excellence across the
              residential ecosystem with enterprise efficiency.
            </p>
          </div>
          <button className="bg-primary hover:bg-opacity-90 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 shadow-sm shrink-0">
            Explore All Features <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 100}>
              <div className="bg-white dark:bg-slate-900/60 p-8 rounded-3xl border border-outline-variant/20 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group h-full card-shine">
                <div className="bg-primary/5 dark:bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary dark:text-blue-300 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon name={feature.icon} className="text-2xl" />
                </div>
                <h4 className="font-headline font-bold text-primary dark:text-slate-100 mb-3 text-lg">{feature.title}</h4>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
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
