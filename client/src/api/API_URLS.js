import { BASE_URL } from "./apiConfig";

export const API_URLS = {
  NEW_ARRIVALS: `${BASE_URL}/api/products/new-arrivals`,
  ALL_PRODUCTS: `${BASE_URL}/api/products`,
  ALL_CATEGORIES: `${BASE_URL}/api/categories/all`,
  CATEGORY_PRODUCTS: (slug) => `${BASE_URL}/api/products/categories/${slug}`,

  // Auth endpoints
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  VERIFY_OTP: `${BASE_URL}/api/auth/verify-otp`,
  RESEND_OTP: `${BASE_URL}/api/auth/resend-otp`,
  FORGET_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  FORGET_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
};
