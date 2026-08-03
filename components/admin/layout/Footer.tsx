import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 lg:px-10 bg-[#060e20] border-t border-[#464554]/10 mt-6 md:mt-12">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 vibrant-gradient rounded-xl flex items-center justify-center text-white shadow-md">
              <Icon name="architecture" className="text-xl" />
            </div>
            <h4 className="font-display text-xl font-extrabold text-[#dae2fd]">JMMS Admin</h4>
          </div>
          <p className="text-[#c7c4d7] leading-relaxed text-xs opacity-70">
            Industry-leading facility management engine for Jain International Residential School. Real-time intelligence and automated maintenance workflows.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:gap-12 text-xs">
          <div>
            <h5 className="font-bold text-[#dae2fd] text-[10px] uppercase tracking-[0.2em] mb-4">System</h5>
            <ul className="space-y-3 font-semibold text-[#c7c4d7]">
              <li><Link href="/admin" className="hover:text-[#c0c1ff] transition-colors">Overview</Link></li>
              <li><Link href="/admin/view-complaints" className="hover:text-[#c0c1ff] transition-colors">Incidents</Link></li>
              <li><Link href="/admin/reports" className="hover:text-[#c0c1ff] transition-colors">Reports</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[#dae2fd] text-[10px] uppercase tracking-[0.2em] mb-4">Support</h5>
            <ul className="space-y-3 font-semibold text-[#c7c4d7]">
              <li><Link href="/admin/settings" className="hover:text-[#c0c1ff] transition-colors">Contact Admin</Link></li>
              <li><Link href="/admin/settings" className="hover:text-[#c0c1ff] transition-colors">Help Docs</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-10 pt-6 border-t border-[#464554]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase text-[#908fa0]">
        <p>Lumina Prism Engine v4.2</p>
        <p>© 2026 JAIN International Residential School. Secure Admin Access.</p>
      </div>
    </footer>
  );
}
