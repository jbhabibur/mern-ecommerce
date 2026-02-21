import { useState, useRef } from "react";
import {
  X,
  Search,
  Share2,
  Maximize,
  Minimize,
  LayoutGrid,
  MoveLeft,
  MoveRight,
} from "lucide-react";

// Import components
import { ShareModal } from "./ShareModal";

// Import hooks
import { useLightboxControls } from "../hooks/useLightboxControls.js";
import { useImagePan } from "../hooks/useImagePan.js";

// Import helpers
import { getFullImagePath } from "../../../api/apiConfig";

export const ProductLightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  setIndex,
}) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showShare, setShowShare] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Fullscreen hook
  const { isFullscreen, toggleFullscreen } = useLightboxControls(
    onClose,
    onNext,
    onPrev,
  );

  // Image pan + zoom hook (desktop + mobile)
  const {
    position,
    scale,
    isZoomed,
    isDragging,
    toggleZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleWheel,
    handleDoubleClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useImagePan(containerRef, imageRef);

  return (
    <div
      onClick={(e) => {
        // If the user clicks exactly this div (the background), close it
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="group fixed inset-0 w-screen h-screen bg-black/80 flex flex-row z-[99999] overflow-hidden select-none"
    >
      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-black/10">
        {/* TOP LEFT COUNTER */}
        <div className="absolute top-2 left-2 z-[200]">
          <span className="text-white/80 font-medium text-sm md:text-base rounded-full">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* TOP RIGHT TOOLBAR */}
        <div className="absolute top-0 right-0 flex justify-end items-center px-3 py-1 gap-6 z-[200] bg-black/50">
          <button
            onClick={toggleZoom}
            className={`text-white/70 hover:text-white ${
              isZoomed ? "text-pink-500" : ""
            }`}
            title="Toggle Zoom"
          >
            <Search size={20} />
          </button>

          <button
            className="text-white/70 hover:text-white"
            onClick={() => setShowShare(!showShare)}
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-white/70 hover:text-white"
          >
            <LayoutGrid size={20} />
          </button>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1 rounded ml-4"
          >
            <X size={28} />
          </button>
        </div>

        {/* IMAGE VIEWPORT */}
        <div
          onClick={(e) => {
            if (e.target == e.currentTarget) {
              onClose();
            }
          }}
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative flex-1 flex overflow-hidden items-center justify-center"
          style={{
            cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          }}
        >
          <img
            ref={imageRef}
            src={getFullImagePath(images[currentIndex]?.url)}
            alt="Product"
            draggable="false"
            className="max-w-full max-h-full object-contain" // Adds stability
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.3s ease",
            }}
          />

          {/* Navigation arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            onDoubleClick={(e) => e.stopPropagation()} // Blocks double-click zoom
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all cursor-pointer z-[210] border-none outline-none select-none touch-manipulation"
            aria-label="Previous"
          >
            <MoveLeft size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            onDoubleClick={(e) => e.stopPropagation()} // Blocks double-click zoom
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all cursor-pointer z-[210] border-none outline-none select-none touch-manipulation"
            aria-label="Next"
          >
            <MoveRight size={20} />
          </button>
        </div>
      </div>

      {/* THUMBNAIL SIDEBAR */}
      {showSidebar && (
        <div className="hidden sm:flex w-24 md:w-36 bg-zinc-900 border-l border-white/10 p-2 flex-col gap-3 overflow-y-auto z-[130]">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIndex(idx);
                if (isZoomed) toggleZoom();
              }}
              className={`border-2 rounded overflow-hidden aspect-square transition-all ${
                currentIndex === idx
                  ? "border-pink-500 scale-95 opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <img
                src={getFullImagePath(img.url)}
                className="w-full h-full object-cover"
                alt={`thumbnail ${idx}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* SHARE MODAL */}
      {showShare && (
        <ShareModal showShare={showShare} setShowShare={setShowShare} />
      )}
    </div>
  );
};
