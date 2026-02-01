import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

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
