import { BASE_URL } from "../../../api/apiConfig";

/**
 * Product API Service
 * Uses the BASE_URL from apiConfig to communicate with the backend.
 */

// 1. POST: Save a new product to the Database
export const createProduct = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/product/add`, {
      method: "POST",
      // IMPORTANT: Do NOT set "Content-Type" header when sending FormData.
      // The browser will automatically set it to 'multipart/form-data'
      // with the correct boundary.
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      // result.message will contain the "name is required" or validation errors from backend
      throw new Error(result.message || "Failed to create product");
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Product created successfully",
    };
  } catch (error) {
    console.error("Create Product Error:", error.message);
    return {
      success: false,
      message: error.message || "Network error occurred",
    };
  }
};

/**
 * GET: Fetch only necessary fields for categories (name and _id)
 * Matches the /api/categories/list-all route in your controller.
 */
export const fetchCategories = async () => {
  try {
    // We only need name and _id for the dropdown to minimize data transfer
    const response = await fetch(
      `${BASE_URL}/api/categories/list-all?fields=name`,
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not fetch categories");
    }

    return {
      success: true,
      data: result.data || [], // categories will contain { _id, name }
    };
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return {
      success: false,
      data: [],
      message: error.message,
    };
  }
};
