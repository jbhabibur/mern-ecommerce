import { useEffect } from "react";

export const FeaturedProductsError = ({ error }) => {
  useEffect(() => {
    if (error) console.error("Featured Products Error:", error);
  }, [error]);

  return null;
};
