import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";

// Import hooks
import { PurchaseActions } from "../../../components/shared/PurchaseActions";
import { StockProgressBar } from "../../../components/atoms/StockProgressBar";
import { ViewerCount } from "../../../components/atoms/ViewerCount";

// Import redux
import { useSelector, useDispatch } from "react-redux";
import { setSize, setProductInfo } from "../../../redux/slices/selectionSlice";

export const ProductInfoSection = ({ product }) => {
  const dispatch = useDispatch();

  // Read selected size from Redux
  const { selectedSize } = useSelector((state) => state.selection);

  const unitPrice = product?.price || 0;
  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;

  // Total Stock Calculation
  const totalStock = hasVariants
    ? variants.reduce((acc, variant) => acc + (Number(variant.stock) || 0), 0)
    : Number(product?.stock) || 0;

  // Logic: Handle initial size selection and cleanup
  useEffect(() => {
    // 1. Check if there's a size in localStorage (from ProductCard click)
    const savedSize = localStorage.getItem("selectedSize");

    if (hasVariants) {
      if (savedSize) {
        // If user clicked a specific size from ProductCard, use that
        dispatch(setSize(savedSize));
      } else if (!selectedSize) {
        // Otherwise, auto-select the first available size in stock
        const initialSize = variants.find((v) => v.stock > 0)?.size || "";
        if (initialSize) {
          dispatch(setSize(initialSize));
        }
      }
    }

    // Cleanup: Clear localStorage when user leaves this product page
    return () => {
      localStorage.removeItem("selectedSize");
    };
  }, [hasVariants, variants, dispatch, selectedSize]);

  // Determine if the product is sold out
  const isFullySoldOut = hasVariants
    ? variants.every((v) => v.stock === 0)
    : product.stock === 0;

  // Dispatch all info to redux
  useEffect(() => {
    if (product) {
      dispatch(
        setProductInfo({
          id: product._id || product.id,
          name: product.name,
          unitPrice: product.price,
          image: product?.images?.[0] || "",
          isSoldOut: isFullySoldOut,
          noSizeRequired: !hasVariants,
        }),
      );
    }
  }, [product, isFullySoldOut, hasVariants, dispatch]);

  return (
    <div className="flex flex-col w-full min-w-0 font-sans text-[#1a1a1a]">
      {/* Product Title & Price */}
      <h1 className="text-lg! md:text-2xl font-bold leading-tight mb-2">
        {product?.name}
      </h1>
      <p className="text-xl font-bold mb-6">
        Tk {unitPrice.toLocaleString()}.00
      </p>

      {/* Stock Status Progress Bar */}
      <StockProgressBar currentStock={totalStock} />

      {/* Size Selector */}
      {hasVariants && (
        <div className="mb-6">
          <span className="text-sm font-bold block mb-3">
            Size:{" "}
            <span className="font-normal text-gray-500">
              {selectedSize || "Not Selected"}
            </span>
          </span>

          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isOutOfStock = variant.stock === 0;

              return (
                <button
                  key={variant.size}
                  disabled={isOutOfStock}
                  onClick={() => dispatch(setSize(variant.size))}
                  className={`h-9 min-w-[40px] px-2 border text-[13px] flex items-center justify-center transition-all 
              ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed border-dashed"
                  : "cursor-pointer"
              } 
              ${
                selectedSize === variant.size && !isOutOfStock
                  ? "border-black ring-1 ring-black"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
                >
                  <span className="whitespace-nowrap">{variant.size}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector & Action Buttons */}
      <div className="space-y-3">
        <PurchaseActions
          id={product._id || product.id}
          name={product.name}
          unitPrice={unitPrice}
          selectedSize={selectedSize}
          productImage={product?.images?.[0] || ""}
          isSoldOut={isFullySoldOut}
          noSizeRequired={!hasVariants}
        />
      </div>

      {/* Viewer Count */}
      <div className="mt-3 flex items-center gap-2 text-gray-600 text-sm">
        <ViewerCount />
      </div>
    </div>
  );
};
