import { BASE_URL } from "../../../api/apiConfig";

// POST: Save a new product
export const createProduct = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/products/add`, {
      method: "POST",
      body: formData, // Browser sets multipart/form-data automatically
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to create product");

    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error("Create Product Error:", error.message);
    return { success: false, message: error.message };
  }
};

// PUT: Update an existing product
export const updateProduct = async (productId, formData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/products/update/${productId}`,
      {
        method: "PUT",
        body: formData,
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to update product");

    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    console.error("Update Product Error:", error.message);
    return { success: false, message: error.message };
  }
};

// GET: Fetch Categories
export const fetchCategories = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/categories/list-all?fields=name`,
    );
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Could not fetch categories");
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return { success: false, data: [], message: error.message };
  }
};

// GET: Fetch Paginated Products
export const fetchPaginatedProducts = async (page = 1, limit = 8) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/products/paginated?page=${page}&limit=${limit}`,
    );
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to fetch products");
    return {
      success: true,
      data: result.data || [],
      totalPages: result.totalPages || 1,
      totalProducts: result.totalProducts || 0,
      currentPage: result.currentPage || 1,
    };
  } catch (error) {
    console.error("Pagination Error:", error.message);
    return { success: false, message: error.message, data: [] };
  }
};

// DELETE: Remove a product from the database
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/products/delete/${productId}`,
      {
        method: "DELETE",
      },
    );

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Failed to delete product");

    return { success: true, message: result.message };
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * @desc    Fetch global inventory stats (Low Stock and Out of Stock counts)
 * @route   GET /api/products/admin/inventory-stats
 * @access  Admin / Private
 */
export const fetchInventoryStats = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/products/admin/inventory-stats`,
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch inventory stats");
    }

    return {
      success: true,
      data: result, // result contains { lowStock: X, outOfStock: Y }
    };
  } catch (error) {
    console.error("Fetch Inventory Stats Error:", error.message);
    return {
      success: false,
      message: error.message,
      data: { lowStock: 0, outOfStock: 0 },
    };
  }
};
