/**
 * src/api/endpoints.js
 * Centralized API route definitions for the application.
 */
import { BASE_URL } from "./apiConfig";

export const ENDPOINTS = {
  PRODUCTS: {
    NEW_ARRIVALS: `${BASE_URL}/api/products/new-arrivals`,
    ALL: `${BASE_URL}/api/products`,
    BY_CATEGORY: (slug) => `${BASE_URL}/api/products/categories/${slug}`,
  },
  CATEGORIES: {
    ALL: `${BASE_URL}/api/categories/all`,
  },
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
  },
};
