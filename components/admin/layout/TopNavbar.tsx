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
}: {
  darkMode: boolean;
  toggleTheme: () => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 glass border-b border-[#464554]/10 flex justify-between items-center px-6 lg:px-10 shadow-xl">
      <div className="flex items-center gap-8">
        <span className="font-display text-2xl font-extrabold text-[#c0c1ff] tracking-tighter lg:hidden">JMMS</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#222a3d] transition-colors text-[#c7c4d7] cursor-pointer"
          >
            <Icon name={darkMode ? "light_mode" : "dark_mode"} className="text-xl" />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-[#464554]/20" />

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
                <p className="font-bold text-[#dae2fd] text-xs leading-tight">{userProfile.name}</p>
                <p className="text-[10px] uppercase text-[#908fa0] font-mono tracking-wider">{userProfile.role}</p>
              </div>
              <Icon name="expand_more" className="text-[#908fa0]" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-[#171f33] border border-[#464554]/30 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-fade-in">
                  <div className="px-4 py-3 border-b border-[#464554]/20">
                    <div className="font-bold text-[#dae2fd] text-xs">{userProfile.name}</div>
                    <div className="text-[10px] text-[#908fa0] truncate">{userProfile.email}</div>
                  </div>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#c7c4d7] hover:bg-[#222a3d] transition-colors"
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
