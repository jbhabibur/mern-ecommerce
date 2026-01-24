import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import { RoundActionButton } from "../atoms/RoundActionButton";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export const ProductCard = ({ product, view }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const isList = view === "list";

  // Gallery-r moto BASE_URL variable ti nite hobe
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- STOCK LOGIC ---
  const getStockStatus = () => {
    if (!product.variants || product.variants.length === 0) {
      return product.stock === 0;
    }
    if (product.variants.length === 1 && !product.variants[0].size) {
      const stockValue =
        typeof product.variants[0] === "string"
          ? parseInt(product.variants[0].replace(/[^0-9]/g, ""))
          : product.variants[0].stock;
      return stockValue === 0;
    }
    const totalStockCount = product.variants.reduce(
      (acc, v) => acc + (v.stock || 0),
      0,
    );
    return totalStockCount === 0;
  };

  const isFullySoldOut = getStockStatus();

  return (
    <a href={`/products/${product.slug}`} className="no-underline! text-black!">
      <div
        className={`group relative cursor-pointer bg-white ${
          isList ? "flex flex-row gap-6 border-b pb-6" : "flex flex-col"
        }`}
      >
        {/* Image Container */}
        <div
          className={`relative lg:overflow-hidden bg-gray-100 ${
            isList
              ? "w-32 h-40 sm:w-48 sm:h-60 md:w-64 md:h-80 shrink-0"
              : "aspect-[3/3] lg:aspect-square w-full"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* SOLD OUT OVERLAY */}
          {isFullySoldOut && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[1px] pointer-events-none">
              <span className="bg-[#C1C1C1] text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Sold Out
              </span>
            </div>
          )}

          {/* ✅ Primary Image: SingleProduct-er moto logic */}
          <img
            src={`${BASE_URL}/${product.images[0]}`}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isHovered && !isList ? "opacity-0" : "opacity-100"
            } ${isFullySoldOut ? "grayscale-[0.5] opacity-80" : ""}`}
          />

          {/* ✅ Secondary Image: SingleProduct-er moto logic */}
          {product.images?.[2] && (
            <img
              src={`${BASE_URL}/${product.images[2]}`}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Action Buttons */}
          <div className="absolute right-2 top-2 z-30 flex flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
            <RoundActionButton
              icon={Heart}
              expandable={isDesktop}
              expandableText="Add to Wishlist"
            />
            <RoundActionButton
              icon={Eye}
              expandable={isDesktop}
              expandableText="Quick View"
            />
          </div>

          {/* Size Tags */}
          {!isFullySoldOut &&
            product.variants?.length > 0 &&
            product.variants[0].size && (
              <div className="hidden absolute left-0 bottom-16 right-0 items-center justify-center gap-2 transition-opacity duration-300 bg-black/5 py-2 lg:flex lg:opacity-0 lg:group-hover:opacity-100 pointer-events-none lg:group-hover:pointer-events-auto">
                {product.variants
                  .filter((v) => v.stock > 0)
                  .map((v) => (
                    <span
                      key={v.size}
                      className="bg-white text-[10px] font-bold py-2 px-3 rounded-full border border-gray-100 shadow-sm text-black"
                    >
                      {v.size}
                    </span>
                  ))}
              </div>
            )}

          {/* Desktop Button */}
          {!isList && (
            <button
              className={`hidden lg:block absolute bottom-0 left-0 w-full z-30 py-2 font-bold uppercase text-sm border border-black transition-all duration-300 translate-y-full group-hover:translate-y-0 ${isFullySoldOut ? "bg-white text-black" : "bg-black text-white"}`}
            >
              {isFullySoldOut ? "Notify Me" : "Quick Add"}
            </button>
          )}
        </div>

        {/* Mobile Button */}
        {!isList && (
          <button
            className={`lg:hidden w-full mt-2 py-2 font-bold uppercase text-sm border border-black ${isFullySoldOut ? "bg-white text-black" : "bg-black text-white"}`}
          >
            {isFullySoldOut ? "Notify Me" : "Quick Add"}
          </button>
        )}

        {/* Product Details */}
        <div
          className={`mt-4 ${isList ? "flex-1 text-left mt-0 pt-2" : "text-center"}`}
        >
          <h3
            className={`text-[12px]! uppercase tracking-tight font-medium! break-words leading-tight hover:underline ${isFullySoldOut ? "text-gray-400" : "text-gray-800"}`}
          >
            {product.name}
          </h3>
          <p
            className={`mt-1.5 font-bold text-[14px] ${isFullySoldOut ? "text-gray-400" : "text-black"}`}
          >
            Tk {product.price}
          </p>
          {isList && (
            <div className="mt-4">
              <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                {product.description}
              </p>
              <button
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest ${isFullySoldOut ? "bg-gray-100 text-gray-400 border border-gray-200" : "bg-black text-white"}`}
              >
                {isFullySoldOut ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};
