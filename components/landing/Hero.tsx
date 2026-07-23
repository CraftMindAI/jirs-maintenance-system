import Icon from "@/components/ui/Icon";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          role="img"
          aria-label="An expansive aerial view of the prestigious JAIN International Residential School campus"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmyxyG3XHmCCj-oGFGjDSKdfxmN3mH7G7WcqSxhJRm1pjLmaJhIQG8CfDBTZzeg3cnk7gDMHpw6wEsUuQy0YpvGKjblOlWc6UgkH7jC0RRu5X2-wVsS5jG_t5PHRiposN1fprzEf6hQIGueL4A7KOZJuIYMAmJYciuMUIyhCoOOjTT4CXB4fd6qqF-bSB1fzq0jW_J74w2AEUe1IGv_mLPFsM-ChxqFcOPtAmPDm-mvXWA0thNAFrsPw')",
          }}
        />
      </div>
      <div className="relative z-20 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-white">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-sm font-label-md">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Digital Excellence in Campus Management
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.1] font-bold drop-shadow-sm">
            JIRS Maintenance <br /> <span className="text-tertiary-fixed">Management System</span>
          </h1>
          <p className="font-body-lg text-lg opacity-90 max-w-xl leading-relaxed">
            Elevating the JIRS residential experience through a centralized,
            enterprise-grade digital platform for precision facility
            management and real-time resolution.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-secondary-container text-white px-10 py-4 rounded-xl font-label-md font-bold hover:bg-secondary hover:shadow-xl hover:shadow-secondary/30 transition-all flex items-center gap-2">
              Raise Complaint <Icon name="arrow_forward" className="text-sm" />
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-xl font-label-md font-bold hover:bg-white/20 transition-all">
              View Status
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
