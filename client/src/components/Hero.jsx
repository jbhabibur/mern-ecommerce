import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Use the imported constant
import { CAROUSELS } from "../constants/carousel";

export const Hero = ({ images = CAROUSELS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const headerHeight = "130px";
  const autoSlideInterval = 5000;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  useEffect(() => {
    if (images.length <= 1) return;
    const slideTimer = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideTimer);
  }, [nextSlide, currentIndex]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`relative w-full group overflow-hidden bg-white 
        /* Mobile: Auto height (ইমেজ অনুযায়ী)
           Tablet: Fixed 500px to avoid white space
           Desktop: Full screen height minus header
        */
        h-auto sm:h-[500px] lg:h-[calc(100vh-130px)]`}
    >
      {/* --- Sliding Container --- */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 h-full overflow-hidden"
          >
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-auto sm:h-full object-contain sm:object-cover"
            />
          </div>
        ))}
      </div>

      {/* --- Navigation Arrows (Desktop Only) --- */}
      <button
        onClick={prevSlide}
        className="hidden lg:group-hover:flex absolute top-1/2 left-5 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:group-hover:flex absolute top-1/2 right-5 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all"
      >
        <ChevronRight size={32} />
      </button>

      {/* --- Pagination Dots --- */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center items-center gap-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === index
                ? "bg-black lg:bg-white w-8 lg:w-10 h-1 lg:h-1.5"
                : "bg-black/20 lg:bg-white/40 w-1.5 h-1.5 lg:w-2 lg:h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
