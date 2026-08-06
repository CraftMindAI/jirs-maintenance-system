import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Container from "@/components/ui/Container";
import FeedbackHero from "@/components/feedback/FeedbackHero";
import FeedbackFormCard from "@/components/feedback/FeedbackFormCard";
import FeedbackFeed from "@/components/feedback/FeedbackFeed";
import FeedbackCta from "@/components/feedback/FeedbackCta";

export const metadata: Metadata = {
  title: "Feedback | JFM",
  description: "Share your experience with the JIRS Maintenance Management System.",
};

export default function FeedbackPage() {
  return (
    <PageShell>
      <FeedbackHero />
      <section className="py-16 md:py-24 bg-[#030812] text-white min-h-[50vh]">
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-1">
            <FeedbackFormCard />
          </div>
          <div className="lg:col-span-2">
            <FeedbackFeed />
          </div>
        </Container>
      </section>
      <FeedbackCta />
    </PageShell>
  );
}
