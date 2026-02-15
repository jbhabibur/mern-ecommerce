import React, { useEffect } from "react";

export const MultiItemCarouselError = ({ error }) => {
  useEffect(() => {
    // Log error for developers without breaking UI for users
    if (error) console.error("Multi Item Carousel Error:", error);
  }, [error]);

  return null;
};
