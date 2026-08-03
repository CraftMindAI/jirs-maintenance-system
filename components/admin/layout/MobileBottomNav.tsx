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
  { label: "Complaints", icon: "assignment_late", href: "/admin/view-complaints" },
  { label: "Feedback", icon: "comment", href: "/admin/feedbacks" },
  { label: "Reports", icon: "inventory_2", href: "/admin/reports" },
  { label: "Users", icon: "group", href: "/admin/user-management" },
  { label: "Settings", icon: "settings_applications", href: "/admin/settings" },
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

  const renderItem = (item: BottomNavItem) => (
    <Link
      key={item.label}
      href={item.href}
      className={`flex flex-col items-center justify-center shrink-0 px-2 py-1 transition-all ${
        pathname === item.href ? "text-[#c0c1ff] font-bold" : "text-[#c7c4d7] hover:text-white"
      }`}
    >
      <Icon name={item.icon} className="text-xl" />
      <span className="text-[10px] mt-0.5 font-bold uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
    </Link>
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 glass border-t border-[#464554]/20 flex items-center h-16 px-3 shadow-2xl rounded-t-2xl">
      <div className="flex items-center justify-between w-full overflow-x-auto hide-scrollbar gap-3 px-1">
        {items.slice(0, 3).map(renderItem)}
        {quickAction && (
          <div className="shrink-0 px-1">
            <Link
              href={quickAction.href}
              className="w-11 h-11 vibrant-gradient rounded-full flex items-center justify-center text-white shadow-xl shadow-[#8083ff]/40 border-2 border-[#0b1326]"
            >
              <Icon name={quickAction.icon} className="text-2xl" />
            </Link>
          </div>
        )}
        {items.slice(3).map(renderItem)}
      </div>
    </nav>
  );
}
