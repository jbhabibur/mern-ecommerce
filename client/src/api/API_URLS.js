import { BASE_URL } from "./apiConfig";

export const API_URLS = {
  // Product endpoints
  NEW_ARRIVALS: `${BASE_URL}/api/products/new-arrivals`,
  POPULAR_PRODUCTS: `${BASE_URL}/api/products/popular`,
  ALL_PRODUCTS: `${BASE_URL}/api/products`,
  ALL_CATEGORIES: `${BASE_URL}/api/categories/all`,
  CATEGORY_PRODUCTS: (slug) => `${BASE_URL}/api/product/categories/${slug}`,
  SINGLE_PRODUCT: `${BASE_URL}/api/products`,

  // Categories endpoints
  /** * @description Fetch categories with specific fields to optimize payload.
   * @usage API_URLS.GET_CATEGORIES("name,carouselImage")
   * @param {string} fields - Comma-separated field names.
   */
  GET_CATEGORIES: (fields) => {
    const query = fields ? `?fields=${fields}` : "";
    return `${BASE_URL}/api/categories/list-all${query}`;
  },

  // Auth endpoints
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
  RESEND_VERIFICATION: `${BASE_URL}/api/auth/resend-verification`,
  FORGET_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,

  // Storefront endpoints
  GET_SOCIAL_MEDIA: `${BASE_URL}/api/storefront/social-feed`,
};
