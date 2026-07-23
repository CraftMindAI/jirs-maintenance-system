"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Feedback", href: "/feedback" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "h-16 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md border-b border-outline-variant/30 shadow-lg"
            : "h-20 bg-transparent"
        }`}
      >
        <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="font-display text-2xl text-primary dark:text-white font-black tracking-wider flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Icon name="school" className="text-3xl text-primary" />
              <span>JMMS</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`font-label-md py-1.5 transition-all nav-link-underline font-semibold ${
                      active
                        ? "text-primary dark:text-white border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className="font-label-md text-primary dark:text-white font-bold hover:opacity-80 transition-opacity"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl font-label-md font-bold hover:shadow-xl hover:shadow-primary/20 transition-all scale-100 active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </nav>
      </header>

      {/* Mobile navigation menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-45 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md pt-24 pb-8 px-6 flex flex-col md:hidden animate-fade-in">
          <div className="flex flex-col gap-6 flex-grow">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-bold py-2 ${
                    active ? "text-primary border-l-4 border-primary pl-4 animate-fade-in" : "text-on-surface-variant pl-4"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 mt-auto">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 text-center font-bold text-lg text-primary border border-primary/20 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 text-center font-bold text-lg text-white bg-primary rounded-xl hover:opacity-95 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
