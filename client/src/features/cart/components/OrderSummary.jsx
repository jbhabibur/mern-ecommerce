import { PrimaryButton } from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";

export const OrderSummary = ({ cartItems, totalAmount }) => {
  const navigate = useNavigate();

  // STATE: Track if the checkout request is currently loading
  const [isProcessing, setIsProcessing] = useState(false);

  const onProceed = async () => {
    // PREVENT: Do nothing if already processing to avoid duplicate requests
    if (isProcessing) return;

    const payload = {
      items: cartItems.map((item) => ({
        productId: item.id,
        image: item?.image?.url,
        quantity: item.quantity,
        priceAtCheckout: item.price,
        size: item.size,
      })),
      totalAmount: totalAmount,
    };

    // START LOADING: Disable the button and show loading status
    setIsProcessing(true);

    // Get token to check whether checkout from user or guest
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
        const token = response.data.data.token;
        navigate(`/checkouts/cn/${token}`);
      }
    } catch (error) {
      console.error(
        "Checkout Initiation Failed:",
        error.response?.data?.message || error.message,
      );
      // NOTE: We don't need to manually reset loading here because finally block handles it
    } finally {
      // END LOADING: Enable the button again regardless of success or failure
      setIsProcessing(false);
    }
  };

  return (
    <div className="lg:w-[380px] w-full lg:sticky lg:top-10">
      <div className="bg-white border p-6">
        <h2 className="text-[13px]! font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6">
          Order Summary
        </h2>
        <div className="flex justify-between items-center mb-6">
          <span className="text-[14px] font-bold">Subtotal</span>
          <span className="font-bold text-[16px]">
            Tk {totalAmount.toLocaleString()}.00
          </span>
        </div>
        <div className="mb-8">
          <label className="block text-[13px] font-bold mb-3 uppercase tracking-widest">
            Coupon Code
          </label>
          <input
            type="text"
            placeholder="Enter Coupon Code"
            className="w-full border border-gray-300 p-3 text-[13px] focus:outline-none focus:border-black transition mb-2"
          />
          <p className="text-[12px] text-gray-500 mb-0">
            Coupon code will be applied on the checkout page
          </p>
        </div>
        <div className="flex justify-between items-center mb-6 pt-6 border-t border-gray-100">
          <span className="font-bold text-[13px] uppercase tracking-widest">
            Total:
          </span>
          <span className="font-black text-[18px]">
            Tk {totalAmount.toLocaleString()}.00
          </span>
        </div>
        <p className="text-[12px] text-gray-400 mb-6">
          Tax included and shipping calculated at checkout
        </p>
        <div className="space-y-3!">
          <PrimaryButton
            text="Proceed to checkout"
            initialBg="#000000"
            initialText="#FFFFFF"
            className="text-[14px]! py-4!"
            onClick={onProceed}
            disabled={isProcessing}
          />
          <PrimaryButton
            text="Continue Shopping"
            initialBg="#FFFFFF"
            initialText="#000000"
            className="text-[14px]! py-4!"
          />
        </div>
      </div>
    </div>
  );
};
