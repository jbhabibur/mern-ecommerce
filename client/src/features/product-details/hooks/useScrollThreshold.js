import { useState, useEffect } from "react";

/**
 * Custom hook to track if the window scroll position has passed a certain threshold.
 * @param {number} threshold - The pixel value to trigger visibility change.
 */
export const useScrollThreshold = (threshold = 250) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const shouldBeVisible = currentScroll > threshold;

      // Use functional update to avoid dependency on the 'isVisible' state itself
      setIsVisible((prev) => {
        // Performance optimization: Only update state if the visibility status actually changes
        if (prev !== shouldBeVisible) {
          return shouldBeVisible;
        }
        return prev;
      });
    };

    // Attach scroll event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check to handle cases where the page is refreshed while already scrolled
    handleScroll();

    // Cleanup: Remove event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isVisible;
};
