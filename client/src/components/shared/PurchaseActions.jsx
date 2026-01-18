import React, { useState } from "react";
import { Heart, Share2, Plus, Minus } from "lucide-react";

export const PurchaseActions = ({ unitPrice = 2490 }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Subtotal Display */}
      <div className="text-base">
        <span className="text-gray-600">Subtotal: </span>
        <span className="font-bold">
          Tk {(unitPrice * quantity).toLocaleString()}.00
        </span>
      </div>

      <div className="text-sm font-medium -mb-2">Quantity:</div>

      {/* 2. Quantity Counter - Mobile-e upore thakbe, Desktop-e row-te thakbe */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <div className="flex items-center border border-gray-300 h-12 w-fit bg-white">
          <button
            onClick={handleDecrement}
            className="px-2 h-full hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Minus size={16} />
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            className="w-12 text-center outline-none border-x border-gray-300 h-full font-medium"
          />
          <button
            onClick={handleIncrement}
            className="px-2 h-full hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 3. Add to Cart & Wishlist/Share Group */}
        <div className="flex items-center gap-2 w-full md:flex-1">
          {/* Add to Cart Button */}
          <button className="flex-1 bg-[#1a1a1a] text-white h-12 font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors">
            ADD TO CART
          </button>

          {/* Wishlist & Share - Sob device-ei side-by-side */}
          <div className="flex items-center gap-2">
            <button className="p-3 border border-gray-200 rounded-full! hover:bg-gray-50 transition-colors">
              <Heart size={22} className="text-gray-700" />
            </button>
            <button className="p-3 text-gray-500 hover:text-black transition-colors">
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Buy It Now Button - Full width for all devices */}
      <button className="w-full border border-gray-300 h-12 font-bold text-sm uppercase hover:bg-gray-50 transition-all">
        BUY IT NOW
      </button>
    </div>
  );
};
