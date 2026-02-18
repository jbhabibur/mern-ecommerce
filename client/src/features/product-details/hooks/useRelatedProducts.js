import { useQuery } from "@tanstack/react-query";
import { fetchPopularProducts } from "../../../services/productService";

export const useRelatedProducts = () => {
  return useQuery({
    queryKey: ["related-products"],
    queryFn: () => fetchPopularProducts(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
