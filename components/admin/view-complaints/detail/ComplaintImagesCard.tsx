"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function ComplaintImagesCard({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="bg-[#171f33] border border-[#464554]/10 rounded-3xl p-5 shadow-sm vibrant-shadow space-y-4">
      <div className="flex items-center justify-between border-b border-[#464554]/10 pb-3">
        <div className="flex items-center gap-2">
          <Icon name="image" className="text-[#00a572] text-xl" />
          <h3 className="font-display text-sm font-bold text-[#dae2fd]">
            Attached Images ({images.length})
          </h3>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-[#131b2e]/60 border border-[#464554]/10 rounded-2xl p-8 text-center space-y-2">
          <Icon name="hide_image" className="text-3xl text-[#908fa0] mx-auto block opacity-70" />
          <p className="text-xs font-semibold text-[#908fa0]">
            No Attachment is added
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-1">
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(imgSrc)}
              className="group relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[4/3] w-full border border-[#464554]/20 bg-[#131b2e] cursor-pointer hover:border-[#8083ff]/40 transition-all duration-200 shadow-sm"
            >
              <img
                src={imgSrc}
                alt={`Complaint attachment ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#0b1326]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 font-bold text-xs">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/90 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#ff516a] p-2 rounded-full cursor-pointer bg-[#171f33]/80 border border-[#464554]/30"
              title="Close image view"
            >
              <Icon name="close" className="text-2xl" />
            </button>

            <img
              src={selectedImage}
              alt="Expanded preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-[#464554]/30 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
