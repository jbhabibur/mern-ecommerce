import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";

/**
 * Service to fetch social media data from the server
 * @returns {Promise<Object>} - Resolves with success status and social media data array or error message
 */
export const getSocialMediaService = async () => {
  try {
    const result = await apiInstance.get(API_URLS.GET_SOCIAL_MEDIA);
    return {
      success: true,
      data: result?.data?.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Fetch failed",
    };
  }
};
