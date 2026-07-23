import Icon from "@/components/ui/Icon";

export default function FeedbackCta() {
  return (
    <section className="bg-surface-container py-20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary mb-4">
          Your Feedback Helps Us Improve
        </h2>
        <p className="font-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Every suggestion, critique, or compliment helps us build a more
          reliable maintenance ecosystem for everyone at JIRS.
        </p>
        <a
          href="#feedback-form"
          className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-headline font-semibold hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Share Your Feedback <Icon name="edit_note" />
        </a>
      </div>
    </section>
  );
}
