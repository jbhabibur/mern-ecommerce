import React from "react";
import { Heart, Share2, Plus, Minus } from "lucide-react";

// Import components
import { PrimaryButton } from "../../components/atoms/PrimaryButton";

// Import hooks
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import {
  incrementQuantity,
  decrementQuantity,
} from "../../redux/slices/selectionSlice";

export const PurchaseActions = ({
  id,
  name,
  unitPrice,
  selectedSize,
  productImage,
  isSoldOut,
  noSizeRequired,
}) => {
  const dispatch = useDispatch();

  /**
   * Sync quantity with Redux store instead of local state
   * to ensure Sticky Bar and Main Section stay aligned.
   */
  const { quantity } = useSelector((state) => state.selection);

  /**
   * Handle adding product to cart with size validation
   */
  const handleAddToCart = () => {
    // Logic: Only show alert if sizes are required AND none are selected
    if (!noSizeRequired && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    // Dispatch the action with the product data
    dispatch(
      cartActions.addToCart({
        id: id,
        name: name,
        price: unitPrice,
        quantity: quantity,
        size: noSizeRequired ? "N/A" : selectedSize,
        image: productImage,
      }),
    );

    // Open the drawer to show the updated cart
    dispatch(cartActions.setCartOpen(true));
  };

  /**
   * Increment/Decrement quantity using Redux actions
   */
  const handleIncrement = () => dispatch(incrementQuantity());
  const handleDecrement = () => dispatch(decrementQuantity());

  const handleBuyItNow = () => {};

  /**
   * Safe calculation for subtotal to prevent NaN
   */
  const safeUnitPrice = Number(unitPrice) || 0;
  const safeQuantity = Number(quantity) || 1;
  const subtotal = safeUnitPrice * safeQuantity;

  return (
    <div className="flex flex-col gap-2.5 mt-8 w-full relative">
      <div className="text-base">
        <span className="text-gray-600! font-medium!">Subtotal: </span>
        <span className="text-gray-600! font-medium!">
          Tk {subtotal.toLocaleString()}.00
        </span>
      </div>

      {!isSoldOut && (
        <>
          <div className="text-[13px] font-semibold uppercase tracking-wider text-gray-700 -mb-2">
            Quantity:
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            {/* Main Qty Selector */}
            <div className="flex items-center border border-gray-300 h-12 w-fit">
              <button
                type="button"
                onClick={handleDecrement}
                className="px-1.5 h-full hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <span className="sr-only">Decrease quantity</span>
                <Minus size={16} />
              </button>
              <div className="w-12 flex items-center justify-center font-medium text-gray-600">
                {quantity}
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className="px-1.5 h-full hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <span className="sr-only">Increase quantity</span>
                <Plus size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full md:flex-1">
              <PrimaryButton
                text={isSoldOut ? "OUT OF STOCK" : "ADD TO CART"}
                onClick={handleAddToCart}
                disabled={isSoldOut}
                initialBg={isSoldOut ? "#D1D5DB" : "#1a1a1a"}
                initialText={isSoldOut ? "#6B7280" : "#FFFFFF"}
                responsive={false}
                className="flex-1 h-12 shadow-sm"
              />

              <div className="flex items-center gap-2">
                <button className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-all hover:border-gray-400 group">
                  <Heart
                    size={20}
                    className="text-gray-700 group-hover:text-red-500 transition-colors"
                  />
                </button>
                <button className="p-3 text-gray-400 hover:text-black transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {!isSoldOut && (
            <PrimaryButton
              text="BUY IT NOW"
              onClick={handleBuyItNow}
              initialBg="#FFFFFF"
              initialText="#000000"
              responsive={false}
              className="w-full h-12 border-gray-300 tracking-[0.2em] hover:border-black"
            />
          )}
        </>
      )}

      {isSoldOut && (
        <button className="w-full bg-gray-100 text-gray-400 border border-gray-200 h-12 font-bold text-[11px] uppercase tracking-[0.2em] cursor-not-allowed">
          NOTIFY ME WHEN AVAILABLE
        </button>
      )}
    </div>
  );
};
