import apiInstance from "./apiInstance";

/**
 * Sends new address data to the backend (Create)
 * @param {Object} addressData
 */
export const createAddress = async (addressData) => {
  try {
    const response = await apiInstance.post("/api/address", addressData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

/**
 * Updates existing address data in the backend (Update)
 * @param {string} id - The unique ID of the address
 * @param {Object} addressData - The updated data
 */
export const updateAddress = async (id, addressData) => {
  try {
    const response = await apiInstance.put(`/api/address/${id}`, addressData);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

/**
 * Toggles default status for an address (Patch)
 * @param {string} id
 * @param {Object} data - { type: "shipping" | "billing", status: boolean }
 */
export const setDefaultAddress = async (id, data) => {
  try {
    const response = await apiInstance.patch(
      `/api/address/default/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

/**
 * Removes an address from the backend (Delete)
 * @param {string} id
 */
export const deleteAddress = async (id) => {
  try {
    const response = await apiInstance.delete(`/api/address/${id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
