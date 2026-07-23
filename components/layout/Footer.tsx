import Link from "next/link";
import Icon from "@/components/ui/Icon";

const FOOTER_COLUMNS = [
  {
    title: "System Services",
    links: [
      { label: "Maintenance Portal", href: "/" },
      { label: "Admin Dashboard", href: "/login" },
      { label: "Technician Hub", href: "/login" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About JIRS", href: "/about-us" },
      { label: "User Feedback", href: "/feedback" },
      { label: "Submit Ticket", href: "/login" },
    ],
  },
  {
    title: "Legal & Info",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 py-20 px-margin-mobile md:px-margin-desktop text-white border-t border-slate-900">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Icon name="school" className="text-3xl text-primary" />
            <span className="font-display text-3xl font-black tracking-wider">JMMS</span>
          </div>
          <p className="font-body-md text-slate-400 leading-relaxed">
            Elevating residential life through professional, enterprise-grade
            facility maintenance management at Jain International Residential School.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="space-y-6">
            <h6 className="font-headline text-lg font-bold text-slate-200 tracking-wide">{column.title}</h6>
            <div className="flex flex-col gap-4">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-container-max mx-auto pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-label-sm text-slate-500">
          © 2026 JAIN International Residential School. All rights reserved.
        </p>
        <div className="flex gap-6 text-slate-500">
          <Icon name="language" className="cursor-pointer hover:text-white transition-colors" />
          <Icon name="security" className="cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </footer>
  );
}
