import { useState } from "react";

/**
 * useFooter Hook
 * * Manages the UI state for Footer-specific interactions.
 * - Handles the toggle state for the mobile accordion (Quick Links).
 * - Logic is restricted to mobile viewports (<= 766px) to prevent layout shifts.
 * * @returns {Object} State and handler for footer navigation.
 */
export const useFooter = () => {
  // Tracks the visibility of the "Quick Links" section on mobile viewports.
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);

  /**
   * Toggles the accordion state specifically for mobile devices.
   * Encapsulating the window width check here ensures the component remains logic-free.
   */
  const toggleQuickLinks = () => {
    if (window.innerWidth <= 766) {
      setIsQuickLinksOpen((prev) => !prev);
    }
  };

  return { isQuickLinksOpen, toggleQuickLinks };
};
