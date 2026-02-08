import apiInstance from "../../../api/apiInstance";
/**
 * Create a new Promo Slot
 */
export const createPromoSlot = async (formData) => {
  try {
    const { data } = await apiInstance.post(
      "/api/storefront/promo-slots",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return {
      success: true,
      data: data.data,
      message: data.message || "Slot created successfully",
    };
  } catch (error) {
    console.error("Create Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Creation failed",
    };
  }
};

/**
 * Delete a specific Promo Slot
 */
export const deletePromoSlot = async (slotId) => {
  try {
    const { data } = await apiInstance.delete(
      `/api/storefront/promo-slots/${slotId}`,
    );
    return {
      success: true,
      message: data.message || "Slot deleted successfully",
    };
  } catch (error) {
    console.error("Delete Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Deletion failed",
    };
  }
};

/**
 * Update an existing Promo Slot
 */
export const updatePromoSlot = async (slotId, formData) => {
  try {
    // Onek backend e update er jonno path e ID dite hoy: /promo-slots/:id
    const { data } = await apiInstance.post(
      `/api/storefront/promo-slots/${slotId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return {
      success: true,
      data: data.data,
      message: data.message || "Slot updated successfully",
    };
  } catch (error) {
    console.error("Update Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Update failed",
    };
  }
};

/**
 * Fetch all Promo Slots
 */
export const getPromoSlots = async () => {
  try {
    const { data } = await apiInstance.get("/api/storefront/promo-slots");
    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load slots",
      data: [],
    };
  }
};

/**
 * Toggle the active status of a Promo Slot
 */
export const togglePromoStatus = async (slotId, newStatus) => {
  try {
    // PATCH method use kora better partial update er jonno
    const { data } = await apiInstance.patch(
      `/api/storefront/promo-slots/${slotId}/status`,
      { isActive: newStatus }, // Sudhu status tuku pathachhi
    );

    return {
      success: true,
      data: data.data,
      message: data.message || "Status updated successfully",
    };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update status",
    };
  }
};
