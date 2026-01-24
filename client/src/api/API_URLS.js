const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_URLS = {
  NEW_ARRIVALS: `${BASE_URL}/api/products/new-arrivals`,
  ALL_PRODUCTS: `${BASE_URL}/api/products`,
  // Add more endpoints here as you grow
};
