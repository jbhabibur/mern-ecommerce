import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";
import { BASE_URL } from "../api/apiConfig";

/**
 * @desc    Fetch a single product by its slug
 * @param   {string} slug - The unique product identifier from the URL
 * @returns {Promise<Object>}
 */
export const fetchProductBySlug = async (slug) => {
  try {
    const response = await apiInstance.get(
      `${API_URLS.SINGLE_PRODUCT}/${slug}`,
    );

    if (response.data && response.data.success) {
      return response.data.data;
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || `Failed to load product: ${slug}`;
  }
};

/**
 * @desc    Fetches the latest products for the New Arrivals section
 * @returns {Promise<Array>}
 */
export const fetchNewArrivals = async () => {
  try {
    const response = await apiInstance.get(API_URLS.NEW_ARRIVALS);

    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to load new arrivals.";
  }
};

/**
 * @desc    Fetch the top 8 popular products
 * @returns {Promise<Array>}
 */
export const fetchPopularProducts = async () => {
  try {
    const response = await apiInstance.get(API_URLS.POPULAR_PRODUCTS);

    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(
      "Error fetching popular products:",
      error.response?.data || error.message,
    );
    throw error.response?.data?.message || "Failed to load popular products.";
  }
};
