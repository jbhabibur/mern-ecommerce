import React, { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

import { getFullImagePath } from "../../api/apiConfig";

export const EditItemModal = ({ isOpen, onClose, item }) => {
  const [quantity, setQuantity] = useState(2);
  const [selectedSize, setSelectedSize] = useState("M");

  if (!isOpen) return null;

  console.log(item?.name);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
      {/* Rectangular Compact Container */}
      <div className="relative w-full max-w-[52rem] bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header - Height Reduced */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[11px]! font-bold! uppercase text-gray-900">
            Edit Option
          </h2>
          <button
            onClick={onClose}
            className="bg-black text-white p-1.5 hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area - Padding & Gap Reduced */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Product Image - Smaller Width */}
            <div className="w-full md:w-[180px] shrink-0">
              <img
                src={getFullImagePath(item?.image)}
                alt="Product"
                className="w-full aspect-[3/4] object-cover border border-gray-100"
              />
            </div>

            {/* Right: Product Details */}
            <div className="w-full flex flex-col pt-1">
              <h3 className="text-[13px]! font-bold text-gray-800 uppercase tracking-wide">
                {item?.name}
              </h3>

              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">
                  Size: {selectedSize}
                </p>
              </div>
              <p className="text-[14px] font-black text-gray-900">
                Tk 1,690.00
              </p>

              {/* Selection Grid - Compact Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {/* Quantity Section */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block text-gray-400">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-200 w-32 h-9">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 h-full hover:bg-gray-50 flex items-center justify-center border-r border-gray-200 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center text-xs font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex-1 h-full hover:bg-gray-50 flex items-center justify-center border-l border-gray-200 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Size Section */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block text-gray-400">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-9 h-9 flex items-center justify-center text-[10px] font-bold border transition-all ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-black text-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button - Slimmer height */}
        <button className="w-full bg-[#1c1c1c] text-white py-2 font-bold text-md! hover:bg-black transition-colors uppercase! border-t border-white/10">
          Update Cart
        </button>
      </div>
    </div>
  );
};
