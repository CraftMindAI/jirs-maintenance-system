"use client";

import { ReactNode } from "react";
import Link from "next/link";
import AuthHeroPanel from "@/components/auth/AuthHeroPanel";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import Icon from "@/components/ui/Icon";

export default function AuthPageShell({
  active,
  children,
}: {
  active: "login" | "signup";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 via-sky-50/40 to-blue-50/20 text-slate-900 font-body">
      {/* Left Side: Campus Hero Panel */}
      <AuthHeroPanel />

      {/* Right Side: Perfectly Centered Professional Form Card Container */}
      <div className="flex-1 min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-6 md:p-10 shadow-2xl shadow-slate-200/60 border border-slate-200/80 transition-all">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-[#00355f] font-mono text-xs font-bold uppercase tracking-wider hover:bg-sky-50 px-3 py-2 rounded-xl transition-colors group"
          >
            <Icon
              name="arrow_back"
              className="text-base transition-transform group-hover:-translate-x-1 text-[#00355f]"
            />
            Back to Home
          </Link>

          {/* Mobile Branding Header */}
          <div className="mb-6 flex items-center justify-center gap-3.5 lg:hidden pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-sky-50 p-1.5 border border-sky-200 flex items-center justify-center shrink-0">
              <img src="/Logo.png" alt="JIRS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display text-xl font-black text-[#00355f] tracking-wide block">JIRS JFM</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-600 block">School Maintenance Portal</span>
            </div>
          </div>

          <AuthTabs active={active} />
          {children}
          <AuthFooterLinks />
        </div>
      </div>
    </div>
  );
}




