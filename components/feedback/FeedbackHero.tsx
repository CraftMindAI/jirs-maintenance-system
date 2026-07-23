import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";

export default function FeedbackHero() {
  return (
    <section className="relative py-16 overflow-hidden bg-primary">
      <Container className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl">
          <nav className="flex items-center gap-2 text-white/60 font-label-sm mb-4">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Icon name="chevron_right" className="text-[14px]" />
            <span className="text-white">Feedback</span>
          </nav>
          <h1 className="font-headline text-3xl md:text-4xl font-semibold text-white mb-6">
            Community Feedback
          </h1>
          <p className="font-body-lg text-white/80 leading-relaxed">
            We value your feedback! Share your experience with the JIRS
            Maintenance Management System and help us improve our digital
            maintenance services for a better campus life.
          </p>
        </div>
        <div className="hidden lg:block w-96 h-96 relative shrink-0">
          <div className="absolute inset-0 bg-secondary-container/20 blur-3xl rounded-full" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7PFdXlGAnMDyziyE-BefwLwm71_S3d7X5BcbeA7D9K63n5_P8pOPN1Y2OSt9-4euD03N3tZ_U1sR_SkEFi-J7LZ5btfPkMMdUPpOli8WUqOK7OIdmYwmvZ65Pz1L-ZdjMo5Uyd_UQzal7S2tuzvVapSioJrUYJ7FAWDJhU65wi1-DPZ3b6tfSuhvpGTtmwyBMoB_c6cj7tKhnFN-8g2NN5AQTSWsaxrudwKw-yYDYSuetjF_ODFAh_w"
            alt="Illustration of a community sharing feedback"
            fill
            className="relative z-10 object-contain"
          />
        </div>
      </Container>
    </section>
  );
}
