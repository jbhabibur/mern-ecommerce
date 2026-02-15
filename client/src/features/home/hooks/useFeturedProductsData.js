import { useQuery } from "@tanstack/react-query";
import { fetchPopularProducts } from "../../../services/productService";

/**
 * Custom hook to fetch and manage featured (popular) products using TanStack Query.
 */
export const useFeturedProductsData = () => {
  /**
   * React Query handles the fetch logic, loading states, and error catching.
   * It also manages memory safety, so 'isMounted' logic is no longer needed.
   */
  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const data = await fetchPopularProducts();
      // Ensure we return the data so it can be stored in the cache
      return data;
    },
    // Industry standard: Product highlights stay fresh for about 5-10 minutes
    staleTime: 1000 * 60 * 7,
  });

  return { products, loading, error };
};
