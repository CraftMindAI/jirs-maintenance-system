import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/landing/Hero";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import ContactSection from "@/components/landing/ContactSection";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <WhyChooseUs />
      <Features />
      <Testimonials />
      <ContactSection />
    </PageShell>
  );
}

