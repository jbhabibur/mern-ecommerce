import { useState, useEffect, useRef } from "react";
import { useHeader } from "./useHeader"; // Custom hook to access HeaderContext

export const useHeaderLogic = () => {
  // Get setter function from context to update global header height
  const { setHeaderHeight } = useHeader();
  
  // States for scroll direction, sticky visibility, and mobile detection
  const [scrollDirection, setScrollDirection] = useState("up");
  const [showSticky, setShowSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs to store DOM element and previous scroll position without re-renders
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);

  // Configuration constants
  const THRESHOLD = 300; // Pixels to scroll before sticky can appear
  const TOLERANCE = 10;  // Minimum scroll distance to trigger direction change

  // Effect to handle window resizing and height calculation
  useEffect(() => {
    const handleUpdate = () => {
      // Check if current screen is mobile size
      setIsMobile(window.innerWidth < 1024);
      
      // Update global context with the actual height of the header
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    handleUpdate();
    window.addEventListener("resize", handleUpdate);
    return () => window.removeEventListener("resize", handleUpdate);
  }, [setHeaderHeight]);

  // Effect to handle scroll logic for sticky header visibility
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      
      // Only change direction if scrolled more than the tolerance value
      if (Math.abs(currentY - lastScrollY.current) > TOLERANCE) {
        setScrollDirection(currentY > lastScrollY.current ? "down" : "up");
        lastScrollY.current = currentY;
      }

      // Show sticky header only when scrolling up and past the threshold
      setShowSticky(currentY > THRESHOLD && scrollDirection === "up");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection]);

  // Return only the necessary data for the component
  return { isMobile, showSticky, headerRef };
};