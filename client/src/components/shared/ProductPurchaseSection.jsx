import React, { useState } from "react";
import { Heart, Share2, Plus, Minus, Eye } from "lucide-react";
import { PurchaseActions } from "./PurchaseActions";
import { StockProgressBar } from "../atoms/StockProgressBar";

export const ProductPurchaseSection = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  // ১. পরিবর্তন: unitPrice সরাসরি প্রপস থেকে নিতে হবে
  const unitPrice = product?.price || 0;

  // Dynamic initial state: select first size that is in stock
  const initialSize = product?.variants?.find((v) => v.stock > 0)?.size || "";
  const [selectedSize, setSelectedSize] = useState(initialSize);

  const variants = product?.variants || [];

  // Calculate subtotal for the display
  const subtotal = (unitPrice * quantity).toLocaleString();

  console.log(product);

  return (
    <div className="flex flex-col w-full max-w-md font-sans text-[#1a1a1a]">
      {/* Product Title & Price */}
      <h1 className="text-lg! md:text-2xl font-bold leading-tight mb-2">
        {product?.name}
      </h1>
      <p className="text-xl font-bold mb-6">
        Tk {unitPrice.toLocaleString()}.00
      </p>

      {/* Stock Status Bar */}
      <StockProgressBar />

      {/* Size Selector */}
      <div className="mb-6">
        <span className="text-sm font-bold block mb-3">
          Size:{" "}
          <span className="font-normal text-gray-500">
            {selectedSize || "Not Selected"}
          </span>
        </span>
        <div className="flex gap-2">
          {/* ৩. পরিবর্তন: ডায়নামিক ম্যাপ এবং স্টক চেক লজিক */}
          {variants.map((variant) => {
            const isOutOfStock = variant.stock === 0; // স্টক চেক করা হচ্ছে

            return (
              <button
                key={variant.size}
                disabled={isOutOfStock} // ৪. পরিবর্তন: স্টক না থাকলে বাটন ডিজেবল
                onClick={() => setSelectedSize(variant.size)}
                className={`w-12 h-11 border text-sm flex items-center justify-center transition-all 
                  ${isOutOfStock ? "bg-gray-100 text-gray-300 cursor-not-allowed border-dashed" : ""} 
                  ${
                    selectedSize === variant.size && !isOutOfStock
                      ? "border-black border-2 font-bold"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Action Buttons */}
      <div className="space-y-3">
        <div className="text-sm font-medium mb-2">Quantity:</div>

        <PurchaseActions
          id={product.id}
          name={product.name}
          unitPrice={unitPrice}
          selectedSize={selectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          // ইমেজ প্রপস হিসেবে পাঠানো হচ্ছে (প্রথম ইমেজটি)
          productImage={product?.images?.[0] || ""}
        />
      </div>

      {/* Viewer Count */}
      <div className="mt-6 flex items-center gap-2 text-gray-600 text-sm">
        <Eye size={18} />
        <span>250 customers are viewing this product</span>
      </div>
    </div>
  );
};
