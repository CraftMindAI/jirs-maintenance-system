"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

type UserProfile = { name: string; role: string; email: string };

export default function TopNavbar({
  darkMode,
  toggleTheme,
  profileOpen,
  setProfileOpen,
  userProfile,
  onLogout,
  profileHref = "/admin/settings",
  brandLabel = "JMMS",
  onMenuToggle,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  profileHref?: string;
  brandLabel?: string;
  onMenuToggle?: () => void;
}) {
  return (
    <header
      className={`sticky top-0 z-40 w-full h-16 transition-colors border-b flex justify-between items-center px-4 lg:px-10 shadow-lg ${
        darkMode
          ? "bg-[#171f33]/80 backdrop-blur-md border-[#464554]/20 text-[#dae2fd]"
          : "bg-white/80 backdrop-blur-md border-slate-200 text-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222a3d] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Icon name="menu" className="text-2xl" />
          </button>
        )}
        <span
          className={`font-display text-xl md:text-2xl font-extrabold tracking-tighter lg:hidden ${
            darkMode ? "text-[#c0c1ff]" : "text-primary"
          }`}
        >
          {brandLabel}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              darkMode
                ? "hover:bg-[#222a3d] text-[#c7c4d7]"
                : "hover:bg-slate-100 text-slate-600"
            }`}
            aria-label="Toggle theme"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Icon
              name={darkMode ? "light_mode" : "dark_mode"}
              className="text-xl"
            />
          </button>
        </div>

        <div
          className={`h-8 w-[1px] ${darkMode ? "bg-[#464554]/20" : "bg-slate-200"}`}
        />

        {/* Profile Avatar & Dropdown */}
        {userProfile && (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] ring-2 ring-[#c0c1ff]/30 group-hover:ring-[#c0c1ff] transition-all font-black flex items-center justify-center text-sm">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4edea3] rounded-full border-2 border-[#0b1326]" />
              </div>
              <div className="hidden md:block text-left">
                <p
                  className={`font-bold text-xs leading-tight ${darkMode ? "text-[#dae2fd]" : "text-slate-800"}`}
                >
                  {userProfile.name}
                </p>
                <p
                  className={`text-[10px] uppercase font-mono tracking-wider ${darkMode ? "text-[#908fa0]" : "text-slate-500"}`}
                >
                  {userProfile.role}
                </p>
              </div>
              <Icon
                name="expand_more"
                className={darkMode ? "text-[#908fa0]" : "text-slate-400"}
              />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div
                  className={`absolute right-0 mt-3 w-56 border rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-fade-in ${
                    darkMode
                      ? "bg-[#171f33] border-[#464554]/30"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div
                    className={`px-4 py-3 border-b ${darkMode ? "border-[#464554]/20" : "border-slate-100"}`}
                  >
                    <div
                      className={`font-bold text-xs ${darkMode ? "text-[#dae2fd]" : "text-slate-800"}`}
                    >
                      {userProfile.name}
                    </div>
                    <div
                      className={`text-[10px] truncate ${darkMode ? "text-[#908fa0]" : "text-slate-500"}`}
                    >
                      {userProfile.email}
                    </div>
                  </div>
                  <Link
                    href={profileHref}
                    onClick={() => setProfileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      darkMode
                        ? "text-[#c7c4d7] hover:bg-[#222a3d]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon name="person" className="text-base" /> My Profile
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Icon name="logout" className="text-base" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
