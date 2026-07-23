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
              <div className="group p-8 text-center bg-white rounded-2xl border border-outline-variant/20 hover:bg-primary hover:text-white transition-all duration-300 cursor-default">
                <Icon
                  name={value.icon}
                  className="text-3xl mb-4 text-primary group-hover:text-white transition-colors"
                />
                <h6 className="font-bold">{value.label}</h6>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
