import { ReactNode } from "react";
import Link from "next/link";
import AuthHeroPanel from "@/components/auth/AuthHeroPanel";
import AuthFooterLinks from "@/components/auth/AuthFooterLinks";
import Icon from "@/components/ui/Icon";

export default function AuthSimpleShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <AuthHeroPanel />

      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-12 lg:w-1/2 lg:px-20 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-primary font-label-md hover:bg-surface-container-low px-3 py-2 rounded-lg transition-all group"
          >
            <Icon
              name="arrow_back"
              className="text-[20px] transition-transform group-hover:-translate-x-1"
            />
            BACK TO LOGIN
          </Link>

          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Icon name="school" className="text-primary text-[28px]" />
            <span className="font-headline text-lg font-semibold text-primary">JMMS</span>
          </div>

          {children}

          <AuthFooterLinks />
        </div>
      </div>
    </div>
  );
}
