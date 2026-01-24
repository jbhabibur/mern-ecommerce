import axios from "axios";
// Import the centralized API URLs
import { API_URLS } from "../api/API_URLS";

export const fetchCategoryProducts = async (slug) => {
  // Use the dynamic function from API_URLS for environmental compatibility
  const response = await axios.get(API_URLS.CATEGORY_PRODUCTS(slug));
  return response.data;
};
