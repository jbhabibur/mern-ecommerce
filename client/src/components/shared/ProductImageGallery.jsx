import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { ProductLightbox } from "../../components/shared/ProductLightbox";

export const ProductImageGallery = ({ images, productName, baseUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const productImages = images?.length > 0 ? images : ["/placeholder.jpg"];
  const activeImage = productImages[currentIndex];

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1,
    );

  return (
    <div className="w-full md:w-[60%] flex-shrink">
      {/* Main Display Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 group">
        <img
          src={`${baseUrl}/${activeImage}`}
          alt={productName}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Expand Icon overlay */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 left-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Expand size={20} />
        </button>
      </div>

      {/* Thumbnails Section */}
      <div className="flex gap-4 mt-6 justify-center overflow-x-auto">
        {productImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-20 md:w-24 aspect-square border-2 transition-all ${
              currentIndex === i
                ? "border-black"
                : "border-transparent opacity-60"
            }`}
          >
            <img
              src={`${baseUrl}/${img}`}
              className="w-full h-full object-cover"
              alt="thumb"
            />
          </button>
        ))}
      </div>

      {isLightboxOpen && (
        <ProductLightbox
          images={productImages}
          currentIndex={currentIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
};
