import PageShell from "@/components/layout/PageShell";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";

export default function DashboardPlaceholder({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <PageShell>
      <section className="pt-40 pb-24 md:pb-32">
        <Container className="max-w-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
            <Icon name={icon} className="text-4xl" />
          </div>
          <h1 className="font-headline text-3xl font-semibold text-primary">{title}</h1>
          <p className="font-body-lg text-on-surface-variant">{description}</p>
        </Container>
      </section>
    </PageShell>
  );
}
