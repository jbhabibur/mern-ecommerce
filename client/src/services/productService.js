import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";

/**
 * Fetches the latest products for the New Arrivals section.
 */
export const fetchNewArrivals = async () => {
  try {
    const { data } = await axiosClient.get(ENDPOINTS.PRODUCTS.NEW_ARRIVALS);
    return data;
  } catch (error) {
    // Professional error fallback in English
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

    // Check for success based on your backend controller structure
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(
      "Error fetching popular products:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
