import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// API theke data anar jonno service import
import { getCategoriesList } from "../../../services/categoryService";

export const Hero = () => {
  const [categories, setCategories] = useState([]); // Images ekhane thakbe
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headerHeight = "125px";
  const autoSlideInterval = 5000;

  // --- Logic from First Code: Fetching Data ---
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        // carouselImage fetch kora hochche
        const response = await getCategoriesList("name,carouselImage");

        if (response.success) {
          // Shudu jader carouselImage ache tader filter kore set korchi
          const imagesOnly = response.data.filter((cat) => cat.carouselImage);
          setCategories(imagesOnly);
        }
      } catch (err) {
        setError(err);
        console.error("Hero Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // --- Logic from Second Code: Carousel Functionality ---
  const nextSlide = useCallback(() => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  }, [categories.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  useEffect(() => {
    if (categories.length <= 1) return;
    const slideTimer = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideTimer);
  }, [nextSlide, currentIndex, categories.length]);

  // Loading ba Error thakle layout bhengye jabe na
  if (loading)
    return (
      <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
        Loading...
      </div>
    );
  if (error || categories.length === 0) return null;

  return (
    <div
      className={`relative w-full group overflow-hidden bg-white 
        h-auto sm:h-[500px] lg:h-[var(--dynamic-height)]!`}
      style={{ "--dynamic-height": `calc(100vh - ${headerHeight})` }}
    >
      {/* --- Sliding Container --- */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {categories.map((item, index) => (
          <div
            key={item._id || index}
            className="w-full flex-shrink-0 h-full overflow-hidden"
          >
            <img
              src={item.carouselImage} // API theke asha image
              alt={item.name}
              className="w-full h-auto sm:h-full object-contain sm:object-cover"
            />
          </div>
        ))}
      </div>

      {/* --- Navigation Arrows --- */}
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
        {categories.map((_, index) => (
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
