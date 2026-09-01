import React, { useEffect } from "react";

export const MultiItemCarouselError = ({ error }) => {
  useEffect(() => {
    if (error) console.error("Multi Item Carousel Error:", error);
  }, [error]);

  return null;
};
