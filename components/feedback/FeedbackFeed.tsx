"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackCard from "@/components/feedback/FeedbackCard";
import Icon from "@/components/ui/Icon";
import { useFeedbackFeed } from "@/hooks/useFeedbackFeed";

export default function FeedbackFeed() {
  const { feedback: items } = useFeedbackFeed();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide every 5 seconds (paused on hover)
  useEffect(() => {
    if (items.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isHovered]);

  if (items.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-12 md:p-8 md:p-16 text-center shadow-2xl text-white">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
          <Icon name="comment" className="text-3xl" />
        </div>
        <h4 className="font-display text-xl font-bold text-white mb-2">No Feedback Submitted Yet</h4>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Be the first community member to share your thoughts on campus facility operations.
        </p>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const activeItem = items[currentIndex] || items[0];

  return (
    <div
      className="space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header controls bar */}
     

      {/* Animated Card Container */}
      <div className="relative min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <FeedbackCard item={activeItem} />
          </motion.div>
        </AnimatePresence>
      </div>

      
    </div>
  );
}


