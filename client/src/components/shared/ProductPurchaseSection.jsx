import React, { useState } from "react";
import { Heart, Share2, Plus, Minus, Eye } from "lucide-react";
import { PurchaseActions } from "./PurchaseActions";
import { StockProgressBar } from "../atoms/StockProgressBar";

export const ProductPurchaseSection = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("15");
  const unitPrice = 2490;

  const subtotal = (unitPrice * quantity).toLocaleString();
  const sizes = ["15", "15.5", "16", "16.5"];

  console.log(product);

  return (
    <div className="flex flex-col w-full max-w-md bg-green-500 font-sans text-[#1a1a1a]">
      {/* Product Title & Price */}
      <h1 className="text-lg! md:text-2xl font-bold leading-tight mb-2">
        {product?.name}
      </h1>
      <p className="text-xl font-bold mb-6">
        Tk {product?.price?.toLocaleString()}.00
      </p>

      {/* Stock Status Bar */}
      <StockProgressBar />

      {/* Size Selector */}
      <div className="mb-6">
        <span className="text-sm font-bold block mb-3">
          Size:{" "}
          <span className="font-normal text-gray-500">{selectedSize}</span>
        </span>
        <div className="flex gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-11 border text-sm flex items-center justify-center transition-all ${
                selectedSize === size
                  ? "border-black border-2 font-bold"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="space-y-3">
        <div className="text-sm font-medium mb-2">Quantity:</div>

        <PurchaseActions unitPrice={2490} />
      </div>

      {/* Viewer Count */}
      <div className="mt-6 flex items-center gap-2 text-gray-600 text-sm">
        <Eye size={18} />
        <span>250 customers are viewing this product</span>
      </div>
    </div>
  );
};
