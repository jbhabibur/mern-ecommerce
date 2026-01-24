import React from "react";
import { X, Plus, Minus, ShoppingBag, Gift, Tag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { getFullImagePath } from "../../api/apiConfig";

// Redux hooks and actions
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export const CartDrawer = () => {
  const dispatch = useDispatch();

  // ১. রিডাক্স স্টোর থেকে ডায়নামিক ডেটা নেওয়া
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const isOpen = useSelector((state) => state.cart.isCartOpen);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => dispatch(cartActions.setCartOpen(false))}
      />

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
                  item={item} // পুরো অবজেক্ট পাঠানো হলো ক্লিন কোডের জন্য
                  dispatch={dispatch}
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold! text-gray-800 text-sm! uppercase tracking-wide">
                You May Also Like
              </h3>
              <div className="flex gap-2">
                <button className="prev-btn w-6 h-6 flex items-center justify-center border rounded-full hover:bg-black hover:text-white transition-all text-[10px]">
                  ❮
                </button>
                <button className="next-btn w-6 h-6 flex items-center justify-center border rounded-full hover:bg-black hover:text-white transition-all text-[10px]">
                  ❯
                </button>
              </div>
            </div>

            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".prev-btn", nextEl: ".next-btn" }}
              spaceBetween={12}
              slidesPerView={1}
            >
              {[1, 2, 3].map((id) => (
                <SwiperSlide key={id}>
                  <div className="flex gap-3 border p-2 rounded-sm bg-gray-50/50 group cursor-pointer">
                    <div className="w-18 h-18 bg-gray-200 object-cover shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-medium text-gray-700 truncate leading-tight">
                        Full Sleeve Blue Door_Regular Fit
                      </p>
                      <p className="text-xs font-bold mt-1">Tk 2,490.00</p>
                      <button className="text-[9px] font-bold underline uppercase mt-1 group-hover:text-blue-600 transition-colors">
                        Quick Add
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
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
    </>
  );
};

// Internal Component for individual Cart Items
const CartItem = ({ item, dispatch }) => {
  const { id, image, name, size, price, quantity } = item;

  return (
    <div className="flex gap-4 relative">
      <div className="flex-shrink-0">
        <img
          src={getFullImagePath(image)}
          alt={name}
          className="w-20 h-24 object-cover border border-gray-100"
        />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-[13px]! font-medium text-gray-800 leading-tight mb-1 truncate">
          {name}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-2 uppercase tracking-wider">
          <span>{size}</span>
          <button className="hover:text-black transition-colors">✎</button>
        </div>
        <p className="text-sm font-bold mb-3 font-mono tracking-tighter">
          Tk {price.toLocaleString()}.00
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-200 w-fit rounded-sm">
          <button
            onClick={() =>
              dispatch(
                cartActions.updateQuantity({
                  id,
                  size,
                  type: "decrement",
                }),
              )
            }
            className="px-2 py-1 text-gray-400 hover:text-black transition-all hover:bg-gray-50"
          >
            <Minus size={12} />
          </button>
          <span className="w-8 text-center text-xs font-bold border-x py-1 border-gray-200">
            {quantity}
          </span>
          <button
            onClick={() =>
              dispatch(
                cartActions.updateQuantity({
                  id,
                  size,
                  type: "increment",
                }),
              )
            }
            className="px-2 py-1 text-gray-400 hover:text-black transition-all hover:bg-gray-50"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      {/* Remove Item Button */}
      <button
        onClick={() => dispatch(cartActions.removeFromCart({ id, size }))}
        className="absolute top-0 right-0 text-gray-300 hover:text-black transition-all"
      >
        <X size={18} />
      </button>
    </div>
  );
};
