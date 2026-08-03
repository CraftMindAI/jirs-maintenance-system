"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function AnimatedTechnicianAuth({
  initialView = "login",
}: {
  initialView?: "login" | "signup" | "forgot";
}) {
  const router = useRouter();
  const [activeForm, setActiveForm] = useState<"login" | "signup" | "forgot">(initialView);
  const [animStage, setAnimStage] = useState<"intro" | "shifting" | "complete">("intro");

  // Sync state if initialView changes
  useEffect(() => {
    setActiveForm(initialView);
  }, [initialView]);

  // Motion Sequence Timers (Reduced to 2 seconds total)
  useEffect(() => {
    // 0s - 0.8s: Intro full screen background
    const t1 = setTimeout(() => {
      // 0.8s - 2.0s: Image shifts from full width to left half
      setAnimStage("shifting");
    }, 800);

    const t2 = setTimeout(() => {
      // 2.0s: Form card reveals smoothly on the right
      setAnimStage("complete");
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleTabClick = (view: "login" | "signup") => {
    setActiveForm(view);
    if (view === "login") {
      router.push("/auth/v1/login");
    } else {
      router.push("/auth/v1/signup");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-900 font-body selection:bg-sky-500 selection:text-white">
      
      {/* 1. ANIMATED BRIGHT CAMPUS BACKGROUND PANEL (Starts Full Screen -> Shifts Left) */}
      <div
        className={`fixed top-0 bottom-0 left-0 transition-all duration-[1000ms] ease-in-out z-0 ${
          animStage === "intro"
            ? "w-full"
            : "w-full lg:w-1/2"
        }`}
      >
        <div
          className="h-full w-full bg-cover bg-center brightness-105 contrast-105 transition-transform duration-700 scale-100"
          style={{ backgroundImage: "url('/Login.png')" }}
        />
        {/* Dark readability gradient overlay over left image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        {/* QUOTE TEXT DIRECTLY ON IMAGE (NO CARD CONTAINER) */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white max-w-lg z-10">
          <p className="font-display text-lg sm:text-xl font-medium leading-relaxed italic mb-4 text-slate-100 drop-shadow-md">
            &ldquo;Enlightenment through education is the highest form of service to humanity. We strive to maintain the sanctuary where knowledge meets character.&rdquo;
          </p>
          <div className="h-1 w-16 bg-sky-400 rounded-full mb-3" />
          <p className="font-mono text-xs uppercase tracking-widest font-bold text-sky-300 drop-shadow-sm">
            JAIN International Residential School
          </p>
          <p className="font-body text-slate-300 text-xs mt-0.5 opacity-90">
            Infrastructure &amp; Maintenance Division
          </p>
        </div>
      </div>

      {/* 2. AUTHENTICATION COMPACT FORM CARD PANEL (RIGHT SIDE - REVEALS AT PHASE C) */}
      <div className="relative z-10 min-h-screen w-full flex flex-col lg:flex-row">
        
        {/* Empty Spacer on Left to offset Form Card on Right */}
        <div className="hidden lg:block lg:w-1/2 min-h-screen" />

        {/* Right Form Card Container */}
        <div
          className={`w-full lg:w-1/2 min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50/90 via-sky-50/40 to-blue-50/20 backdrop-blur-sm transition-all duration-1000 ease-out ${
            animStage === "complete"
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          {/* Compact Form Box */}
          <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-7 shadow-2xl shadow-slate-300/60 border border-slate-200/80 text-slate-900 transition-all">
            
            {/* Top Bar Navigation & Centered Large Logo Showcase (Inside Form Only) */}
            <div className="space-y-3 pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[#00355f] font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors group"
                >
                  <Icon
                    name="arrow_back"
                    className="text-sm transition-transform group-hover:-translate-x-1 text-[#00355f]"
                  />
                  Home
                </Link>
              </div>

              {/* Centered Large Brand Logo (Inside Form, Covering 65% Card Width) */}
              <div className="flex justify-center items-center py-2">
                <img
                  src="/Logo.png"
                  alt="JIRS Official Logo"
                  className="w-[65%] max-w-[280px] h-auto max-h-24 object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* FORM STATE TAB SWITCHER */}
            <div className="mb-4 flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => handleTabClick("login")}
                className={`font-mono text-xs uppercase tracking-wider px-5 py-2 transition-all border-b-2 -mb-px font-bold cursor-pointer ${
                  activeForm === "login"
                    ? "border-[#00355f] text-[#00355f]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("signup")}
                className={`font-mono text-xs uppercase tracking-wider px-5 py-2 transition-all border-b-2 -mb-px font-bold cursor-pointer ${
                  activeForm === "signup"
                    ? "border-[#00355f] text-[#00355f]"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* ACTIVE FORM RENDER WITH COMPACT INPUT SPACING */}
            <div className="transition-all duration-300">
              {activeForm === "login" && <LoginForm />}
              {activeForm === "signup" && <SignupForm />}
              {activeForm === "forgot" && <ForgotPasswordForm />}
            </div>

            {/* COPYRIGHT FOOTER */}
            <div className="mt-6 pt-3 border-t border-slate-100 text-center">
              <p className="font-mono text-[10px] text-slate-400">
                © 2026 JAIN International Residential School. All rights reserved.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

