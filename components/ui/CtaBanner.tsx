import Link from "next/link";
import Container from "@/components/ui/Container";

export default function CtaBanner({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryHref = "/signup",
  secondaryHref = "/login",
}: {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="py-20">
      <Container>
        <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-secondary rounded-full opacity-10 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-white mb-6">
              {title}
            </h2>
            <p className="text-white/80 font-body-lg mb-10 max-w-2xl mx-auto">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={primaryHref}
                className="bg-white text-primary px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-slate-950/20"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="bg-white/10 border border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
