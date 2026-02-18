import { useState, useEffect } from "react";
import { X, ShoppingBag, Gift, Tag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { getFullImagePath } from "../../api/apiConfig";

// Import components
import { CartItem } from "./CartItem";
import { EditItemModal } from "./EditItemModal";
import { YouMayAlsoLike } from "./YouMayAlsoLike";

// Redux hooks and actions
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { useCustomCursor } from "../../hooks/useCustomCursor";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const isOpen = useSelector((state) => state.cart.isCartOpen);

  const { mousePos } = useCustomCursor(isOpen);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Auto-close on mount/reload logic
  useEffect(() => {
    dispatch(cartActions.setCartOpen(false));
  }, [dispatch]);

  // Background scroll off
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible md:cursor-none"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => dispatch(cartActions.setCartOpen(false))}
      >
        {/* 2. Floating Close Button */}
        <div
          className="fixed pointer-events-none z-[110] hidden md:flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-xl transition-transform duration-100 ease-out"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <X className="w-6 h-6 text-black" />
        </div>
      </div>
      {/* <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => dispatch(cartActions.setCartOpen(false))}
      /> */}

      {/* Main Drawer Container */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[90%] md:max-w-[400px] bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.07,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex justify-between items-start border-b border-gray-100">
          <div>
            <h2 className="text-lg! font-bold text-gray-900 tracking-tight">
              Shopping Cart
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">
              {totalQuantity} items
            </p>
          </div>
          <button
            onClick={() => dispatch(cartActions.setCartOpen(false))}
            className="p-1 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="max-h-[40vh] overflow-y-auto px-4 pt-4 pb-2 space-y-8 scrollbar-hide">
          <div className="space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}`}
                  item={item}
                  dispatch={dispatch}
                  handleEditItem={handleEditItem}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                Your cart is empty
              </div>
            )}
          </div>

          {/* Slider Section */}
          <div className="pt-6 border-t border-gray-100">
            <YouMayAlsoLike />
          </div>
        </div>

        {/* Sticky Footer Area */}
        <div className="p-4 border-t border-gray-100 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex border border-gray-200 rounded-sm mb-3">
            <button className="flex-1 py-3 border-r flex justify-center hover:bg-gray-50 transition-colors">
              <ShoppingBag size={18} />
            </button>
            <button className="flex-1 py-3 border-r flex justify-center hover:bg-gray-50 transition-colors">
              <Gift size={18} />
            </button>
            <button className="flex-1 py-3 flex justify-center hover:bg-gray-50 transition-colors">
              <Tag size={18} />
            </button>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>Subtotal:</span>
              <span>Tk {totalAmount.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-black tracking-tight">
              <span>Total:</span>
              <span>Tk {totalAmount.toLocaleString()}.00</span>
            </div>
            <p className="text-[12px]! text-[#868686] mt-2 leading-relaxed">
              Tax included and shipping calculated at checkout
            </p>
          </div>

          <div className="space-y-3!">
            <button className="w-full bg-black hover:bg-white! text-white hover:text-black! border border-black! py-2 font-bold text-[11px] transition-all duration-500! uppercase!">
              Checkout
            </button>
            <a
              href={"/cart"}
              onClick={() => dispatch(cartActions.setCartOpen(false))}
            >
              <button className="w-full bg-white hover:bg-black! text-black hover:text-white! border border-black! py-2 font-bold text-[11px] transition-all duration-500! uppercase!">
                View Cart
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* RENDER MODAL HERE: Outside the drawer div for full-screen overlay */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={selectedItem}
      />
    </>
  );
};
