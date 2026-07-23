import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";

const FAQS = [
  {
    question: "How do I track my submitted complaint?",
    answer:
      'Once logged in, navigate to the "My Tasks" or "History" tab. You will see a comprehensive list of your complaints with their current live status (Pending, Assigned, In-Progress, Resolved).',
  },
  {
    question: "Who can use the JMMS portal?",
    answer:
      "All registered students, faculty members, and residential staff of JIRS are granted access to use the portal for reporting facility-related issues across the campus.",
  },
  {
    question: "How are priorities determined?",
    answer:
      "System priorities are automatically calculated based on safety impact, facility type, and location significance. For example, electrical safety hazards are instantly flagged as high-priority.",
  },
];

export default function Faq() {
  return (
    <section className="py-24 md:py-32">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="Support" title="Frequently Asked Questions" />
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <details
              key={faq.question}
              className="group bg-white border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              open={i === 0}
            >
              <summary className="flex justify-between items-center p-8 cursor-pointer font-bold text-primary hover:bg-surface-container-low transition-colors list-none">
                <span className="text-xl">{faq.question}</span>
                <Icon
                  name="expand_more"
                  className="group-open:rotate-180 transition-transform text-secondary-container"
                />
              </summary>
              <div className="p-8 pt-0 text-on-surface-variant leading-relaxed border-t border-outline-variant/10 font-body-lg">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
