"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Sidebar, { type MenuItem } from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";
import MobileBottomNav, { type BottomNavItem } from "@/components/admin/layout/MobileBottomNav";
import { encryptTechToken } from "@/lib/encryption";
import { dashboardPathForRole } from "@/lib/roleRedirect";
import { roleGroup } from "@/lib/roles";

export default function TechnicianLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const basePath = `/profile/v2/${token}`;

  const MENU_ITEMS: MenuItem[] = [
    { label: "Dashboard", icon: "home", href: `${basePath}/dashboard` },
    { label: "View Complaints", icon: "assignment", href: `${basePath}/view-complaints` },
    { label: "Track Complaint", icon: "my_location", href: `${basePath}/track-complaint` },
    { label: "Reports", icon: "assessment", href: `${basePath}/technician-reports` },
    { label: "Settings", icon: "settings", href: `${basePath}/technician-settings` },
  ];

  const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
    { label: "Home", icon: "home", href: `${basePath}/dashboard` },
    { label: "Complaints", icon: "assignment", href: `${basePath}/view-complaints` },
    { label: "Track", icon: "my_location", href: `${basePath}/track-complaint` },
    { label: "Reports", icon: "assessment", href: `${basePath}/technician-reports` },
    { label: "Profile", icon: "settings", href: `${basePath}/technician-settings` },
  ];

  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; email: string } | null>(null);

  // Sync auth state & enforce Technician Token Guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const rawRole = docSnap.exists() ? docSnap.data().role || "technician" : "technician";
        const name = docSnap.exists() ? docSnap.data().name : user.displayName;

        if (roleGroup(rawRole) !== "technician") {
          router.replace(dashboardPathForRole(rawRole, user.uid, name || rawRole));
          return;
        }

        const expectedToken = encryptTechToken(user.uid, name || "technician");
        if (token !== expectedToken) {
          router.replace(`/profile/v2/${expectedToken}/dashboard`);
          return;
        }

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
      }
    });

    return () => unsubscribe();
  }, [token, router]);

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
          profileHref={`${basePath}/technician-settings`}
        />

        {/* Content View */}
        <main className="p-6 lg:p-6 md:p-10 space-y-8 flex-1 max-w-[1440px]">{children}</main>
      </div>

      {/* 3. BOTTOM NAVIGATION (MOBILE ONLY) */}
      <MobileBottomNav items={BOTTOM_NAV_ITEMS} quickAction={null} />
    </div>
  );
}
