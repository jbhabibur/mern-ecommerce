import apiInstance from "../services/apiInstance";
import { API_URLS } from "../api/API_URLS";

// ==========================================
// CATEGORY SERVICE FUNCTIONS
// ==========================================

/**
 * @description Fetches categories with pagination (Used for Admin tables or Load-more lists)
 * @method POST
 * @param {number} page - Current page number
 * @returns {Promise<Object>} - Paginated data { data, hasMore }
 */
export const getCategoriesPaginated = async (page) => {
  try {
    const response = await apiInstance.post(API_URLS.ALL_CATEGORIES, { page });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || "Failed to load paginated categories"
    );
  }
};

/**
 * @description Fetches categories with dynamic fields (Used for Carousels, Banners, or Dropdowns)
 * @method GET
 * @param {string} [fields] - Optional: Comma-separated fields (e.g., "name,carouselImage")
 * @returns {Promise<Object>} - Category list { success, data }
 */
export const getCategoriesList = async (fields = null) => {
  try {
    // Generates URL using the dynamic function in API_URLS
    const url = API_URLS.GET_CATEGORIES(fields);

    const response = await apiInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch category list";
  }
};
