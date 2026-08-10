"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Icon from "@/components/ui/Icon";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Feedback", href: "/feedback" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await signOut(auth);
    router.push("/");
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isDarkPage =
    pathname === "/" ||
    pathname === "/about-us" ||
    pathname === "/feedback" ||
    pathname?.startsWith("/auth/");

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? isDarkPage
              ? "h-16 bg-slate-950/80 text-white backdrop-blur-xl border-b border-white/10 shadow-2xl"
              : "h-16 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 shadow-md"
            : "h-20 bg-slate-950/30 backdrop-blur-md md:bg-transparent md:backdrop-blur-none text-white border-b border-white/5 md:border-none"
        }`}
      >
        <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-12">
            <Link
              href="/"
              className={`font-display text-2xl font-black tracking-wider flex items-center gap-2 hover:scale-105 transition-transform ${
                isDarkPage ? "text-white" : "text-black dark:text-white"
              }`}
            >
              <Image
                src="/logo/logo.png"
                alt="JFM logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
              <span>JFM</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`font-label-md py-1.5 transition-all nav-link-underline font-extrabold ${
                      active
                        ? "text-sky-400 border-b-2 border-sky-400"
                        : isDarkPage
                        ? "text-slate-200 hover:text-white"
                        : "text-black hover:text-primary dark:text-slate-200 dark:hover:text-white"
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
              href="/auth/v1/login"
              className={`font-label-md font-extrabold hover:text-sky-400 transition-colors ${
                isDarkPage ? "text-white" : "text-black dark:text-white"
              }`}
            >
              Login
            </Link>
            <Link
              href="/auth/v1/signup"
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white px-6 py-2.5 rounded-xl font-label-md font-bold shadow-lg shadow-blue-500/25 transition-all scale-100 active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all active:scale-95"
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </nav>
      </header>

      {/* Mobile navigation menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-2xl px-6 pt-6 pb-8 flex flex-col md:hidden animate-fade-in border-b border-white/10 text-white">
          {/* Mobile Overlay Top Header with Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logo.png"
                alt="JFM logo"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
              <span className="font-display text-2xl font-black tracking-wider text-white">JFM</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition-all active:scale-95 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <Icon name="close" className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-grow">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-display font-bold py-3.5 px-4 rounded-2xl transition-all flex items-center justify-between ${
                    active
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  <Icon name="chevron_right" className="text-slate-500 text-sm" />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
            <Link
              href="/auth/v1/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-center font-bold text-base text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl transition-all"
            >
              Login
            </Link>
            <Link
              href="/auth/v1/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 text-center font-bold text-base text-slate-950 font-extrabold bg-sky-400 hover:bg-sky-300 rounded-2xl transition-all shadow-lg shadow-sky-500/25"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

