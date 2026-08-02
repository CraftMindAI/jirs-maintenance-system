import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/landing/Hero";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Features from "@/components/landing/Features";
import ProcessTimeline from "@/components/landing/ProcessTimeline";
import Testimonials from "@/components/landing/Testimonials";
import ContactSection from "@/components/landing/ContactSection";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <WhyChooseUs />
      <Features />
      <ProcessTimeline />
      <Testimonials />
      <ContactSection />
    </PageShell>
  );
}
