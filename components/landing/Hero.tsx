"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function Hero() {
  const [isEnded, setIsEnded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPositionTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVideoProgress(true);
    }, 4800);
  };

  useEffect(() => {
    // Autoplay video on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    startPositionTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleVideoEnded = () => {
    // Mark ended state when video completes final frame
    setIsEnded(true);
  };

  const handleReplay = () => {
    if (!videoRef.current || !isEnded) return;

    // Reset video state instantly without animated backwards transition
    setIsEnded(false);
    setVideoProgress(false);

    // Rewind video to 0 and play
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});

    // Restart 4.8s position shift timer
    startPositionTimer();
  };

  return (
    <div className="relative min-h-[85vh] bg-[#07111F] bg-gradient-to-b from-[#07111F] via-[#0b172a] to-[#101C3F] select-none dot-pattern overflow-hidden pt-20 pb-16 lg:py-24 flex items-center justify-center">
      {/* Background radial glow decorations */}
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 md:px-8 max-w-7xl mx-auto text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[480px]">

          {/* 1ST COLUMN: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start space-y-6 sm:space-y-8 text-center lg:text-left">
            
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-black leading-[1.08] tracking-tight">
              Precision Campus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-sky-400">
                Facility Support
              </span>
            </h1>

            <p className="font-body-lg text-sm sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              Elevating the JIRS residential experience through a centralized, enterprise-grade digital platform for facility operations, asset management, and instant 3-day SLA resolutions.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/login"
                className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-extrabold text-sm sm:text-base transition-all flex items-center gap-2 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Raise Complaint <Icon name="arrow_forward" className="text-lg" />
              </Link>
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-extrabold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                View Ticket Status
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 pt-8 border-t border-white/10 w-full max-w-2xl">
              <div>
                <div className="text-2xl sm:text-4xl font-black text-white">98.4%</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">3-Day SLA Target</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-black text-white">4.9★</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Campus Rating</div>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-black text-white">15 Min</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Avg Response</div>
              </div>
            </div>

          </div>

          {/* 2ND COLUMN: Single Video Element */}
          <div className="lg:col-span-5 w-full flex items-center justify-center pt-2 lg:pt-0">
            <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[600px] aspect-square flex items-center justify-center select-none">
              
              {/* Soft backdrop radial glow */}
              <div className="absolute inset-0 bg-primary/25 rounded-full blur-3xl transform scale-105 pointer-events-none" />

              {/* Circular Glass Portal Container */}
              <div className="relative w-full h-full rounded-full border-2 border-white/15 bg-slate-950/60 backdrop-blur-xl p-3 sm:p-4 shadow-2xl flex items-center justify-center overflow-hidden group hover:border-primary/40 transition-all">
                
                {/* Inner Glowing Ring */}
                <div className="absolute inset-2 sm:inset-3 rounded-full border border-primary/30 pointer-events-none z-20" />

                {/* Single Video Element - Instantly resets to 88% right focus on replay with no left-to-right motion */}
                <video
                  ref={videoRef}
                  src="/landing/Intro.mp4"
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  controlsList="nogstatedisable nodownload noremoteplayback"
                  disablePictureInPicture
                  preload="auto"
                  onEnded={handleVideoEnded}
                  onClick={isEnded ? handleReplay : undefined}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-hidden="true"
                  tabIndex={-1}
                  className={`w-full h-full object-cover rounded-full ${
                    isEnded
                      ? "cursor-pointer pointer-events-auto"
                      : "pointer-events-none"
                  }`}
                  style={{
                    willChange: "object-position",
                    objectPosition: videoProgress ? "50% center" : "88% center",
                    transition: videoProgress ? "object-position 1.5s ease-in-out" : "none",
                  }}
                />

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
