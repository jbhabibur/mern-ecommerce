import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Expand, ChevronLeft, ChevronRight } from "lucide-react";

// Import components
import { ProductThumbnails } from "./ProductThumbnails";
import { ProductLightbox } from "./ProductLightbox";

// Import others
import { getFullImagePath } from "../../../api/apiConfig";

export const ProductImageGallery = ({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const productImages =
    images.length > 0 ? images : [{ url: "/placeholder.jpg" }];

  useEffect(() => {
    const primaryIndex = productImages.findIndex(
      (img) => img.isPrimary === true,
    );
    setCurrentIndex(primaryIndex !== -1 ? primaryIndex : 0);
  }, [images]);

  // Added the missing close handler
  const closeLightbox = () => setIsLightboxOpen(false);

  return (
    <div className="w-full">
      {/* Main Feature Image Container */}
      <div
        className={`relative aspect-square overflow-hidden bg-gray-100 group rounded-sm`}
      >
        <img
          src={getFullImagePath(productImages[currentIndex]?.url)}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Expand Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="sm:hidden absolute bottom-2 left-2 p-2 bg-white rounded-full! shadow-lg z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Open fullscreen gallery"
        >
          <Expand size={20} className="text-gray-700" />
        </button>

        {/* gfgf */}
        <div className="abosule absolute bottom-2 right-2 sm:hidden">
          <div className="flex gap-0.5">
            <div className="bg-white px-2 py-1.5">
              <span>{currentIndex + 1}</span> <span>/</span>{" "}
              <span>{images.length}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % productImages.length);
              }}
              className="bg-white px-2 py-1.5"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(
                  (prev) =>
                    (prev - 1 + productImages.length) % productImages.length,
                );
              }}
              className="bg-white px-2 py-1.5"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <ProductThumbnails
        productImages={productImages}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        productName={productName}
      />
      {/* --- Lightbox with React Portal --- */}
      {isLightboxOpen &&
        createPortal(
          <ProductLightbox
            images={productImages}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNext={() =>
              setCurrentIndex((prev) => (prev + 1) % productImages.length)
            }
            onPrev={() =>
              setCurrentIndex(
                (prev) =>
                  (prev - 1 + productImages.length) % productImages.length,
              )
            }
            // Passing the state setter directly to enable thumbnail clicks inside lightbox
            setIndex={setCurrentIndex}
          />,
          document.body,
        )}
    </div>
  );
};
