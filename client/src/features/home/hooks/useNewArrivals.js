import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_URLS } from "../../../api/API_URLS";

export const useNewArrivals = (initialLimit = 8) => {
  const [visibleCount, setVisibleCount] = useState(initialLimit);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  /**
   * 1. React Query for fetching New Arrivals
   * staleTime: 5 minutes is a good balance for product lists.
   */
  const {
    data: products = [],
    isLoading: initialLoading,
    error,
  } = useQuery({
    queryKey: ["newArrivals"],
    queryFn: async () => {
      const response = await fetch(API_URLS.NEW_ARRIVALS);
      if (!response.ok) {
        throw new Error("Problem fetching new arrivals data");
      }
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  /**
   * 2. Load More Logic
   * We keep this as a local state since it only affects the UI display limit.
   */
  const handleLoadMore = () => {
    setIsMoreLoading(true);
    // Simulating a small delay for a smoother UI transition
    setTimeout(() => {
      setVisibleCount((prev) => prev + initialLimit);
      setIsMoreLoading(false);
    }, 800); // Reduced time for better UX
  };

  return {
    products,
    initialLoading,
    isMoreLoading,
    error,
    visibleCount,
    handleLoadMore,
    totalProducts: products.length,
  };
};
