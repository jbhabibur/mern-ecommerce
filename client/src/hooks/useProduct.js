import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "../services/productService";

/**
 * @desc    Custom hook to fetch a single product by slug with caching
 * @param   {string} slug - Unique SEO-friendly product identifier
 * @returns {Object} Result object containing data, status, and helper methods
 */
export const useProduct = (slug) => {
  return useQuery({
    // Unique key includes the slug to ensure granular caching per product
    queryKey: ["product", slug],

    // Core fetching function
    queryFn: () => fetchProductBySlug(slug),

    // Prevent execution if slug is missing (e.g., during routing transitions)
    enabled: !!slug,

    /** * Industry Standard: 5 minutes staleTime
     * Balances performance by reducing API calls while keeping data reasonably fresh
     */
    staleTime: 1000 * 60 * 5,

    // Refetch data when user returns to the tab to ensure latest pricing/stock
    refetchOnWindowFocus: true,
  });
};
