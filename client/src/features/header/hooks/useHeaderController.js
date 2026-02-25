import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to manage Header state including mobile detection,
 * scroll direction, and sticky visibility.
 */
export const useHeaderController = () => {
  // Define a constant for the header height instead of dynamic calculation
  const FIXED_HEADER_HEIGHT = 80;

  const [scrollDirection, setScrollDirection] = useState("up");
  const [showSticky, setShowSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const headerRef = useRef(null);
  const lastScrollY = useRef(0);

  const THRESHOLD = 300; // Scroll distance before sticky header can appear
  const TOLERANCE = 10; // Minimum scroll movement to trigger a state update

  // Handle window resize and initial mobile detection
  useEffect(() => {
    const handleUpdate = () => {
      const width = document.documentElement.clientWidth;
      setIsMobile(width <= 1024);
    };

    handleUpdate();
    window.addEventListener("resize", handleUpdate);
    return () => window.removeEventListener("resize", handleUpdate);
  }, []);

  // Handle scroll logic to determine scroll direction and sticky visibility
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;

      // Update direction only if scroll movement exceeds tolerance
      if (Math.abs(currentY - lastScrollY.current) > TOLERANCE) {
        setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
        lastScrollY.current = currentY;
      }

      // Show sticky header when scrolling up and past the threshold point
      setShowSticky(currentY > THRESHOLD && scrollDirection === "up");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  return {
    isMobile,
    showSticky,
    headerRef,
    fixedHeight: FIXED_HEADER_HEIGHT,
  };
};
