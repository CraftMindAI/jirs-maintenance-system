"use client";

import { ReactNode, useEffect } from "react";
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
  // Auth pages have no theme toggle of their own, so sync the same "dark" class the
  // dashboard/admin/technician layouts use — otherwise a fresh visit never gets the
  // class at all, and premium-input's OS-level dark styling ends up mismatched
  // against an unstyled light page.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", savedTheme !== "light");
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 dark:bg-[#0f2238]">
      <AuthHeroPanel />

      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white dark:bg-[#0f2238] px-6 py-12 lg:w-1/2 lg:px-20 overflow-y-auto border-l border-outline-variant/10 dark:border-white/5">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-primary dark:text-blue-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 px-3 py-2 rounded-xl transition-all group text-sm"
          >
            <Icon
              name="arrow_back"
              className="text-[20px] transition-transform group-hover:-translate-x-1"
            />
            BACK TO HOME
          </Link>

          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Icon name="school" className="text-primary dark:text-blue-300 text-[28px]" />
            <span className="font-headline text-lg font-bold text-primary dark:text-slate-100">JMMS</span>
          </div>

          <AuthTabs active={active} />
          {children}

          <AuthFooterLinks />
        </div>
      </div>
    </div>
  );
}
