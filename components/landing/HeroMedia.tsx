"use client";

import { useRef, useState, useEffect } from "react";

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  useEffect(() => {
    // Attempt autoplay programmatically in case browser autoplay policies require explicit call
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback: If autoplay fails due to browser policy, transition smoothly to static frame
        setShowImage(true);
      });
    }
  }, []);

  const handleEnded = () => {
    // 1. Freeze on final frame for ~250ms
    setTimeout(() => {
      // 2. Fade seamlessly to Intro_frame.jpeg (500ms opacity transition)
      setShowImage(true);

      // 3. Completely hide video once fade-out finishes to free GPU/memory resources
      setTimeout(() => {
        setIsVideoHidden(true);
      }, 550);
    }, 250);
  };

  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className="relative w-full aspect-square max-w-[440px] sm:max-w-[480px] lg:max-w-none mx-auto flex items-center justify-center select-none"
    >
      {/* 1. Intro Video Layer */}
      {!isVideoHidden && (
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
          onEnded={handleEnded}
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out ${
            showImage ? "opacity-0" : "opacity-100"
          }`}
          style={{
            willChange: "opacity",
          }}
        />
      )}

      {/* 2. Final Still Frame Layer with Subtle Idle Float Animation */}
      <img
        src="/landing/Intro_frame.jpeg"
        alt=""
        loading="eager"
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out ${
          showImage ? "opacity-100 hero-idle-float" : "opacity-0 pointer-events-none"
        }`}
        style={{
          willChange: "opacity, transform",
        }}
      />

      <style jsx>{`
        @keyframes hero-idle-float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.008);
          }
        }
        .hero-idle-float {
          animation: hero-idle-float 5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-idle-float {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
