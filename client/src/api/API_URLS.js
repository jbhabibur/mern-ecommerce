import { BASE_URL } from "./apiConfig";

export const API_URLS = {
  NEW_ARRIVALS: `${BASE_URL}/api/products/new-arrivals`,
  ALL_PRODUCTS: `${BASE_URL}/api/products`,
  ALL_CATEGORIES: `${BASE_URL}/api/categories/all`,
  CATEGORY_PRODUCTS: (slug) => `${BASE_URL}/api/products/categories/${slug}`,
};
