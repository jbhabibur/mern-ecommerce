import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../api/apiConfig";

export const useCheckoutInitiate = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Redux theke cart data niye asha (assuming your state structure)
  const { items, totalAmount } = useSelector((state) => state.cart);

  const onProceed = async () => {
    if (isProcessing) return;

    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        image: item?.image?.url || item.image, // fallbacks for safety
        quantity: item.quantity,
        priceAtCheckout: item.price,
        size: item.size,
      })),
      totalAmount: totalAmount,
    };

    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/checkouts/initiate`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      if (response.data.success && response.data.data.token) {
        const checkoutToken = response.data.data.token;
        // Tomar routing structure onujayi navigate hobe
        navigate(`/checkouts/cn/${checkoutToken}`);
      }
    } catch (error) {
      console.error(
        "Checkout Initiation Failed:",
        error.response?.data?.message || error.message,
      );
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsProcessing(false);
    }
  };

  return { onProceed, isProcessing };
};
