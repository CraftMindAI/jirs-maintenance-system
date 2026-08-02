"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "@/components/admin/layout/Sidebar";
import TopNavbar from "@/components/admin/layout/TopNavbar";
import MobileBottomNav from "@/components/admin/layout/MobileBottomNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
              name: data.name || "Admin User",
              role: data.role || "Super Admin",
              email: user.email || "",
            });
          } else {
            setUserProfile({
              name: user.displayName || "Admin User",
              role: "Super Admin",
              email: user.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user doc:", error);
          setUserProfile({
            name: "Admin User",
            role: "Super Admin",
            email: "admin@jirs.ac.in",
          });
        }
      } else {
        setUserProfile({
          name: "Admin User",
          role: "Super Admin",
          email: "admin@jirs.ac.in",
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

  return (
    <div
      className={`h-screen overflow-y-auto hide-scrollbar font-body-md transition-colors duration-300 ${
        darkMode ? "bg-[#0b1326] text-[#dae2fd] selection:bg-[#8083ff]/30" : "bg-slate-50 text-slate-900 selection:bg-primary/20"
      }`}
    >
      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
      <Sidebar darkMode={darkMode} onLogout={handleLogout} />

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
        />

        {/* Content View */}
        <main className="p-6 lg:p-10 space-y-8 flex-1 max-w-[1440px]">
          {children}
        </main>
      </div>

      {/* 3. BOTTOM NAVIGATION (MOBILE ONLY) */}
      <MobileBottomNav />
    </div>
  );
}
