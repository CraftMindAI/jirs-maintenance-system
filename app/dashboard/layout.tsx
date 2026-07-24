"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

type MenuItem = {
  label: string;
  icon: string;
  href: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "home", href: "/dashboard" },
  { label: "My Complaints", icon: "assignment", href: "/dashboard/my-complaints" },
  { label: "Add Complaint", icon: "add_circle", href: "/dashboard/add-complaint" },
  { label: "Track Complaint", icon: "my_location", href: "/dashboard/track-complaint" },
  { label: "Feedback", icon: "comment", href: "/dashboard/feedback" },
  { label: "Settings", icon: "settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; email: string } | null>(null);

  const applyTheme = (isDark: boolean) => {
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  };

  // Sync auth state + the signed-in user's saved theme preference
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              name: data.name || "User",
              role: data.role || "Student",
              email: user.email || "",
            });
            applyTheme(
              data.theme === "dark" ||
                (!data.theme && window.matchMedia("(prefers-color-scheme: dark)").matches),
            );
          } else {
            setUserProfile({
              name: user.displayName || "User",
              role: "Student",
              email: user.email || "",
            });
            applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
          }
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Siddharth Roy",
            role: "Student",
            email: "siddharth.r@jirs.ac.in",
          });
          applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
      } else {
        // Mock fallback for presentation
        setUid(null);
        setUserProfile({
          name: "Siddharth Roy",
          role: "Student",
          email: "siddharth.r@jirs.ac.in",
        });
        applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    applyTheme(nextDark);
    if (uid) {
      setDoc(doc(db, "users", uid), { theme: nextDark ? "dark" : "light" }, { merge: true }).catch(
        (error) => console.error("Error saving theme preference:", error),
      );
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
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <Icon name="school" className="text-3xl text-primary" />
            {!sidebarCollapsed && (
              <span className="font-display text-lg font-black tracking-wider text-primary dark:text-white uppercase">
                JMMS
              </span>
            )}
          </Link>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <Icon name="chevron_left" className="text-xl" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 mx-auto rounded-lg cursor-pointer"
            >
              <Icon name="menu" className="text-xl" />
            </button>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 py-3.5 px-4 rounded-2xl font-semibold transition-all duration-200 group relative ${
                  active
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white"
                }`}
              >
                <Icon name={item.icon} className="text-2xl" />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                {sidebarCollapsed && (
                  <span className="absolute left-24 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-md transition-transform duration-200 origin-left whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Widget */}
        {!sidebarCollapsed && userProfile && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 m-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center border border-primary/20">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{userProfile.name}</div>
              <div className="text-xs text-slate-400 truncate">{userProfile.role}</div>
            </div>
          </div>
        )}
      </aside>

      {/* 2. MAIN LAYOUT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
          
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
                    className={`hover:text-primary dark:hover:text-white transition-colors ${
                      idx === breadcrumbs.length - 1 ? "text-primary dark:text-white font-bold" : ""
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

            {/* User Profile Avatar */}
            {userProfile && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  {userProfile.name.charAt(0).toUpperCase()}
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
                        href="/dashboard/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon name="person" className="text-lg" />
                        My Profile
                      </Link>
                      
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon name="settings" className="text-lg" />
                        Settings
                      </Link>
                      
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Icon name="lock" className="text-lg" />
                        Reset Password
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
                <div className="flex items-center gap-3">
                  <Icon name="school" className="text-3xl text-primary animate-pulse" />
                  <span className="font-display text-lg font-black tracking-wider text-primary dark:text-white uppercase">
                    JMMS
                  </span>
                </div>
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
                      className={`flex items-center gap-4 py-3.5 px-4 rounded-2xl font-bold transition-colors ${
                        active
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
