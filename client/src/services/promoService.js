import apiInstance from "./apiInstance";

/**
 * Service to fetch promotional slots from the storefront API
 * @returns {Promise<Object>} - Resolves with response data containing promo slots
 * @throws {Error} - Throws an error if the fetch operation fails
 */
export const getPromos = async () => {
  try {
    const response = await apiInstance.get("/api/storefront/promo-slots"); // DB endpoint jeta hobe
    return response.data;
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
};
