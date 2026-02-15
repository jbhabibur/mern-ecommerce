import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPromos } from "../../../services/promoService.js";

/**
 * Custom hook to fetch and manage Promotional Banners using React Query for caching.
 */
export const usePromos = () => {
  /**
   * 1. React Query implementation
   * We use a descriptive queryKey ['promos'] for caching.
   * staleTime is set to 30 minutes as marketing promos don't change often.
   */
  const {
    data: response,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["promos"],
    queryFn: async () => {
      const result = await getPromos();
      // Ensure the result is returned so React Query can manage it in the cache
      return result;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache duration
  });

  /**
   * 2. Memoized Slot Logic
   * We extract specific slots from the cached response.
   * This logic only re-runs when the 'response' data changes.
   */
  const { panjabiSlot, fragranceSlot, allPromos } = useMemo(() => {
    const promos = response?.data || [];

    return {
      // Slot 1: Usually designated for Panjabi collections
      panjabiSlot: promos.find((p) => p.slot_number === 1 && p.isActive),
      // Slot 2: Usually designated for Fragrance collections
      fragranceSlot: promos.find((p) => p.slot_number === 2 && p.isActive),
      allPromos: promos,
    };
  }, [response]);

  return {
    loading,
    error,
    panjabiSlot,
    fragranceSlot,
    allPromos,
  };
};
