import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

export default function AdmissionsSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-[#0b1c30] via-[#0f4c81] to-[#1e1b4b] text-white relative overflow-hidden">
      {/* Background glowing lighting */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-8 md:gap-16 items-center">
          
          {/* LEFT SIDE: CONTENT & CENTERED JOIN US BUTTON */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-[1.12] tracking-tight text-white">
                Admissions Open for Great <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-emerald-400">
                  Learning Experience & Sports
                </span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="font-body-lg text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Join JAIN International Residential School to experience world-class academic support, premier sports academy infrastructure, and holistic personality development in a safe, nurturing campus.
              </p>
            </Reveal>

            {/* CENTERED JOIN US BUTTON */}
            <Reveal delay={200}>
              <div className="pt-2 flex justify-center lg:justify-start">
                <a
                  href="https://www.jirs.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm tracking-wider uppercase shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all cursor-pointer gap-2.5 border border-white/20 group/btn"
                >
                  <span>Join Us</span>
                  <Icon name="open_in_new" className="text-base group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* RIGHT SIDE: 3D FOCAL CARD IMAGE SHOWCASE (MIDDLE FOCUSED ON RIGHT) */}
          <div className="lg:col-span-6 relative py-4">
            <Reveal delay={200}>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3">
                
                {/* LEFT FLANKING CARD: Admission2.jpg */}
                <div className="w-full sm:w-1/3 h-[200px] sm:h-[240px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl transform sm:-rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 group/img relative bg-slate-900">
                  <img
                    src="/Admission1.jpg"
                    alt="JIRS Campus Life"
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700 opacity-90 group-hover/img:opacity-100"
                  />
                  
                </div>

                {/* CENTER FOCUSED HERO CARD: Admission1.jpg (LARGER & ELEVATED IN MIDDLE) */}
                <div className="w-full sm:w-5/12 h-[260px] sm:h-[310px] rounded-3xl overflow-hidden border-2 border-sky-400 shadow-2xl shadow-sky-500/25 z-20 transform sm:scale-105 hover:scale-110 transition-all duration-500 group/img relative bg-slate-900">
                  <img
                    src="/Admission2.jpg"
                    alt="JIRS Great Learning Experience"
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                  />
                   
                  
                </div>

                {/* RIGHT FLANKING CARD: Admission3.jpg */}
                <div className="w-full sm:w-1/3 h-[200px] sm:h-[240px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl transform sm:rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 group/img relative bg-slate-900">
                  <img
                    src="/Admission3.jpg"
                    alt="JIRS Sports Academy"
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700 opacity-90 group-hover/img:opacity-100"
                  />
                  
                </div>

              </div>
            </Reveal>
          </div>

        </div>
      </Container>
    </section>
  );
}
