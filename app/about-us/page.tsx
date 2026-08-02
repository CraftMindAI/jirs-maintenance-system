import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import AboutHero from "@/components/about/AboutHero";
import LegacySection from "@/components/about/LegacySection";
import AdvantageCards from "@/components/about/AdvantageCards";
import AdmissionsSection from "@/components/about/AdmissionsSection";
import CtaBanner from "@/components/ui/CtaBanner";
import FloatingActions from "@/components/about/FloatingActions";

export const metadata: Metadata = {
  title: "About Us | JAIN International Residential School",
  description:
    "Learn about JIRS and how the Maintenance Management System supports its world-class residential campus.",
};

export default function AboutUsPage() {
  return (
    <PageShell>
      <AboutHero />
      <LegacySection />
      <AdvantageCards />
      <AdmissionsSection />
      <CtaBanner
        title="Experience Smart Campus Maintenance"
        description="Join hundreds of staff members already using JMMS to keep JIRS at the pinnacle of educational infrastructure."
        primaryLabel="Register Now"
        primaryHref="/signup"
        secondaryLabel="Login to Portal"
        secondaryHref="/login"
      />
      <FloatingActions />
    </PageShell>
  );
}
