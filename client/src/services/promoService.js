import apiInstance from "./apiInstance";

export const getPromos = async () => {
  try {
    const response = await apiInstance.get("/api/storefront/promo-slots"); // DB endpoint jeta hobe
    return response.data;
  } catch (error) {
    console.error("Error fetching promos:", error);
    throw error;
  }
};
