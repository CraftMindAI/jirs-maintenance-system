"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function ComplaintImagesCard({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-[#171f33] border border-slate-200 dark:border-[#464554]/10 rounded-3xl p-5 shadow-sm dark:vibrant-shadow space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#464554]/10 pb-3">
        <div className="flex items-center gap-2">
          <Icon name="image" className="text-emerald-600 dark:text-[#00a572] text-xl" />
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-[#dae2fd]">
            Attached Images ({images.length})
          </h3>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-slate-50 dark:bg-[#131b2e]/60 border border-slate-200 dark:border-[#464554]/10 rounded-2xl p-8 text-center space-y-2">
          <Icon name="hide_image" className="text-3xl text-slate-400 dark:text-[#908fa0] mx-auto block opacity-70" />
          <p className="text-xs font-semibold text-slate-500 dark:text-[#908fa0]">
            No Attachment is added
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-1">
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(imgSrc)}
              className="group relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/3] w-full border border-slate-200 dark:border-[#464554]/20 bg-slate-50 dark:bg-[#131b2e] cursor-pointer hover:border-primary/40 dark:hover:border-[#8083ff]/40 transition-all duration-200 shadow-sm"
            >
              <img
                src={imgSrc}
                alt={`Complaint attachment ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/50 dark:bg-[#0b1326]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 font-bold text-xs">
                <Icon name="zoom_in" className="text-xl" />
                <span>Click to view</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 dark:bg-[#0b1326]/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-rose-400 p-2 rounded-full cursor-pointer bg-slate-900/80 dark:bg-[#171f33]/80 border border-slate-700 dark:border-[#464554]/30"
              title="Close image view"
            >
              <Icon name="close" className="text-2xl" />
            </button>

            <img
              src={selectedImage}
              alt="Expanded preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-slate-700 dark:border-[#464554]/30 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
