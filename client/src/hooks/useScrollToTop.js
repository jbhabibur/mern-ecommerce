import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' ensures the user doesn't see a sliding motion
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);
};
