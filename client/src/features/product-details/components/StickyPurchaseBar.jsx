import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";

// Import components
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";

// Import Redux hooks and actions
import { useSelector, useDispatch } from "react-redux";
import {
  setSize,
  incrementQuantity,
  decrementQuantity,
} from "../../../redux/slices/selectionSlice";
import { cartActions } from "../../../redux/slices/cartSlice";

export const StickyPurchaseBar = ({ isVisible }) => {
  const dispatch = useDispatch();
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Get state from Redux (Syncing with global productInfo)
  const { quantity, selectedSize, productInfo } = useSelector(
    (state) => state.selection,
  );

  // Return null if no product info or not visible
  if (!productInfo || !isVisible) return null;

  // Destructure from Redux productInfo
  const { id, name, unitPrice, image, isSoldOut, noSizeRequired, variants } =
    productInfo;

  const primaryImage = image?.url || "";

  // 2. Use Redux actions for quantity buttons
  const increaseQty = () => dispatch(incrementQuantity());
  const decreaseQty = () => dispatch(decrementQuantity());

  // Handle adding product to cart with validation
  const handleAddToCart = () => {
    if (!noSizeRequired && !selectedSize) {
      alert("Please select a size first!");
      setIsSizeOpen(true);
      return;
    }

    dispatch(
      cartActions.addToCart({
        id: id,
        name: name,
        price: unitPrice,
        quantity: quantity,
        size: noSizeRequired ? "N/A" : selectedSize,
        image: image,
      }),
    );

    dispatch(cartActions.setCartOpen(true));
  };

  const hasVariants = variants?.length > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-14 md:bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-5px_25px_rgba(0,0,0,0.06)] px-4 py-1.5 mb-[env(safe-area-inset-bottom)]"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Product Info (Left Side) */}
            <div className="hidden sm:flex items-center gap-3 min-w-0">
              <img
                src={primaryImage}
                alt={name}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div className="flex flex-col min-w-0">
                <h4 className="text-sm! font-semibold! truncate max-w-[180px] md:max-w-[320px]">
                  {name}
                </h4>
                <div className="flex items-center gap-3 font-sans">
                  <span className="text-base font-bold text-gray-900">
                    Tk {unitPrice?.toLocaleString()}
                  </span>

                  {hasVariants && (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsSizeOpen(!isSizeOpen)}
                        disabled={isSoldOut}
                        className={`flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-md transition-all duration-200 
        ${isSizeOpen ? "border-black ring-1 ring-black" : "border-gray-200"}
        ${isSoldOut ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"}`}
                      >
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">
                          Size
                        </span>
                        <span className="text-xs font-black text-gray-800 min-w-[20px] text-center">
                          {selectedSize || "Select"}
                        </span>
                        <span
                          className={`text-[10px] transition-transform duration-300 ${
                            isSizeOpen ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      <AnimatePresence>
                        {isSizeOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: -8, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute bottom-full left-0 mb-2 w-32 bg-white border border-gray-200 rounded-lg shadow-2xl z-[70] overflow-hidden"
                          >
                            <div className="max-h-56 overflow-y-auto custom-scrollbar">
                              {variants.map((v) => {
                                const outOfStock = v.stock === 0;
                                const isSelected = selectedSize === v.size;

                                return (
                                  <button
                                    key={v.size}
                                    type="button"
                                    disabled={outOfStock}
                                    onClick={() => {
                                      dispatch(setSize(v.size));
                                      setIsSizeOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-xs font-bold border-b border-gray-50 last:border-0 transition-colors flex justify-between items-center
                    ${
                      isSelected
                        ? "bg-black text-white"
                        : outOfStock
                          ? "text-gray-300 cursor-not-allowed bg-gray-50"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                                  >
                                    <span>{v.size}</span>
                                    {outOfStock && (
                                      <span className="text-[8px] font-normal uppercase opacity-60">
                                        Out
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions (Right Side) */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Wishlist Button */}
              <button className="p-2.5 border rounded-md hover:bg-gray-50 transition">
                <Heart size={20} className="text-gray-600" />
              </button>

              {/* Quantity Selector (Desktop only) - Linked to Redux */}
              <div className="hidden md:flex items-center border rounded-md h-11 overflow-hidden">
                <button
                  onClick={decreaseQty}
                  className="px-1.5 h-full hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-1.5 font-medium select-none min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="px-1.5 h-full hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-nowrap w-full sm:w-auto justify-end">
                {/* Wrap buttons in a container that prevents wrapping */}
                <div className="flex gap-2 flex-nowrap shrink-0">
                  <PrimaryButton
                    text="Add to Cart"
                    icon={ShoppingCart}
                    onClick={handleAddToCart}
                    disabled={isSoldOut}
                    initialBg={isSoldOut ? "#D1D5DB" : "#000000"}
                    initialText={isSoldOut ? "#6B7280" : "#FFFFFF"}
                    responsive={false}
                    showTextOnMobile={false}
                    // Added whitespace-nowrap and w-max to ensure text never breaks
                    className="h-12 shadow-sm whitespace-nowrap w-max px-6"
                  />

                  <PrimaryButton
                    text="Buy It Now"
                    onClick={() => console.log("Direct Purchase")}
                    disabled={isSoldOut}
                    initialBg="#FFFFFF"
                    initialText="#000000"
                    responsive={false}
                    // Added whitespace-nowrap and w-max
                    className="hidden lg:flex h-12 px-8 border-gray-300 tracking-tight hover:border-black whitespace-nowrap w-max"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
