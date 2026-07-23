import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative h-[550px] md:h-[680px] flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-40 scale-105"
          role="img"
          aria-label="Aerial view of the JIRS campus at golden hour"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAYADtmeJXrbufHdFJEFvK3HsQRH6YHOJ8K6BPNih3BBZ_GYvP_BMKvNccAbiuSO7sRIs6p9wg44cD8NaQeC35iW1MXiGUEtpVIEpatVy6ZcJ-Uo_jviR66N6kG9cqhyb2IZK-pl2wId_qvzA9mPCczV4ezBqmcoAPfn65szIGYQ8zedK10JaGg06eNE_8QNd-2o9NFrwlSrLZsJ5A1s-sCxHrWZ7l3m_UZ_nZK1OJLPQIv6_uSFXG1A')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(15, 76, 129, 0.3) 0%, transparent 60%)" />
      </div>
      <div className="relative z-10 px-margin-mobile md:px-margin-desktop text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold text-primary dark:text-blue-300 mb-6 uppercase tracking-wider">
          System Overview
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-[1.15] tracking-tight">
          About JIRS Maintenance <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Management System</span>
        </h1>
        <p className="text-slate-300 font-body-lg mb-10 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Empowering a world-class educational environment through digital
          precision, operational transparency, and rapid infrastructure support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="bg-primary hover:bg-opacity-95 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 text-sm">
            Raise a Complaint
          </Link>
          <Link href="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm">
            Explore Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
