import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../api/apiConfig";

const fetchSearchResults = async ({ queryKey }) => {
  const [_key, query, limit, sort] = queryKey;

  const { data } = await axios.get(`${BASE_URL}/api/products/search`, {
    params: {
      query,
      limit,
      sort,
    },
  });

  if (Array.isArray(data)) return data;
  if (data?.products) return data.products;
  if (data?.data?.products) return data.data.products;

  return [];
};

export const useSearchResults = (query, limit, sort) => {
  return useQuery({
    queryKey: ["search", query, limit, sort],
    queryFn: fetchSearchResults,
    enabled: query.length > 0,
    keepPreviousData: true,
  });
};
