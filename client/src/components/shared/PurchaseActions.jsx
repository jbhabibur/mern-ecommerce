import React, { useState } from "react";
import { Heart, Share2, Plus, Minus } from "lucide-react";
import { CartDrawer } from "../Cart/CartDrawer"; // CartDrawer ইম্পোর্ট করা হয়েছে

export const PurchaseActions = ({ unitPrice = 2490 }) => {
  const [quantity, setQuantity] = useState(1);
  const [openCart, setOpenCart] = useState(false);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="flex flex-col gap-4 w-full relative">
      {/* আলাদা করা CartDrawer Component */}
      <CartDrawer isOpen={openCart} onClose={() => setOpenCart(false)} />

      <div className="text-base">
        <span className="text-gray-600 font-medium">Subtotal: </span>
        <span className="font-bold text-gray-900">
          Tk {(unitPrice * quantity).toLocaleString()}.00
        </span>
      </div>

      <div className="text-[13px] font-semibold uppercase tracking-wider text-gray-700 -mb-2">
        Quantity:
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        {/* Main Qty Selector */}
        <div className="flex items-center border border-gray-300 h-12 w-fit bg-white">
          <button
            onClick={handleDecrement}
            className="px-3 h-full hover:bg-gray-50 text-gray-500 transition-colors border-r border-gray-300"
          >
            <Minus size={16} />
          </button>
          <div className="w-12 flex items-center justify-center font-bold text-gray-800">
            {quantity}
          </div>
          <button
            onClick={handleIncrement}
            className="px-3 h-full hover:bg-gray-50 text-gray-500 transition-colors border-l border-gray-300"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:flex-1">
          <button
            onClick={() => setOpenCart(true)}
            className="flex-1 bg-[#1a1a1a] text-white h-12 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-sm active:scale-[0.98]"
          >
            ADD TO CART
          </button>

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

      <button className="w-full border border-gray-300 h-12 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border-black transition-all">
        BUY IT NOW
      </button>
    </div>
  );
};
