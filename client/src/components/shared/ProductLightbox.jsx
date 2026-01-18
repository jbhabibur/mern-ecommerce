import React, { useRef, useState } from "react";
import {
  X,
  Search,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Facebook,
  Twitter,
  PinIcon as Pinterest,
  Copy,
  Check,
} from "lucide-react";

import { ShareModal } from "../shared/ShareModal";

// --- Main Lightbox Component ---
export const ProductLightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const lightboxRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // কারেন্ট ইউআরএল নেওয়ার জন্য (অথবা আপনি চাইলে props হিসেবে পাঠাতে পারেন)
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  if (!images || images.length === 0) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      lightboxRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <div
        ref={lightboxRef}
        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300"
      >
        {/* Top Toolbar */}
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-black/40 text-white z-[110]">
          <div className="text-base font-medium tracking-widest">
            {currentIndex + 1} / {images.length}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleFullscreen}
              className="hover:text-gray-400 transition-colors"
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>

            <Search
              size={22}
              className="cursor-pointer hover:text-gray-400 transition-colors"
            />

            {/* Share Button Trigger */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="hover:text-gray-400 transition-colors"
            >
              <Share2 size={22} />
            </button>

            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={32} />
            </button>
          </div>
        </div>

        {/* Image Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            onClick={onPrev}
            className="absolute left-4 z-[120] text-white/40 hover:text-white bg-black/20 p-1 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          <img
            src={images[currentIndex]}
            alt="Product"
            className="max-w-full max-h-full object-contain select-none animate-in zoom-in-95 duration-300"
          />

          <button
            onClick={onNext}
            className="absolute right-4 z-[120] text-white/40 hover:text-white bg-black/20 p-1 rounded-full"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>

      {/* Share Modal Integration */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        productUrl={currentUrl}
      />
    </>
  );
};
