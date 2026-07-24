"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type MenuItem = {
  label: string;
  icon: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "home", href: "/technician" },
  { label: "View Complaints", icon: "assignment", href: "/technician/view-complaints" },
  { label: "Reports", icon: "assessment", href: "/technician/reports" },
  { label: "Settings", icon: "settings", href: "/technician/settings" },
];

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; email: string } | null>(null);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              name: data.name || "Technician",
              role: data.role || "Technician",
              email: user.email || "",
            });
          } else {
            setUserProfile({
              name: user.displayName || "Technician",
              role: "Technician",
              email: user.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Technician",
            role: "Technician",
            email: "technician@jirs.ac.in",
          });
        }
      } else {
        // Mock fallback for presentation
        setUserProfile({
          name: "Technician",
          role: "Technician",
          email: "technician@jirs.ac.in",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Theme Toggler
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, idx) => {
      const href = "/" + paths.slice(0, idx + 1).join("/");
      const label = path
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* 1. SIDEBAR (DESKTOP) */}
      <aside
        className={`hidden md:flex flex-col border-r bg-white/95 backdrop-blur-md border-slate-200 dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-300 print:hidden ${
          sidebarCollapsed ? "w-20 px-2 py-6" : "w-64 px-4 py-6"
        }`}
      >
        {/* Brand Header */}
        <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} mb-8 px-2`}>
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Icon name="architecture" className="text-2xl" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h2 className="font-display text-lg font-extrabold tracking-tight text-[#0f4c81] dark:text-blue-400 whitespace-nowrap">
                JMMS Tech
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Maintenance
              </p>
            </div>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={sidebarCollapsed ? item.label : ""}
                className={`flex items-center ${sidebarCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} rounded-xl transition-all font-semibold text-sm ${
                  active
                    ? "bg-[#0f4c81]/10 text-[#0f4c81] dark:bg-blue-500/10 dark:text-blue-400 font-bold border border-[#0f4c81]/20 dark:border-blue-500/20 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon name={item.icon} className="text-xl" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Toggle / User Widget */}
        <div className="mt-auto pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3 px-4"} py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-sm font-bold cursor-pointer`}
          >
            <Icon name={sidebarCollapsed ? "chevron_right" : "chevron_left"} className="text-xl" />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN LAYOUT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all print:hidden">

          {/* Left Side: Hamburg menu / Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-slate-600 dark:text-slate-300 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <Icon name="menu" className="text-xl" />
            </button>

            {/* Breadcrumb paths */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-semibold">
              <Link href="/" className="hover:text-primary dark:hover:text-white transition-colors">
                JMMS
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <Icon name="chevron_right" className="text-xs opacity-60" />
                  <Link
                    href={crumb.href}
                    className={`hover:text-primary dark:hover:text-white transition-colors ${idx === breadcrumbs.length - 1 ? "text-primary dark:text-white font-bold" : ""
                      }`}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Theme & User Avatar Dropdown */}
          <div className="flex items-center gap-4 relative">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              <Icon name={darkMode ? "light_mode" : "dark_mode"} className="text-xl" />
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />

            {/* User Profile Avatar */}
            {userProfile && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#0f4c81]/10 dark:bg-[#8083ff]/20 text-[#0f4c81] dark:text-[#c0c1ff] ring-2 ring-[#0f4c81]/20 dark:ring-[#c0c1ff]/30 group-hover:ring-[#0f4c81]/40 dark:group-hover:ring-[#c0c1ff] transition-all font-black flex items-center justify-center text-sm">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-bold text-xs leading-tight text-slate-800 dark:text-slate-100">
                      {userProfile.name}
                    </p>
                    <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
                      {userProfile.role}
                    </p>
                  </div>
                  <Icon name="expand_more" className="text-slate-400 dark:text-slate-500" />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl z-50 p-2 py-3 space-y-1 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {userProfile.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{userProfile.email}</div>
                      </div>

                      <Link
                        href="/technician/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon name="person" className="text-lg" />
                        My Profile
                      </Link>

                      <Link
                        href="/technician/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon name="settings" className="text-lg" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      >
                        <Icon name="logout" className="text-lg" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* 3. MAIN DASHBOARD SCROLL VIEW */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          {children}
        </main>
      </div>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 p-6 flex flex-col justify-between md:hidden animate-fade-in-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <Icon name="close" className="text-xl" />
                </button>
              </div>

              <nav className="space-y-2">
                {MENU_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 py-3.5 px-4 rounded-2xl font-bold transition-colors ${active
                        ? "bg-primary text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                      <Icon name={item.icon} className="text-2xl" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {userProfile && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-black flex items-center justify-center">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{userProfile.name}</div>
                  <div className="text-xs text-slate-400 truncate">{userProfile.role}</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
