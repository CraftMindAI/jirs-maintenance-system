import Link from "next/link";
import Icon from "@/components/ui/Icon";

const FOOTER_COLUMNS = [
  {
    title: "System",
    links: [
      { label: "Maintenance Portal", href: "/" },
      { label: "Admin Dashboard", href: "/" },
      { label: "Technician App", href: "/" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About JIRS", href: "/about-us" },
      { label: "Feedback", href: "/feedback" },
      { label: "Support Center", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-primary py-20 px-margin-mobile md:px-margin-desktop text-white">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <span className="font-display text-3xl font-bold">JMMS</span>
          <p className="font-body-md opacity-70 leading-relaxed">
            Elevating residential life through professional, enterprise-grade
            facility maintenance management at JIRS.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="space-y-6">
            <h6 className="font-headline text-lg font-semibold">{column.title}</h6>
            <div className="flex flex-col gap-4">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="opacity-70 hover:opacity-100 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-container-max mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-label-sm opacity-60">
          © 2026 JAIN International Residential School. All rights reserved.
        </p>
        <div className="flex gap-6 opacity-60">
          <Icon name="language" className="cursor-pointer hover:opacity-100" />
          <Icon name="security" className="cursor-pointer hover:opacity-100" />
        </div>
      </div>
    </footer>
  );
}
