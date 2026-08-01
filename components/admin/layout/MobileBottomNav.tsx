"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

export type BottomNavItem = {
  label: string;
  icon: string;
  href: string;
};

export type BottomNavQuickAction = {
  icon: string;
  href: string;
};

const ADMIN_NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", icon: "dashboard", href: "/admin" },
  { label: "Issues", icon: "assignment_late", href: "/admin/view-complaints" },
  { label: "Staff", icon: "engineering", href: "/admin/track-complaints" },
  { label: "Profile", icon: "person", href: "/admin/settings" },
];

const ADMIN_QUICK_ACTION: BottomNavQuickAction = { icon: "add", href: "/admin/raise-complaint" };

export default function MobileBottomNav({
  items = ADMIN_NAV_ITEMS,
  quickAction = ADMIN_QUICK_ACTION,
}: {
  items?: BottomNavItem[];
  quickAction?: BottomNavQuickAction | null;
}) {
  const pathname = usePathname();
  const splitAt = Math.ceil(items.length / 2);
  const firstHalf = quickAction ? items.slice(0, splitAt) : items;
  const secondHalf = quickAction ? items.slice(splitAt) : [];

  const renderItem = (item: BottomNavItem) => (
    <Link
      key={item.label}
      href={item.href}
      className={`flex flex-col items-center justify-center ${pathname === item.href ? "text-[#c0c1ff]" : "text-[#c7c4d7]"}`}
    >
      <Icon name={item.icon} className="text-2xl" />
      <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">{item.label}</span>
    </Link>
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 glass border-t border-[#464554]/20 flex justify-around items-center h-20 px-4 shadow-2xl rounded-t-3xl">
      {firstHalf.map(renderItem)}
      {quickAction && (
        <div className="relative -top-6">
          <Link
            href={quickAction.href}
            className="w-14 h-14 vibrant-gradient rounded-full flex items-center justify-center text-white shadow-xl shadow-[#8083ff]/40 border-4 border-[#0b1326] ring-2 ring-[#8083ff]/20"
          >
            <Icon name={quickAction.icon} className="text-3xl" />
          </Link>
        </div>
      )}
      {secondHalf.map(renderItem)}
    </nav>
  );
}
