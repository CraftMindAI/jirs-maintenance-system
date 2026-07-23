import Link from "next/link";
import Icon from "@/components/ui/Icon";

const ITEMS = [
  { label: "Home", icon: "home", href: "/", active: true },
  { label: "Tasks", icon: "list_alt", href: "/" },
  { label: "Feedback", icon: "feedback", href: "/feedback" },
  { label: "Profile", icon: "person", href: "/login" },
];

export default function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-around items-center h-16 bg-white/90 backdrop-blur-xl border border-outline-variant/30 shadow-2xl rounded-2xl overflow-hidden px-2">
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center justify-center flex-1 ${
            item.active ? "text-primary" : "text-on-surface-variant"
          }`}
        >
          <Icon name={item.icon} filled={item.active} />
          <span className="text-[10px] font-bold mt-1 uppercase">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
