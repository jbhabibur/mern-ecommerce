import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesList } from "../../../services/categoryService";

export const useHeroData = (autoSlideInterval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * 1. Data Fetching with React Query
   * queryKey: Unique identifier for caching this specific data.
   * staleTime: Data remains 'fresh' for 10 minutes, avoiding unnecessary re-fetches.
   */
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["heroCategories"],
    queryFn: async () => {
      const response = await getCategoriesList(
        "name,carouselImage,_id,showInCarousel,slug",
      );

      if (response.success) {
        // Filter logic moved inside query function for cleaner state
        return response.data.filter(
          (cat) => cat.carouselImage && cat.showInCarousel === true,
        );
      }
      throw new Error("Failed to fetch categories");
    },
    staleTime: 1000 * 60 * 10, // Cache remains fresh for 10 minutes
  });

  /**
   * 2. Carousel Control Logic
   * We use categories.length from the query data to manage slides.
   */
  const nextSlide = useCallback(() => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  }, [categories.length]);

  const prevSlide = () => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  /**
   * 3. Auto Play Logic
   * Automatically moves to the next slide based on the interval.
   */
  useEffect(() => {
    if (categories.length <= 1) return;
    const slideTimer = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideTimer);
  }, [nextSlide, categories.length, autoSlideInterval]);

  return {
    categories,
    currentIndex,
    loading,
    error,
    nextSlide,
    prevSlide,
    goToSlide,
  };
};
