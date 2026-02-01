import { useState, useEffect } from "react";

export const useCustomCursor = (isOpen) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isOutside, setIsOutside] = useState(false);

  useEffect(() => {
    if (!isOpen || window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsOutside(false);
    };

    const handleMouseLeave = (e) => {
      setIsOutside(true);
      const width = window.innerWidth;
      const height = window.innerHeight;

      let exitX = e.clientX;
      let exitY = e.clientY;

      if (e.clientX <= 10) exitX = -100;
      else if (e.clientX >= width - 10) exitX = width + 100;
      if (e.clientY <= 10) exitY = -100;
      else if (e.clientY >= height - 10) exitY = height + 100;

      setMousePos({ x: exitX, y: exitY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isOpen]);

  return { mousePos, isOutside };
};
