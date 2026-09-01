import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "../services/productService";

export const useProduct = (slug) => {
  return useQuery({
    // Unique key includes the slug to ensure granular caching per product
    queryKey: ["product", slug],

    // Core fetching function
    queryFn: () => fetchProductBySlug(slug),

    // Prevent execution if slug is missing (e.g., during routing transitions)
    enabled: !!slug,

    // 5 minutes staleTime
    // Balances performance by reducing API calls while keeping data reasonably fresh
    staleTime: 1000 * 60 * 5,

    // Refetch data when user returns to the tab to ensure latest pricing/stock
    refetchOnWindowFocus: true,
  });
};
