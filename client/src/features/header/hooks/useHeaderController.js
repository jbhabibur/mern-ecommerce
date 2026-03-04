import { useState, useEffect, useRef } from "react";

/**
 * Manages header behavior: mobile detection, scroll direction, and sticky state.
 */
export const useHeaderController = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [showSticky, setShowSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const TOLERANCE = 10; // Pixels to ignore small jitters

  // 1. Monitor screen width for mobile/desktop toggle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Monitor scroll to determine direction and sticky visibility
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Get height of the header component to know when it is fully off-screen
      const headerHeight = headerRef.current
        ? headerRef.current.offsetHeight
        : 150;

      // Update direction if movement exceeds tolerance
      if (Math.abs(currentY - lastScrollY.current) > TOLERANCE) {
        const newDirection = currentY > lastScrollY.current ? "down" : "up";
        setScrollDirection(newDirection);
        lastScrollY.current = currentY;
      }

      /**
       * showSticky is true if:
       * - User has scrolled past the original header (currentY > headerHeight)
       * - User is scrolling up
       */
      setShowSticky(currentY > headerHeight && scrollDirection === "up");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  return {
    isMobile,
    showSticky,
    headerRef,
  };
};
