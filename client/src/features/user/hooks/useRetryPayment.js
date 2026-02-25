import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";

export const useRetryPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handleRetryPayment = async (orderId) => {
    // Prevent multiple simultaneous clicks/requests
    if (isProcessing) return;

    setIsProcessing(true);
    setProcessingId(orderId);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${BASE_URL}/api/orders/retry-payment/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      // Redirect user to the SSLCommerz gateway if session creation is successful
      if (response.data.success && response.data.paymentUrl) {
        window.location.replace(response.data.paymentUrl);
      } else {
        alert(response.data.message || "Payment gateway link not found.");
      }
    } catch (error) {
      console.error("Retry Payment Error:", error);

      // Extract error message from response or use a default fallback
      const errorMsg =
        error.response?.data?.message ||
        "There was an issue with the payment gateway. Please try again.";

      alert(errorMsg);
    } finally {
      // Re-enable the retry button
      setIsProcessing(false);
      setProcessingId(null);
    }
  };

  return { handleRetryPayment, isProcessing, processingId };
};
