import { BASE_URL } from "./apiConfig";

export const API_URLS = {
  NEW_ARRIVALS: `${BASE_URL}/api/products/new-arrivals`,
  ALL_PRODUCTS: `${BASE_URL}/api/products`,
  // Use a function for dynamic routes like Categories or Single Products
  CATEGORY_PRODUCTS: (slug) => `${BASE_URL}/api/products/categories/${slug}`,
};
