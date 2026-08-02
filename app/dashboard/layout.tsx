"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Sidebar, { type MenuItem, type QuickAction } from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";
import MobileBottomNav, { type BottomNavItem, type BottomNavQuickAction } from "@/components/admin/layout/MobileBottomNav";

const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "My Complaints", icon: "assignment_late", href: "/dashboard/my-complaints" },
  { label: "Track Complaint", icon: "my_location", href: "/dashboard/track-complaint" },
  { label: "Feedback", icon: "comment", href: "/dashboard/feedback" },
  { label: "Settings", icon: "settings_applications", href: "/dashboard/settings" },
];

const QUICK_ACTION: QuickAction = { label: "Add Complaint", icon: "add_circle", href: "/dashboard/add-complaint" };

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "Home", icon: "dashboard", href: "/dashboard" },
  { label: "Complaints", icon: "assignment_late", href: "/dashboard/my-complaints" },
  { label: "Track", icon: "my_location", href: "/dashboard/track-complaint" },
  { label: "Profile", icon: "settings_applications", href: "/dashboard/settings" },
];

const BOTTOM_QUICK_ACTION: BottomNavQuickAction = { icon: "add", href: "/dashboard/add-complaint" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
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
            applyTheme(data.theme !== "light");
          } else {
            setUserProfile({
              name: user.displayName || "User",
              role: "Student",
              email: user.email || "",
            });
            applyTheme(true);
          }
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Siddharth Roy",
            role: "Student",
            email: "siddharth.r@jirs.ac.in",
          });
          applyTheme(true);
        }
      } else {
        // Mock fallback for presentation
        setUid(null);
        setUserProfile({
          name: "Siddharth Roy",
          role: "Student",
          email: "siddharth.r@jirs.ac.in",
        });
        applyTheme(true);
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
        brandTitle="JMMS"
        brandSubtitle="Facility Portal"
        quickAction={QUICK_ACTION}
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
          profileHref="/dashboard/settings"
        />

        {/* Breadcrumb Trail */}
        {breadcrumbs.length > 0 && (
          <div className="px-6 lg:px-10 pt-6 flex items-center gap-2 text-sm font-semibold">
            <Link href="/dashboard" className={darkMode ? "text-[#908fa0] hover:text-[#c0c1ff]" : "text-slate-400 hover:text-primary"}>
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
        <main className="p-6 lg:p-10 space-y-8 flex-1 max-w-[1440px]">{children}</main>
      </div>

      {/* 3. BOTTOM NAVIGATION (MOBILE ONLY) */}
      <MobileBottomNav items={BOTTOM_NAV_ITEMS} quickAction={BOTTOM_QUICK_ACTION} />
    </div>
  );
}
