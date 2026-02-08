import React from "react";
import { X, Crosshair } from "lucide-react";

/**
 * @param {Object} previewImage - The image object containing url, isZoomView, etc.
 * @param {Function} onClose - Function to close the modal (sets previewImage to null)
 */
export const ImagePreviewModal = ({ previewImage, onClose }) => {
  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-6"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/70 hover:text-white transition-colors z-[110]"
        onClick={onClose}
      >
        <X className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      <div
        className="relative max-w-5xl w-full flex flex-col items-center justify-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Badge */}
        <div
          className={`px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase flex items-center gap-2 ${
            previewImage.isZoomView
              ? "bg-amber-500 text-white"
              : "bg-white/10 text-gray-300"
          }`}
        >
          {previewImage.isZoomView ? (
            <>
              <Crosshair className="w-3 h-3" />
              Close-up Detail View
            </>
          ) : (
            "Standard View"
          )}
        </div>

        {/* Main Image Container */}
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-gray-900 ${
            previewImage.isZoomView ? "cursor-zoom-in" : "cursor-default"
          }`}
        >
          <img
            src={previewImage.url}
            alt="Preview"
            className={`max-h-[70vh] md:max-h-[80vh] w-auto object-contain transition-transform duration-700 ease-in-out ${
              previewImage.isZoomView ? "hover:scale-[2.5]" : "hover:scale-100"
            }`}
          />
        </div>

        {/* Dynamic Instruction Text */}
        {previewImage.isZoomView ? (
          <p className="text-gray-500 text-[10px] md:text-xs italic animate-pulse">
            Hover over the image to explore details
          </p>
        ) : (
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">
            Full Size Preview
          </p>
        )}
      </div>
    </div>
  );
};
