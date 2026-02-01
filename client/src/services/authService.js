import apiInstance from "./apiInstance";
import { API_URLS } from "../api/API_URLS";

/**
 * Service to handle user authentication (Login)
 * @param {Object} credentials - Contains user { email, password }
 * @returns {Promise} - Resolves with the user data and access token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiInstance.post(API_URLS.LOGIN, credentials);
    return response.data;
  } catch (error) {
    // Re-throwing the error so the UI can handle specific backend messages
    throw error;
  }
};

/**
 * Service to handle new user registration
 * @param {Object} userData - Contains { firstName, lastName, email, password }
 * @returns {Promise} - Resolves with registration success message
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiInstance.post(API_URLS.REGISTER, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service to verify user email using OTP
 * @param {Object} verificationData - Contains { email, otp }
 * @returns {Promise} - Resolves with verification status
 */
export const verifyOTP = async (verificationData) => {
  try {
    const response = await apiInstance.post(
      API_URLS.VERIFY_OTP,
      verificationData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service to resend OTP to the user's email
 * @param {Object} resendData - Contains { email }
 * @returns {Promise} - Resolves with success message
 */
export const resendOTP = async (resendData) => {
  try {
    const response = await apiInstance.post(API_URLS.RESEND_OTP, resendData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service to handle password reset request
 * @param {Object} data - Contains { email }
 * @returns {Promise} - Resolves with success message if email is sent
 */
export const forgotPassword = async (data) => {
  try {
    const response = await apiInstance.post(API_URLS.FORGET_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service to reset the user password using a token
 * @param {string} token - The reset token from the URL
 * @param {Object} data - Contains { password } (the new password)
 * @returns {Promise} - Resolves with the password reset status
 */
export const resetPassword = async (token, data) => {
  try {
    // We pass the token in the URL params as per the backend route
    const response = await apiInstance.post(
      `${API_URLS.RESET_PASSWORD}/${token}`,
      data,
    );
    return response.data;
  } catch (error) {
    // Re-throwing the error for UI error notification handling
    throw error;
  }
};
