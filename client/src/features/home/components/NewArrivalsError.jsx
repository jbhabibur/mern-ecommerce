import { useEffect } from "react";

export const NewArrivalsError = ({ error }) => {
  useEffect(() => {
    if (error) console.error("New Arrivals Fetch Error:", error);
  }, [error]);

  return null;
};
