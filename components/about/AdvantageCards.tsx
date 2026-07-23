import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";

const ADVANTAGES = [
  {
    icon: "apartment",
    title: "World-Class Campus",
    description:
      "A sprawling 350-acre facility with state-of-the-art hostels, labs, and recreation zones.",
  },
  {
    icon: "sports_basketball",
    title: "Sports Excellence",
    description:
      "Professional-grade sports complexes, olympic-sized pools, and expert coaching for over 30 disciplines.",
  },
  {
    icon: "school",
    title: "Expert Faculty",
    description:
      "90+ dedicated residential faculty members fostering a 1:8 teacher-student ratio for personalized care.",
  },
];

export default function AdvantageCards() {
  return (
    <section className="py-24">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
            The JIRS Advantage
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ADVANTAGES.map((advantage, i) => (
            <Reveal key={advantage.title} delay={i * 100}>
              <div className="p-8 rounded-2xl border border-outline-variant/30 hover:shadow-xl transition-all bg-surface h-full">
                <Icon name={advantage.icon} className="text-primary text-3xl mb-4" />
                <h4 className="font-headline text-lg font-semibold mb-2">{advantage.title}</h4>
                <p className="text-on-surface-variant">{advantage.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
