"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Sidebar, { MenuItem, QuickAction } from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";
import { encryptAdminToken } from "@/lib/encryption";
import { dashboardPathForRole } from "@/lib/roleRedirect";
import { roleGroup } from "@/lib/roles";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const basePath = `/profile/v3/${token}`;

  const ADMIN_MENU_ITEMS: MenuItem[] = [
    { label: "Dashboard", icon: "dashboard", href: `${basePath}/dashboard` },
    { label: "All Complaints", icon: "assignment_late", href: `${basePath}/view-complaints` },
    { label: "Technicians", icon: "engineering", href: `${basePath}/track-complaints` },
    { label: "Feedbacks", icon: "comment", href: `${basePath}/feedbacks` },
    { label: "Reports", icon: "inventory_2", href: `${basePath}/reports` },
    { label: "User Management", icon: "group", href: `${basePath}/user-management` },
    { label: "Settings", icon: "settings_applications", href: `${basePath}/settings` },
  ];

  const ADMIN_QUICK_ACTION: QuickAction = { label: "Raise Complaint", icon: "add_circle", href: `${basePath}/raise-complaint` };

  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string; email: string } | null>(null);

  // Sync auth state & enforce Role Guard (ONLY ADMIN ACCESS)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          const rawRole = docSnap.exists() ? docSnap.data().role || "admin" : "admin";
          const role = rawRole.toLowerCase();
          const name = docSnap.exists() ? docSnap.data().name : user.displayName;

          // If logged-in user is NOT admin, redirect them to their respective role dashboard
          if (roleGroup(role) !== "admin") {
            const redirectPath = dashboardPathForRole(role, user.uid, name || role);
            router.replace(redirectPath);
            return;
          }

          // Verify token alignment; if token mismatch, update URL
          const expectedToken = encryptAdminToken(user.uid, role);
          if (token !== expectedToken) {
            router.replace(`/profile/v3/${expectedToken}/dashboard`);
            return;
          }

          setUserProfile({
            name: name || "Admin User",
            role: rawRole,
            email: user.email || "",
          });
        } catch (error) {
          console.error("Error fetching admin doc:", error);
          setUserProfile({
            name: "Admin User",
            role: "Super Admin",
            email: "admin@jirs.ac.in",
          });
        }
      } else {
        // If not logged in, redirect to login page
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router, token]);

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
      className={`h-screen overflow-y-auto hide-scrollbar font-body-md transition-colors duration-300 ${
        darkMode ? "bg-[#0b1326] text-[#dae2fd] selection:bg-[#8083ff]/30" : "bg-slate-50 text-slate-900 selection:bg-primary/20"
      }`}
    >
      {/* 1. SIDEBAR NAVIGATION (DESKTOP & MOBILE DRAWER) */}
      <Sidebar
        darkMode={darkMode}
        onLogout={handleLogout}
        menuItems={ADMIN_MENU_ITEMS}
        quickAction={ADMIN_QUICK_ACTION}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. MAIN CONTAINER & TOP NAVBAR */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Sticky Top Header */}
        <TopNavbar
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          userProfile={userProfile}
          onLogout={handleLogout}
          profileHref={`${basePath}/settings`}
          onMenuToggle={() => setMobileOpen(true)}
        />

        {/* Content View */}
        <main className="p-6 lg:p-6 md:p-10 space-y-8 flex-1 max-w-[1440px]">
          {children}
        </main>
      </div>
    </div>
  );
}
