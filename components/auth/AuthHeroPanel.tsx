import Icon from "@/components/ui/Icon";

export default function AuthHeroPanel() {
  return (
    <div className="relative hidden h-screen w-full lg:flex lg:w-1/2 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center opacity-60 scale-105"
          role="img"
          aria-label="Cinematic view of the JAIN International Residential School campus at golden hour"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_ev9QCelm3ZYzNbZveaewBkkRBD1WTJDoeaP1kSpDzEgmWhRJBibQKOBrbC1TsHpOpQ7oVK2hk4EFO6t7Oc4zTCSh6x8M1rK9pPHnqQgqx2UounK5QMeNDTtuQZiPNmSAQjB8W6JX9udnVtGLiiIh-4CTSLUNF7GQwMHK-cOI9Sv8WQwNVZBv8NKMfI9egg2fhaxX3ttaLxVVkZzWVA0EsT58KwqRtzKb91cEUMhN13JaLUaDoEYDUA')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/70 to-primary/30" />
      </div>
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <Icon name="school" className="text-[32px] text-primary" />
          <h1 className="font-display text-xl font-black tracking-widest uppercase">JMMS</h1>
        </div>
        <div className="glass-card max-w-lg rounded-3xl p-10 shadow-2xl border border-white/10">
          <Icon name="format_quote" filled className="text-[48px] text-primary opacity-60 mb-4" />
          <p className="font-headline text-lg mb-6 leading-relaxed italic text-slate-100">
            &ldquo;Enlightenment through education is the highest form of
            service to humanity. We strive to maintain the sanctuary where
            knowledge meets character.&rdquo;
          </p>
          <div className="h-[2px] w-16 bg-primary rounded-full mb-4" />
          <p className="font-label-md uppercase tracking-widest text-xs font-bold text-primary">
            JAIN International Residential School
          </p>
          <p className="font-body-md mt-1 opacity-70 text-sm">
            Infrastructure &amp; Maintenance Division
          </p>
        </div>
        <div className="flex gap-6 font-label-md uppercase opacity-60 text-xs font-bold tracking-wider">
          <span>Precision</span>
          <span>•</span>
          <span>Efficiency</span>
          <span>•</span>
          <span>Heritage</span>
        </div>
      </div>
    </div>
  );
}
