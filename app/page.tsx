import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/landing/Hero";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Features from "@/components/landing/Features";
import ContactSection from "@/components/landing/ContactSection";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <WhyChooseUs />
      <Features />
      <ContactSection />
    </PageShell>
  );
}

