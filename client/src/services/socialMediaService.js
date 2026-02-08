import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";

export const getSocialMediaService = async () => {
  try {
    const result = await apiInstance.get(API_URLS.GET_SOCIAL_MEDIA);
    console.log(result?.data?.data);
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
