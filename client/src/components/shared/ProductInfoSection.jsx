import React, { useState } from "react";
import { Eye } from "lucide-react";
import { PurchaseActions } from "./PurchaseActions";
import { StockProgressBar } from "../atoms/StockProgressBar";

export const ProductInfoSection = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const unitPrice = product?.price || 0;
  const variants = product?.variants || [];

  // 1. Check if product has sizes/variants
  const hasVariants = variants.length > 0;

  // 2. Logic: If it has sizes, find the first available size.
  // If it's a belt (no sizes), selectedSize remains null or empty.
  const initialSize = hasVariants
    ? variants.find((v) => v.stock > 0)?.size || ""
    : "";

  const [selectedSize, setSelectedSize] = useState(initialSize);

  // 3. Determine if the product is sold out
  const isFullySoldOut = hasVariants
    ? variants.every((v) => v.stock === 0)
    : product.stock === 0;

  return (
    <div className="flex flex-col w-full max-w-md font-sans text-[#1a1a1a]">
      {/* Product Title & Price */}
      <h1 className="text-lg! md:text-2xl font-bold leading-tight mb-2">
        {product?.name}
      </h1>
      <p className="text-xl font-bold mb-6">
        Tk {unitPrice.toLocaleString()}.00
      </p>

      {/* Stock Status Progress Bar */}
      <StockProgressBar />

      {/* 4. Size Selector: Hide completely for items without variants (like belts) */}
      {hasVariants && (
        <div className="mb-6">
          <span className="text-sm font-bold block mb-3">
            Size:{" "}
            <span className="font-normal text-gray-500">
              {selectedSize || "Not Selected"}
            </span>
          </span>

          <div className="flex gap-2">
            {variants.map((variant) => {
              const isOutOfStock = variant.stock === 0;

              return (
                <button
                  key={variant.size}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`w-12 h-11 border text-sm flex items-center justify-center transition-all 
                    ${
                      isOutOfStock
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed border-dashed"
                        : ""
                    } 
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
      )}

      {/* Quantity Selector & Action Buttons */}
      <div className="space-y-3">
        {!isFullySoldOut && (
          <div className="text-sm font-medium mb-2">Quantity:</div>
        )}

        <PurchaseActions
          id={product.id}
          name={product.name}
          unitPrice={unitPrice}
          selectedSize={selectedSize} // This will be empty for belts, which is correct
          quantity={quantity}
          setQuantity={setQuantity}
          productImage={product?.images?.[0] || ""}
          isSoldOut={isFullySoldOut}
          noSizeRequired={!hasVariants} // Tell PurchaseActions that size isn't needed
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
