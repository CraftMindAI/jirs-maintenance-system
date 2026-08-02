"use client";

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

  const isLanding = pathname === "/";
  // On landing page, scrollY >= 650 enters WhyChooseUs, Features, Process, & Contact sections
  const pastHero = isLanding && scrollY >= 650;
  const isDarkHero = isLanding && !pastHero;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? isDarkHero
              ? "h-16 bg-slate-950/40 text-white backdrop-blur-md border-b border-white/10 shadow-xl"
              : "h-16 bg-white/60 dark:bg-slate-950/60 text-slate-900 dark:text-white backdrop-blur-md border-b border-slate-200/60 dark:border-white/10 shadow-md"
            : "h-20 bg-transparent text-white"
        }`}
      >
        <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className={`font-display text-2xl font-black tracking-wider flex items-center gap-2 hover:scale-105 transition-transform ${
                isDarkHero ? "text-white" : "text-black dark:text-white"
              }`}
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
                    className={`font-label-md py-1.5 transition-all nav-link-underline font-extrabold ${
                      active
                        ? "text-primary dark:text-white border-b-2 border-primary"
                        : isDarkHero
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
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-label-md font-bold hover:shadow-xl hover:shadow-primary/20 transition-all scale-100 active:scale-95 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-label-md font-extrabold hover:text-primary transition-colors ${
                    isDarkHero ? "text-white" : "text-black dark:text-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-label-md font-bold hover:shadow-xl hover:shadow-primary/20 transition-all scale-100 active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
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
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-4 text-center font-bold text-lg text-white bg-primary rounded-xl hover:opacity-95 transition-opacity cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
