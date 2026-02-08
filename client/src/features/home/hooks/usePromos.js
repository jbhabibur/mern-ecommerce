import { useState, useEffect, useMemo } from "react";
import { getPromos } from "../../../services/promoService.js";

/**
 * Custom hook to fetch and manage Promotional Banners.
 * Handles API response structure: { success: true, data: [...] }
 */
export const usePromos = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPromos = async () => {
      try {
        setLoading(true);
        const result = await getPromos();

        // Log to verify the structure matches image_a54c1f.png
        console.log("API Response:", result);

        if (isMounted) {
          setResponse(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch promos");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPromos();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Memoized logic to filter specific slots.
   * Maps response.data directly based on your console output.
   */
  const { panjabiSlot, fragranceSlot, allPromos } = useMemo(() => {
    // Accessing 'data' array inside the response object
    const promos = response?.data || [];

    return {
      // NOTE: In your images, isActive is currently 'false'
      // If you want to see them while testing, remove '&& p.isActive'
      panjabiSlot: promos.find((p) => p.slot_number === 1 && p.isActive),
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
