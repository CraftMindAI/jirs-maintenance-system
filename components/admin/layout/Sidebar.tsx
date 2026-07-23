"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

type MenuItem = {
  label: string;
  icon: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "All Complaints", icon: "assignment_late", href: "/admin/view-complaints" },
  { label: "Technicians", icon: "engineering", href: "/admin/track-complaints" },
  { label: "Reports", icon: "inventory_2", href: "/admin/reports" },
  { label: "User Management", icon: "group", href: "/admin/user-management" },
  { label: "Settings", icon: "settings_applications", href: "/admin/settings" },
];

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 glass border-r border-[#464554]/20 py-6 px-4 z-50">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 vibrant-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8083ff]/20 shrink-0">
          <Icon name="architecture" className="text-2xl" />
        </div>
        <div>
          <h2 className="font-display text-lg font-extrabold text-[#c0c1ff] tracking-tight">JMMS Admin</h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#908fa0]">Facility Management</p>
        </div>
      </div>

      {/* Action Button: Raise Complaint */}
      <Link
        href="/admin/raise-complaint"
        className="flex items-center gap-3 px-4 py-3 mb-6 vibrant-gradient text-white font-bold rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#8083ff]/20 text-xs uppercase tracking-wider"
      >
        <Icon name="add_circle" className="text-xl" />
        <span>Raise Complaint</span>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 custom-scrollbar overflow-y-auto pr-1">
        {MENU_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                active
                  ? "bg-[#c0c1ff]/10 text-[#c0c1ff] font-bold border border-[#c0c1ff]/20"
                  : "text-[#c7c4d7] hover:bg-[#222a3d] hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="text-xl" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 space-y-1 border-t border-[#464554]/10">
        <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-[#c7c4d7] hover:bg-[#222a3d] hover:text-white rounded-xl transition-all text-sm font-semibold">
          <Icon name="help_outline" className="text-xl" />
          <span>Help Center</span>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold cursor-pointer"
        >
          <Icon name="logout" className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
