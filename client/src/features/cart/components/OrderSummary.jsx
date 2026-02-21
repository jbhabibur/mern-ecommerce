import { useNavigate } from "react-router-dom";

// Import components
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";

// Import hooks
import { useCheckoutInitiate } from "../../../hooks/useCheckoutInitiate";

export const OrderSummary = ({ cartItems, totalAmount }) => {
  const navigate = useNavigate();

  const { onProceed, isProcessing } = useCheckoutInitiate(
    cartItems,
    totalAmount,
  );

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
