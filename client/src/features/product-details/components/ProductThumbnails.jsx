import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFullImagePath } from "../../../api/apiConfig";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export const ProductThumbnails = ({
  productImages = [],
  currentIndex,
  setCurrentIndex,
  productName,
}) => {
  const swiperRef = useRef(null);

  // Generate a unique ID to prevent conflicts when multiple swipers are on the same page
  const uniqueId = useRef(Math.random().toString(36).substring(2, 9)).current;

  const prevClass = `thumb-prev-${uniqueId}`;
  const nextClass = `thumb-next-${uniqueId}`;

  // Sync Swiper position when the external currentIndex changes (e.g., from a main slider)
  useEffect(() => {
    if (swiperRef.current && !swiperRef.current.destroyed) {
      // Use slideToLoop to handle cases where loop mode is active
      swiperRef.current.slideToLoop(currentIndex);
    }
  }, [currentIndex]);

  return (
    <div className="relative mt-6 w-full px-10">
      {/* Custom Navigation Buttons 
        Note: We use z-20 to ensure buttons stay above the Swiper slides
      */}
      <button
        className={`${prevClass} absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-30`}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        className={`${nextClass} absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors disabled:opacity-30`}
      >
        <ChevronRight size={18} />
      </button>

      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        // Critical for dynamic navigation elements
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = `.${prevClass}`;
          swiper.params.navigation.nextEl = `.${nextClass}`;
        }}
        navigation={{
          prevEl: `.${prevClass}`,
          nextEl: `.${nextClass}`,
        }}
        slidesPerView={3}
        spaceBetween={15}
        // Enable loop only if there are enough slides to fill the view
        loop={productImages.length > 3}
        watchSlidesProgress={true}
        className="select-none"
        onSlideChange={(swiper) => {
          // Update the index using realIndex to account for cloned slides in loop mode
          setCurrentIndex(swiper.realIndex);
        }}
      >
        {productImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              onClick={() => setCurrentIndex(index)}
              className={`rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300
                ${
                  currentIndex === index
                    ? "border-black scale-95"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <img
                src={getFullImagePath(img.url)}
                alt={`${productName} thumbnail ${index}`}
                className="aspect-square object-cover"
                draggable={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
