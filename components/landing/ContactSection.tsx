import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";

const CONTACT_DETAILS = [
  { icon: "mail", label: "Email Support", value: "jirsmaintenance@gmail.com" },
  { icon: "call", label: "Emergency Hotline", value: "+91 7899888099" },
  { icon: "location_on", label: "Campus Office", value: "Jain Global Campus, Bangalore" },
];

export default function ContactSection() {
  return (
    <section className="py-24 md:py-32 bg-surface-container-low/30">
      <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-secondary-container font-label-md uppercase tracking-widest">
              Connect
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-primary">
              Get in Touch
            </h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              Our specialized administration team is dedicated to ensuring
              your campus experience remains seamless and well-maintained.
            </p>
          </div>
          <div className="space-y-8">
            {CONTACT_DETAILS.map((detail) => (
              <div key={detail.label} className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-outline-variant/10 dark:border-white/5 shadow-xl flex items-center justify-center text-primary dark:text-blue-300 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={detail.icon} className="text-3xl" />
                </div>
                <div>
                  <div className="font-bold text-primary dark:text-slate-100 text-lg tracking-tight">{detail.label}</div>
                  <div className="text-on-surface-variant dark:text-slate-400 text-sm mt-0.5">{detail.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 relative group">
          <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-1000"
              role="img"
              aria-label="Minimalist digital map of JIRS campus"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZVwgtzDPFF8WjMLTW3MpQIscbZfrqvYYxNhJe30AFpz1VUQXXEXR4J3AQE1mLuFY6M47-EXFnR_LY8rt_DPIVOd6PKntxi4I55BLhIjaTOm1Gl9mPGxhylBYuuaISpL0eRi8bNN8yWBx-l1C8b13Oiy2TCkot-FciW8QhuNu5hBPKPZC9cS2mHdQpHgRvZhMuz6ZHb131HOpHdyRquhRDPLaaMw4Pkyl_gj2JWwjCkLMP1mgPsFoBQA')",
              }}
            />
            <div className="relative z-10 text-center p-8 space-y-4 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/5 mx-6 md:mx-10 shadow-xl">
              <Icon name="location_on" className="text-5xl text-primary dark:text-blue-300 animate-bounce" />
              <p className="font-bold text-xl text-primary dark:text-slate-100">JIRS Global Campus</p>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">Kanakapura Road, Bangalore</p>
              <button className="text-primary dark:text-blue-300 font-bold text-sm uppercase tracking-widest border-b-2 border-primary dark:border-blue-300 pt-2 transition-all hover:opacity-85">
                Open Maps
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
