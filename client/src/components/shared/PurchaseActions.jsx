import { Heart, Share2, Plus, Minus } from "lucide-react";

// Import components
import { PrimaryButton } from "../../components/atoms/PrimaryButton";
import { RoundActionButton } from "../../components/atoms/RoundActionButton";
import { ShareModal } from "./ShareModal";

// Import hooks
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import {
  incrementQuantity,
  decrementQuantity,
} from "../../redux/slices/selectionSlice";
import {
  addToWishlistLocal,
  addToWishlistDB,
  removeFromWishlistLocal,
  removeFromWishlistDB,
} from "../../redux/slices/wishlistSlice";
import { useCheckoutInitiate } from "../../hooks/useCheckoutInitiate";
import { useState } from "react";

export const PurchaseActions = ({
  id,
  name,
  unitPrice,
  selectedSize,
  productImage,
  isSoldOut,
  noSizeRequired,
}) => {
  const [openShareModal, setOpenShareModal] = useState(false);
  const dispatch = useDispatch();
  const { onProceed, isProcessing } = useCheckoutInitiate();

  // Data form redux
  const { quantity } = useSelector((state) => state.selection);

  // Extract the URL string from the object safely
  const imageUrl = productImage?.url || productImage;

  /**
   * Handle adding product to cart with size validation
   */
  const handleAddToCart = () => {
    if (!noSizeRequired && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    dispatch(
      cartActions.addToCart({
        id: id,
        name: name,
        price: unitPrice,
        quantity: quantity,
        size: noSizeRequired ? "N/A" : selectedSize,
        image: imageUrl, // Sending the string URL
      }),
    );

    dispatch(cartActions.setCartOpen(true));
  };

  const handleIncrement = () => dispatch(incrementQuantity());
  const handleDecrement = () => dispatch(decrementQuantity());
  const handleBuyNow = () => {
    if (!noSizeRequired && !selectedSize) {
      alert("Please select a size first!");
      return;
    }

    onProceed(true, {
      id: id,
      name: name,
      price: unitPrice,
      quantity: quantity,
      size: noSizeRequired ? "N/A" : selectedSize,
      image: imageUrl,
    });
  };

  // Safe calculation for subtotal
  const safeUnitPrice = Number(unitPrice) || 0;
  const safeQuantity = Number(quantity) || 1;
  const subtotal = safeUnitPrice * safeQuantity;

  /* -------- Start: Wishlist Added Logic (Adjusted) ------------ */
  const { wishlistItems = [] } = useSelector((state) => state.wishlist || {});
  const { token } = useSelector((state) => state.auth);

  const isWishlisted = wishlistItems?.some(
    (item) => item && (item?._id === id || item?.id === id),
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) return;

    const productData = {
      _id: id,
      id: id,
      name: name,
      price: unitPrice,
      images: [
        {
          url: imageUrl,
          isPrimary: true,
        },
      ],
    };

    if (token) {
      if (isWishlisted) {
        dispatch(removeFromWishlistDB({ productId: id }));
      } else {
        dispatch(addToWishlistDB({ productId: id }));
      }
    } else {
      if (isWishlisted) {
        dispatch(removeFromWishlistLocal(id));
      } else {
        dispatch(addToWishlistLocal(productData));
      }
    }
  };
  /* -------- End: Wishlist Added Logic ------------ */

  // Get the current URL for sharing
  const productUrl = typeof window !== "undefined" ? window.location.href : "";

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
            <div className="flex items-center border border-gray-300 h-12 w-fit">
              <button
                type="button"
                onClick={handleDecrement}
                className="px-1.5 h-full hover:bg-gray-50 text-gray-500 transition-colors"
              >
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
                <RoundActionButton
                  onClick={handleWishlistToggle}
                  icon={() => (
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isWishlisted ? "fill-black text-black" : "text-gray-600"
                      }`}
                    />
                  )}
                  expandableText="Add to Wishlist"
                />
                <button
                  onClick={() => setOpenShareModal(true)}
                  className="p-3 text-gray-400 hover:text-black transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          <PrimaryButton
            text="BUY IT NOW"
            onClick={handleBuyNow}
            disabled={isProcessing}
            initialBg="#FFFFFF"
            initialText="#000000"
            responsive={false}
            className="w-full h-12 border-gray-300 tracking-[0.2em] hover:border-black"
          />
        </>
      )}

      {isSoldOut && (
        <button className="w-full bg-gray-100 text-gray-400 border border-gray-200 h-12 font-bold text-[11px] uppercase tracking-[0.2em] cursor-not-allowed">
          NOTIFY ME WHEN AVAILABLE
        </button>
      )}

      {/* Add Share Modal */}
      <ShareModal
        isOpen={openShareModal}
        onClose={() => setOpenShareModal(false)}
        productUrl={productUrl}
      />
    </div>
  );
};
