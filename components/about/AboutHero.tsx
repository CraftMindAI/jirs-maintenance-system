export default function AboutHero() {
  return (
    <section className="relative h-[600px] md:h-[819px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          role="img"
          aria-label="Aerial view of the JAIN International Residential School campus at golden hour"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAYADtmeJXrbufHdFJEFvK3HsQRH6YHOJ8K6BPNih3BBZ_GYvP_BMKvNccAbiuSO7sRIs6p9wg44cD8NaQeC35iW1MXiGUEtpVIEpatVy6ZcJ-Uo_jviR66N6kG9cqhyb2IZK-pl2wId_qvzA9mPCczV4ezBqmcoAPfn65szIGYQ8zedK10JaGg06eNE_8QNd-2o9NFrwlSrLZsJ5A1s-sCxHrWZ7l3m_UZ_nZK1OJLPQIv6_uSFXG1A')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 backdrop-blur-[2px]" />
      </div>
      <div className="relative z-10 px-margin-mobile md:px-margin-desktop text-center max-w-4xl">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          About JIRS Maintenance Management System
        </h1>
        <p className="text-white/90 font-body-lg mb-10">
          Empowering a world-class educational environment through digital
          precision, operational transparency, and rapid infrastructure
          support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all">
            Raise a Complaint
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
            Explore Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
