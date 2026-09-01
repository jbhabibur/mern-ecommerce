import apiInstance from "./apiInstance";

/**
 * Sends new address data to the backend (Create)
 * @param {Object} addressData - The address details to be created
 * @returns {Promise<Object>} - Resolves with the created address response data
 * @throws {Object|Error} - Throws backend error response data or the error object
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
 * @param {string} id - The unique ID of the address to update
 * @param {Object} addressData - The updated address details
 * @returns {Promise<Object>} - Resolves with the updated address response data
 * @throws {Object|Error} - Throws backend error response data or the error object
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
 * @param {string} id - The unique ID of the address
 * @param {Object} data - The payload containing the default status configuration
 * @returns {Promise<Object>} - Resolves with the response data from the default address update
 * @throws {Object|Error} - Throws backend error response data or the error object
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
 * @param {string} id - The unique ID of the address to delete
 * @returns {Promise<Object>} - Resolves with the deletion response data
 * @throws {Object|Error} - Throws backend error response data or the error object
 */
export const deleteAddress = async (id) => {
  try {
    const response = await apiInstance.delete(`/api/address/${id}`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};
