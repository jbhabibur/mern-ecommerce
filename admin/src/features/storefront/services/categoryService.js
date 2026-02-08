/**
 * CATEGORY SERVICE
 * Handles all network requests related to categories.
 */
import apiInstance from "../../../api/apiInstance";

export const getCategories = async (signal) => {
  try {
    /**
     * Sends a GET request to /categories.
     * apiInstance automatically attaches the Authorization header.
     */
    const response = await apiInstance.get("/api/categories/list-all", {
      signal,
    });

    // Returns the data array from the backend
    return response.data?.data || response.data;
  } catch (error) {
    // Re-throw the error so the hook can catch it
    throw error;
  }
};
