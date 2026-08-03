"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Sidebar, { type MenuItem } from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";
import MobileBottomNav, { type BottomNavItem } from "@/components/admin/layout/MobileBottomNav";

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "home", href: "/technician" },
  { label: "View Complaints", icon: "assignment", href: "/technician/view-complaints" },
  { label: "Track Complaint", icon: "my_location", href: "/technician/track-complaint" },
  { label: "Reports", icon: "assessment", href: "/technician/reports" },
  { label: "Settings", icon: "settings", href: "/technician/settings" },
];

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", icon: "home", href: "/technician" },
  { label: "Complaints", icon: "assignment", href: "/technician/view-complaints" },
  { label: "Track", icon: "my_location", href: "/technician/track-complaint" },
  { label: "Reports", icon: "assessment", href: "/technician/reports" },
  { label: "Profile", icon: "settings", href: "/technician/settings" },
];

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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

  // Theme Sync on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
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
    <div
      className={`min-h-screen font-body-md transition-colors duration-300 ${
        darkMode ? "bg-[#0b1326] text-[#dae2fd] selection:bg-[#8083ff]/30" : "bg-slate-50 text-slate-900 selection:bg-primary/20"
      }`}
    >
      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
      <Sidebar
        darkMode={darkMode}
        onLogout={handleLogout}
        menuItems={MENU_ITEMS}
        brandTitle="JMMS Tech"
        brandSubtitle="Maintenance"
        quickAction={null}
      />

      {/* 2. MAIN CONTAINER & TOP NAVBAR */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <TopNavbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          userProfile={userProfile}
          onLogout={handleLogout}
          profileHref="/technician/settings"
        />

        {/* Breadcrumb Trail */}
        {breadcrumbs.length > 0 && (
          <div className="px-6 lg:px-10 pt-6 flex items-center gap-2 text-sm font-semibold flex-wrap">
            <Link href="/technician" className={darkMode ? "text-[#908fa0] hover:text-[#c0c1ff]" : "text-slate-400 hover:text-primary"}>
              JMMS
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <Icon name="chevron_right" className={`text-xs opacity-60 ${darkMode ? "text-[#908fa0]" : "text-slate-400"}`} />
                <Link
                  href={crumb.href}
                  className={
                    idx === breadcrumbs.length - 1
                      ? darkMode
                        ? "text-[#c0c1ff] font-bold"
                        : "text-primary font-bold"
                      : darkMode
                      ? "text-[#908fa0] hover:text-[#c0c1ff]"
                      : "text-slate-400 hover:text-primary"
                  }
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Content View */}
        <main className="p-6 lg:p-6 md:p-10 space-y-8 flex-1 max-w-[1440px]">{children}</main>
      </div>

      {/* 3. BOTTOM NAVIGATION (MOBILE ONLY) */}
      <MobileBottomNav items={BOTTOM_NAV_ITEMS} quickAction={null} />
    </div>
  );
}
