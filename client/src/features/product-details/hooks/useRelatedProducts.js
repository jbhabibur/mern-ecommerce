import { useQuery } from "@tanstack/react-query";
import { fetchPopularProducts } from "../../../services/productService";

export const useRelatedProducts = (productId) => {
  return useQuery({
    queryKey: ["related-products", productId],
    queryFn: () => fetchPopularProducts(productId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
