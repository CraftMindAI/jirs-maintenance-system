"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

export type MenuItem = {
  label: string;
  icon: string;
  href: string;
};

export type QuickAction = {
  label: string;
  icon: string;
  href: string;
};

const ADMIN_MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/admin" },
  { label: "All Complaints", icon: "assignment_late", href: "/admin/view-complaints" },
  { label: "Technicians", icon: "engineering", href: "/admin/track-complaints" },
  { label: "Feedbacks", icon: "comment", href: "/admin/feedbacks" },
  { label: "Reports", icon: "inventory_2", href: "/admin/reports" },
  { label: "User Management", icon: "group", href: "/admin/user-management" },
  { label: "Settings", icon: "settings_applications", href: "/admin/settings" },
];

const ADMIN_QUICK_ACTION: QuickAction = { label: "Raise Complaint", icon: "add_circle", href: "/admin/raise-complaint" };

export default function Sidebar({
  darkMode = true,
  onLogout,
  menuItems = ADMIN_MENU_ITEMS,
  brandTitle = "JMMS Admin",
  brandSubtitle = "Facility Management",
  quickAction = ADMIN_QUICK_ACTION,
  mobileOpen = false,
  setMobileOpen,
}: {
  darkMode?: boolean;
  onLogout: () => void;
  menuItems?: MenuItem[];
  brandTitle?: string;
  brandSubtitle?: string;
  quickAction?: QuickAction | null;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={`flex flex-col h-screen w-64 fixed left-0 top-0 border-r py-6 px-4 z-50 transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          darkMode
            ? "bg-[#171f33] border-[#464554]/20 text-[#dae2fd]"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 vibrant-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8083ff]/20 shrink-0">
              <Icon name="architecture" className="text-2xl" />
            </div>
            <div>
              <h2 className={`font-display text-lg font-extrabold tracking-tight ${darkMode ? "text-[#c0c1ff]" : "text-primary"}`}>
                {brandTitle}
              </h2>
              <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${darkMode ? "text-[#908fa0]" : "text-slate-500"}`}>
                {brandSubtitle}
              </p>
            </div>
          </div>

          {/* Close button for Mobile */}
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Icon name="close" className="text-xl" />
            </button>
          )}
        </div>

      {/* Action Button: Quick Action */}
      {quickAction && (
        <Link
          href={quickAction.href}
          onClick={() => setMobileOpen?.(false)}
          className="flex items-center gap-3 px-4 py-3 mb-6 vibrant-gradient text-white font-bold rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-[#8083ff]/20 text-xs uppercase tracking-wider"
        >
          <Icon name={quickAction.icon} className="text-xl" />
          <span>{quickAction.label}</span>
        </Link>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 custom-scrollbar overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                active
                  ? darkMode
                    ? "bg-[#c0c1ff]/10 text-[#c0c1ff] font-bold border border-[#c0c1ff]/20"
                    : "bg-primary/10 text-primary font-bold border border-primary/20"
                  : darkMode
                  ? "text-[#c7c4d7] hover:bg-[#222a3d] hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon name={item.icon} className="text-xl" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className={`mt-auto pt-4 space-y-1 border-t ${darkMode ? "border-[#464554]/10" : "border-slate-200"}`}>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold cursor-pointer"
        >
          <Icon name="logout" className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
