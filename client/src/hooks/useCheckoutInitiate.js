import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../api/apiConfig";

export const useCheckoutInitiate = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state) => state.cart);

  const onProceed = async (isBuyNow = false, currentProduct = null) => {
    if (isProcessing) return;

    const checkoutItems =
      isBuyNow && currentProduct
        ? [
            {
              productId: currentProduct.id,
              image: currentProduct?.image?.url || currentProduct.image,
              quantity: currentProduct.quantity || 1,
              priceAtCheckout: currentProduct.price,
              size: currentProduct.size,
            },
          ]
        : items.map((item) => ({
            productId: item.id,
            image: item?.image?.url || item.image,
            quantity: item.quantity,
            priceAtCheckout: item.price,
            size: item.size,
          }));

    const payload = {
      items: checkoutItems,
      totalAmount:
        isBuyNow && currentProduct
          ? currentProduct.price * (currentProduct.quantity || 1)
          : totalAmount,
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
