import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerUser,
  resendVerification,
} from "../../../services/authService";

export const useRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isSubscribed: false,
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: "",
    text: "",
    field: null,
    canVerify: false, // Flag to show the "Verify My Account Now" alert
  });

  // Updates form state and clears existing errors
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Reset status messages when user starts typing again
      if (statusMsg.field === name || statusMsg.text) {
        setStatusMsg({ type: "", text: "", field: null, canVerify: false });
      }
    },
    [statusMsg],
  );

  /**
   * Triggers the actual registration API call.
   * If the user is unverified, the backend catches it and returns a 400 with unverified: true.
   */
  const executeRegistration = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setStatusMsg({ type: "", text: "", field: null, canVerify: false });

    // Artificial delay to improve UX/Spinner visibility
    const minWaitTimer = new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const [response] = await Promise.all([
        registerUser(formData),
        minWaitTimer,
      ]);

      // Handle successful new registration
      if (response.data.success) {
        navigate("/account/verify-otp", {
          state: {
            allowed: true,
            email: formData.email,
            showToast: true,
            toastMsg: response.data.message,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.log("Registration error:", error);
      const errorData = error?.response?.data;
      const errorMessage = errorData?.message || "Something went wrong.";

      // Case: Account exists but needs verification
      if (errorData?.unverified) {
        setStatusMsg({
          type: "error",
          text: errorMessage,
          field: "email",
          canVerify: true,
        });
      } else {
        // Case: General errors (e.g., already verified, invalid data)
        setStatusMsg({
          type: "error",
          text: errorMessage,
          field: errorData?.field || "email",
          canVerify: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Explicitly triggered by the "Verify My Account Now" button in the UI.
   * Calls the resendVerification service and moves the user to the OTP page.
   */
  const handleVerifyAndRedirect = async () => {
    try {
      // 1. Prepare data and call the OTP resend service
      const resendData = { email: formData.email };
      const response = await resendVerification(resendData);

      // 2. If the API call is successful, proceed to navigation
      if (response.success) {
        navigate("/account/verify-otp", {
          state: {
            allowed: true,
            email: formData.email,
            showToast: true,
            toastMsg: response.message || "OTP sent successfully!",
          },
          replace: true, // Replace current entry in history stack
        });
      }
    } catch (error) {
      // 3. Handle potential errors (e.g., Network issues or Server errors)
      console.error("Resend OTP failed:", error);

      // Optional: Add a toast notification here to inform the user of the failure
      // toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return {
    formData,
    loading,
    statusMsg,
    handleChange,
    executeRegistration,
    handleVerifyAndRedirect,
  };
};
