import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "last_preloader_time";
const ONE_HOUR = 60 * 60 * 1000;

export const usePreloader = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    const isExpired = !lastSeen || now - Number(lastSeen) > ONE_HOUR;

    if (isExpired) {
      setShowLoader(true);
    }
  }, []);

  const handleLoaderComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setShowLoader(false);
  }, []);

  return { showLoader, handleLoaderComplete };
};
