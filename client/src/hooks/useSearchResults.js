import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../api/apiConfig";

// useSearchResults.js আপডেট করুন
const fetchSearchResults = async ({ queryKey }) => {
  const [_key, query, limit, sort] = queryKey;

  const { data } = await axios.get(`${BASE_URL}/api/products/search`, {
    params: {
      query,
      limit,
      sort,
    },
  });

  // ডেটা স্ট্রাকচার চেক করুন (Overlay এর মতো করে)
  // যদি আপনার API রেসপন্স { products: [...] } হয় তবে এটা ঠিক আছে
  // কিন্তু অনেক সময় { data: { products: [...] } } হতে পারে
  if (Array.isArray(data)) return data;
  if (data?.products) return data.products;
  if (data?.data?.products) return data.data.products;

  return [];
};

export const useSearchResults = (query, limit, sort) => {
  return useQuery({
    queryKey: ["search", query, limit, sort],
    queryFn: fetchSearchResults,
    enabled: query.length > 0, // query খালি থাকলে কল হবে না
    keepPreviousData: true,
  });
};
