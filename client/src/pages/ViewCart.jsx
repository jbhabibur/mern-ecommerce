import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { X, Minus, Plus, Edit2, Info, Gift, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/atoms/Breadcrumb";

// REUSE: Project specific imports
import { getFullImagePath } from "../api/apiConfig";
import { useCartTimer } from "../hooks/useCartTimer";

export const ViewCart = () => {
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  // REUSE: Custom timer hook
  const { formattedTime } = useCartTimer(40);

  const updateQtyHandler = (id, size, type) => {
    dispatch(cartActions.updateQuantity({ id, size, type }));
  };

  const removeItemHandler = (id, size) => {
    dispatch(cartActions.removeFromCart({ id, size }));
  };

  return (
    <div className="w-full max-w-[76rem] mx-auto px-4 mb-4 md:px-10 py-8 font-sans text-[#1c1c1c]">
      <Breadcrumb />

      <h1 className="text-2xl! font-bold! mt-4 tracking-widest uppercase">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-['Poppins'] font-normal text-[12px] leading-[22px] text-[#969696] tracking-[0.02em]">
            Your cart is empty
          </p>
          <a
            href={"/collections"}
            className="no-underline! inline-block border border-black px-8 py-2 text-[16px]! text-black! font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white! transition duration-500"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <>
          {/* Timer Alert */}
          <div className="bg-[#fcf3e1] py-3 px-4 flex items-center justify-center gap-2 mb-8 border border-[#faebcc]/30">
            <Info size={18} className="text-[#3c3c3c] shrink-0" />
            <p className="text-[#3c3c3c] text-[13px] md:text-[14px] leading-none mb-0">
              Please, hurry! Someone has placed an order on one of the items you
              have in the cart. We'll keep it for you for{" "}
              <span className="font-bold text-black">{formattedTime}</span>{" "}
              minutes.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
            {/* ================= LEFT COLUMN (Items List) ================= */}
            <div className="lg:w-[85%] w-full flex-grow">
              {/* Header Row: Now visible on Mobile as well */}
              <div className="grid grid-cols-12 px-3 py-3 mb-4 bg-[#FAFAFA] text-[11px] font-black uppercase tracking-widest">
                {/* Product label: Full width on mobile, 8 cols on tablet, 5 on desktop */}
                <div className="col-span-10 min-[425px]:col-span-8 min-[765px]:col-span-5">
                  Product
                </div>

                {/* Price label: Hidden < 425px, then takes right side */}
                <div className="hidden min-[425px]:block min-[425px]:col-span-4 min-[765px]:col-span-2 text-right min-[765px]:text-center">
                  Price
                </div>

                {/* Desktop only labels */}
                <div className="hidden min-[765px]:block min-[765px]:col-span-2 text-center">
                  Quantity
                </div>
                <div className="hidden min-[765px]:block min-[765px]:col-span-2 text-right">
                  Total
                </div>
                <div className="hidden min-[765px]:block min-[765px]:col-span-1"></div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="grid grid-cols-1 min-[425px]:grid-cols-12 gap-y-4 min-[425px]:gap-4 items-start min-[765px]:items-center border p-4 md:p-6 mb-4 bg-white"
                >
                  {/* PRODUCT INFO SECTION */}
                  <div className="col-span-1 min-[425px]:col-span-8 min-[765px]:col-span-5 flex gap-4">
                    <div className="w-20 h-24 bg-gray-50 overflow-hidden shrink-0 border">
                      <img
                        src={getFullImagePath(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                      <h3 className="text-[13px]! font-bold uppercase tracking-tight mb-1 leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500 uppercase">
                        <span>{item.size}</span>
                        <Edit2
                          size={12}
                          className="cursor-pointer hover:text-black"
                        />
                      </div>
                      <p className="text-[12px] text-gray-400 mt-1 mb-0">
                        Dorjibari
                      </p>

                      {/* MOBILE ONLY (< 425px): Nested Controls */}
                      <div className="mt-3 min-[425px]:hidden">
                        <div className="font-bold text-[14px] mb-2">
                          Tk {item.price.toLocaleString()}.00
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border h-9 w-fit bg-white">
                            <button
                              onClick={() =>
                                updateQtyHandler(
                                  item.id,
                                  item.size,
                                  "decrement",
                                )
                              }
                              className="px-2"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-8 text-center text-[12px] font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQtyHandler(
                                  item.id,
                                  item.size,
                                  "increment",
                                )
                              }
                              className="px-2"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <X
                            size={18}
                            className="text-gray-400 cursor-pointer"
                            onClick={() =>
                              removeItemHandler(item.id, item.size)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TABLET RIGHT STACK (425px - 764px) */}
                  <div className="hidden min-[425px]:flex min-[765px]:hidden col-span-4 flex-col items-end justify-center">
                    <div className="font-bold text-[14px] whitespace-nowrap">
                      Tk {item.price.toLocaleString()}.00
                    </div>

                    {/* Quantity: 425px to 554px */}
                    <div className="mt-2 min-[555px]:hidden">
                      <div className="flex items-center border h-9 w-fit bg-white">
                        <button
                          onClick={() =>
                            updateQtyHandler(item.id, item.size, "decrement")
                          }
                          className="px-2"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-7 text-center text-[12px] font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQtyHandler(item.id, item.size, "increment")
                          }
                          className="px-2"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>

                    {/* Quantity + Cross: 555px to 764px */}
                    <div className="hidden min-[555px]:flex flex-col items-end gap-2 mt-2">
                      <div className="flex items-center border h-9 w-fit bg-white">
                        <button
                          onClick={() =>
                            updateQtyHandler(item.id, item.size, "decrement")
                          }
                          className="px-2"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-7 text-center text-[12px] font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQtyHandler(item.id, item.size, "increment")
                          }
                          className="px-2"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <X
                        size={16}
                        className="text-gray-400 cursor-pointer"
                        onClick={() => removeItemHandler(item.id, item.size)}
                      />
                    </div>
                  </div>

                  {/* DESKTOP COLUMNS (765px+) */}
                  <div className="hidden min-[765px]:block min-[765px]:col-span-2 text-center font-bold text-[14px]">
                    Tk {item.price.toLocaleString()}.00
                  </div>
                  <div className="hidden min-[765px]:flex min-[765px]:col-span-2 justify-center">
                    <div className="flex items-center border h-10 w-fit bg-white">
                      <button
                        onClick={() =>
                          updateQtyHandler(item.id, item.size, "decrement")
                        }
                        className="px-3"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[13px] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQtyHandler(item.id, item.size, "increment")
                        }
                        className="px-3"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="hidden min-[765px]:flex min-[765px]:col-span-2 flex-col items-end pr-4">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Total
                    </span>
                    <div className="font-bold text-[14px]">
                      Tk {item.totalPrice.toLocaleString()}.00
                    </div>
                  </div>
                  <div className="hidden min-[765px]:block min-[765px]:col-span-1 text-right">
                    <button
                      onClick={() => removeItemHandler(item.id, item.size)}
                      className="text-gray-400 hover:text-black transition"
                    >
                      <X size={20} className="ml-auto" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Extras Section */}
              <div className="flex items-center gap-2 mb-8 mt-6">
                <Gift size={20} className="text-gray-600" />
                <p className="text-[12px]! font-black uppercase tracking-widest mb-0">
                  Do you want a gift wrap?{" "}
                  <span className="text-gray-500">Only for $10.00</span>
                </p>
                <button className="ml-4 border border-black px-6 py-1.5 text-[11px]! font-black uppercase tracking-widest hover:bg-black hover:text-white transition">
                  Add
                </button>
              </div>

              <div className="mb-8 max-w-xl">
                <h3 className="text-[13px]! font-black uppercase tracking-widest mb-4">
                  Additional Comments
                </h3>
                <textarea
                  placeholder="Special instruction for seller..."
                  className="w-full border border-gray-300 p-3 h-28 text-[14px] focus:outline-none focus:border-black resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-gray-400 mb-8 md:mb-0">
                <ShieldCheck size={18} />
                <span className="text-[12px]">Secure Shopping Guarantee</span>
              </div>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
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
                  <button className="w-full bg-[#1c1c1c] hover:bg-white border border-black text-white hover:text-black! py-3 text-[12px]! font-black uppercase! tracking-[0.2em] transition-all duration-500 ease-in-out">
                    Proceed to Checkout
                  </button>
                  <button className="w-full bg-white hover:bg-[#1c1c1c] border border-black text-[#1c1c1c] hover:text-white! py-3 text-[12px]! font-black uppercase! tracking-[0.2em] transition-all duration-500 ease-in-out">
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
