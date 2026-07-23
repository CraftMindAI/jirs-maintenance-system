"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Feedback", href: "/feedback#feedback" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/20 transition-all ${
        scrolled ? "h-16 shadow-lg" : "h-20"
      }`}
    >
      <nav className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-2xl text-primary font-bold tracking-tight">
            JMMS
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden sm:block font-label-md text-primary font-semibold hover:opacity-80 transition-opacity"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
