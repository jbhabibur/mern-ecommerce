import apiInstance from "../services/apiInstance";
import { API_URLS } from "../config/apiConfig";

/**
 * Fetches paginated categories from the backend
 * @param {number} page
 */
export const getCategories = async (page) => {
  try {
    const response = await apiInstance.post(API_URLS.ALL_CATEGORIES, { page });
    return response.data; // Expected format: { data: [...], hasMore: true }
  } catch (error) {
    throw error.response?.data?.message || "Failed to load categories";
  }
};
