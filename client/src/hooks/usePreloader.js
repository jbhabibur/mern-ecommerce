import { useState, useEffect } from "react";

export const usePreloader = () => {
  const ONE_HOUR = 60 * 60 * 1000;

  const [showLoader, setShowLoader] = useState(() => {
    const lastSeen = localStorage.getItem("last_preloader_time");
    const now = Date.now();

    // Show if never seen or if 1 hour passed
    const isExpired = !lastSeen || now - parseInt(lastSeen) > ONE_HOUR;
    return isExpired;
  });

  useEffect(() => {
    // Only set timestamp once when the loader is first shown
    if (showLoader) {
      const lastSeen = localStorage.getItem("last_preloader_time");
      const now = Date.now();

      if (!lastSeen || now - parseInt(lastSeen) > ONE_HOUR) {
        localStorage.setItem("last_preloader_time", now.toString());
      }

      // Auto-hide loader after animation (e.g., 2s)
      const timer = setTimeout(() => setShowLoader(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const handleLoaderComplete = () => setShowLoader(false);

  return { showLoader, handleLoaderComplete };
};
