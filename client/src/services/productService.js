import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";

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

export const fetchCategoryProducts = async (slug) => {
  // Use the dynamic function from API_URLS for environmental compatibility
  const response = await apiInstance.get(API_URLS.CATEGORY_PRODUCTS(slug));
  return response.data;
};

/**
 * @desc    Fetch all products with pagination
 * @param   {number} page - The page number to fetch
 * @returns {Promise<Object>} - Returns products and pagination metadata
 */
export const fetchAllProducts = async (page = 1) => {
  try {
    const response = await apiInstance.get(
      `${API_URLS.ALL_PRODUCTS}?pageNumber=${page}`,
    );

    if (response.data && response.data.success) {
      // We return the whole object because we need 'pages' and 'page' for the UI
      return response.data;
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to load products.";
  }
};
