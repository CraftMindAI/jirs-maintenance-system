"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 glass border-t border-[#464554]/20 flex justify-around items-center h-20 px-4 shadow-2xl rounded-t-3xl">
      <Link href="/admin" className={`flex flex-col items-center justify-center ${pathname === "/admin" ? "text-[#c0c1ff]" : "text-[#c7c4d7]"}`}>
        <Icon name="dashboard" className="text-2xl" />
        <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Home</span>
      </Link>
      <Link href="/admin/view-complaints" className={`flex flex-col items-center justify-center ${pathname === "/admin/view-complaints" ? "text-[#c0c1ff]" : "text-[#c7c4d7]"}`}>
        <Icon name="assignment_late" className="text-2xl" />
        <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Issues</span>
      </Link>
      <div className="relative -top-6">
        <Link href="/admin/raise-complaint" className="w-14 h-14 vibrant-gradient rounded-full flex items-center justify-center text-white shadow-xl shadow-[#8083ff]/40 border-4 border-[#0b1326] ring-2 ring-[#8083ff]/20">
          <Icon name="add" className="text-3xl" />
        </Link>
      </div>
      <Link href="/admin/track-complaints" className={`flex flex-col items-center justify-center ${pathname === "/admin/track-complaints" ? "text-[#c0c1ff]" : "text-[#c7c4d7]"}`}>
        <Icon name="engineering" className="text-2xl" />
        <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Staff</span>
      </Link>
      <Link href="/admin/settings" className={`flex flex-col items-center justify-center ${pathname === "/admin/settings" ? "text-[#c0c1ff]" : "text-[#c7c4d7]"}`}>
        <Icon name="person" className="text-2xl" />
        <span className="text-[10px] mt-1 font-bold uppercase tracking-tighter">Profile</span>
      </Link>
    </nav>
  );
}
