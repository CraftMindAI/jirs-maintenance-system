import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const VALUES = [
  { icon: "verified_user", label: "Integrity" },
  { icon: "assignment_ind", label: "Responsibility" },
  { icon: "stars", label: "Excellence" },
  { icon: "lightbulb", label: "Innovation" },
  { icon: "handshake", label: "Collaboration" },
  { icon: "volunteer_activism", label: "Respect" },
  { icon: "visibility", label: "Transparency" },
  { icon: "fact_check", label: "Accountability" },
];

export default function ValuesGrid() {
  return (
    <section className="py-24">
      <Container>
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-12 text-center">
          The Values We Live By
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {VALUES.map((value, i) => (
            <Reveal key={value.label} delay={(i % 4) * 75}>
              <div className="group p-8 text-center bg-white dark:bg-slate-900 border border-outline-variant/20 dark:border-white/5 rounded-2xl hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-slate-950 transition-all duration-300 cursor-default shadow-sm hover:shadow-xl hover:-translate-y-1">
                <Icon
                  name={value.icon}
                  className="text-3xl mb-4 text-primary dark:text-blue-300 group-hover:text-white dark:group-hover:text-slate-950 transition-colors"
                />
                <h6 className="font-bold tracking-tight text-primary dark:text-slate-100 group-hover:text-white dark:group-hover:text-slate-950 transition-colors">{value.label}</h6>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
