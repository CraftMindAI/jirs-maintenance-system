"use client";

import { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Sidebar, { type MenuItem, type QuickAction } from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";
import MobileBottomNav, { type BottomNavItem, type BottomNavQuickAction } from "@/components/admin/layout/MobileBottomNav";
import { encryptUserToken } from "@/lib/encryption";
import { dashboardPathForRole } from "@/lib/roleRedirect";
import { roleGroup } from "@/lib/roles";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v1/${token}`;

  const MENU_ITEMS: MenuItem[] = [
    { label: "Dashboard", icon: "dashboard", href: `${basePath}/dashboard` },
    { label: "My Complaints", icon: "assignment_late", href: `${basePath}/my-complaints` },
    { label: "Track Complaint", icon: "my_location", href: `${basePath}/track-complaint` },
    { label: "Feedback", icon: "comment", href: `${basePath}/feedback` },
    { label: "Settings", icon: "settings_applications", href: `${basePath}/settings` },
  ];

  const QUICK_ACTION: QuickAction = { label: "Add Complaint", icon: "add_circle", href: `${basePath}/add-complaint` };

  const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
    { label: "Home", icon: "dashboard", href: `${basePath}/dashboard` },
    { label: "Complaints", icon: "assignment_late", href: `${basePath}/my-complaints` },
    { label: "Track", icon: "my_location", href: `${basePath}/track-complaint` },
    { label: "Profile", icon: "settings_applications", href: `${basePath}/settings` },
  ];

  const BOTTOM_QUICK_ACTION: BottomNavQuickAction = { icon: "add", href: `${basePath}/add-complaint` };

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
      if (!user) {
        setUid(null);
        router.replace("/login");
        return;
      }

      setUid(user.uid);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const rawRole = docSnap.exists() ? docSnap.data().role || "student" : "student";
        const name = docSnap.exists() ? docSnap.data().name : user.displayName;

        if (roleGroup(rawRole) !== "student") {
          router.replace(dashboardPathForRole(rawRole, user.uid, name || rawRole));
          return;
        }

        const expectedToken = encryptUserToken(user.uid, rawRole);
        if (token !== expectedToken) {
          router.replace(`/profile/v1/${expectedToken}/dashboard`);
          return;
        }

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
      }
    });

    return () => unsubscribe();
  }, [router, token]);

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
          profileHref={`${basePath}/settings`}
        />

        {/* Content View */}
        <main className="p-6 lg:p-6 md:p-10 space-y-8 flex-1 max-w-[1440px]">{children}</main>
      </div>

      {/* 3. BOTTOM NAVIGATION (MOBILE ONLY) */}
      <MobileBottomNav items={BOTTOM_NAV_ITEMS} quickAction={BOTTOM_QUICK_ACTION} />
    </div>
  );
}
