import { useState, useEffect, useCallback } from "react";
import { getCategoriesList } from "../../../services/categoryService";

export const useHeroData = (autoSlideInterval = 5000) => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Logic
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const response = await getCategoriesList(
          "name,carouselImage,_id,showInCarousel,slug",
        );
        if (response.success) {
          const filtered = response.data.filter(
            (cat) => cat.carouselImage && cat.showInCarousel === true,
          );
          setCategories(filtered);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  // Carousel Control Logic
  const nextSlide = useCallback(() => {
    if (categories.length === 0) return;
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  }, [categories.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const goToSlide = (index) => setCurrentIndex(index);

  // Auto Play Logic
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
