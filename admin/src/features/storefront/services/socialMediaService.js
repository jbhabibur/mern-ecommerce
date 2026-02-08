import apiInstance from "../../../api/apiInstance";

// 1. Get all social feed
export const getSocialFeed = async () => {
  try {
    const { data } = await apiInstance.get("/api/storefront/social-feed");
    return {
      success: true,
      data: data?.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Fetch failed",
    };
  }
};

// 2. Add social media (Handles both URL and Multiple Files)
export const addSocialMedia = async (socialData) => {
  try {
    // Check if we are sending FormData (for files) or a plain object (for URL)
    const config = {
      headers: {
        "Content-Type":
          socialData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      },
    };

    const { data } = await apiInstance.post(
      "/api/storefront/social-feed/",
      socialData,
      config,
    );

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Add failed",
    };
  }
};

// 3. Delete social media
export const deleteSocialMedia = async (id) => {
  try {
    const { data } = await apiInstance.delete(
      `/api/storefront/social-feed/${id}`,
    );
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Delete failed",
    };
  }
};
