import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";

/**
 * @desc Create a new product review (Initially pending)
 * @param {Object} reviewData - { product, rating, comment }
 */
export const createReviewService = async (reviewData) => {
  try {
    const result = await apiInstance.post(API_URLS.REVIEWS.BASE, reviewData);
    console.log(result);
    return {
      success: true,
      message: result?.data?.message || "Review submitted successfully",
      data: result?.data?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Submission failed",
    };
  }
};

/**
 * @desc Get all approved reviews for a specific product
 * @param {string} productId - The ID of the product
 */
export const getProductReviewsService = async (productId) => {
  try {
    const result = await apiInstance.get(
      API_URLS.REVIEWS.GET_BY_PRODUCT(productId),
    );
    return {
      success: true,
      data: result?.data?.data || [],
      count: result?.data?.count || 0,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Fetch failed",
      data: [],
    };
  }
};

/**
 * @desc Admin: Approve or Reject a review
 * @param {string} id - Review ID
 * @param {string} status - 'approved' or 'rejected'
 */
export const updateReviewStatusService = async (id, status) => {
  try {
    const result = await apiInstance.patch(API_URLS.REVIEWS.UPDATE_STATUS(id), {
      status,
    });
    return {
      success: true,
      message: result?.data?.message || `Review ${status} successfully`,
      data: result?.data?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Status update failed",
    };
  }
};

/**
 * @desc Admin: Delete a review permanently
 * @param {string} id - Review ID
 */
export const deleteReviewService = async (id) => {
  try {
    const result = await apiInstance.delete(API_URLS.REVIEWS.DELETE(id));
    return {
      success: true,
      message: result?.data?.message || "Review deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Deletion failed",
    };
  }
};
