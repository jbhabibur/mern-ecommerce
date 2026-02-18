import { useState, useEffect } from "react";

/**
 * Custom hook to manage the one-hour session-based preloader logic.
 */
export const usePreloader = () => {
  const ONE_HOUR = 1 * 60 * 60 * 1000;

  const [showLoader, setShowLoader] = useState(() => {
    // Check localStorage immediately to prevent layout flashing
    const lastSeen = localStorage.getItem("last_preloader_time");
    const now = Date.now();

    // Show loader if it's the first visit or if the 1-hour window has expired
    return !lastSeen || now - parseInt(lastSeen) > ONE_HOUR;
  });

  useEffect(() => {
    if (showLoader) {
      // Update the timestamp as soon as the loader is triggered
      localStorage.setItem("last_preloader_time", Date.now().toString());
    }
  }, [showLoader]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return { showLoader, handleLoaderComplete };
};
