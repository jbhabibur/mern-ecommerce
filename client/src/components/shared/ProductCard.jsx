import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import { RoundActionButton } from "../atoms/RoundActionButton";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SizeBadge } from "../atoms/SizeBadge";

export const ProductCard = ({ product, view }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // view logic handle করার জন্য
  const isList = view === "list";

  // --- STOCK LOGIC FROM HOOK ---
  // If displayStatus is "NOTIFY_ME", it means all sizes are 0 stock
  const isSoldOut = product.displayStatus === "NOTIFY_ME";
  const isPartialStock = product.displayStatus === "SELECT_SIZE";

  return (
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
            : "aspect-[5/5] lg:aspect-square w-full"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* SOLD OUT OVERLAY: Show if all sizes are zero */}
        {isSoldOut && (
          <div className="absolute left-0 top-0 z-10 flex items-center justify-center bg-black/20">
            <span className="bg-[#C1C1C1] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Primary Image */}
        <img
          src={`http://localhost:5000/${product.images[0]}`}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && !isList ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Secondary Image */}
        {product.images?.[2] && (
          <img
            src={`http://localhost:5000/${product.images[2]}`}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100! transition-opacity duration-300">
          <RoundActionButton
            icon={Heart}
            expandable={isDesktop}
            expandableText="Add to Wishlist"
          />
        </div>

        <div className="absolute right-2 top-12 flex flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100! transition-opacity duration-300">
          <RoundActionButton
            icon={Eye}
            expandable={isDesktop}
            expandableText="Quick View"
          />
        </div>

        {/* ✅ Size Tags - Hidden if Sold Out, shows only available sizes dynamically */}
        {!isSoldOut && product.variants && product.variants.length > 0 && (
          <div
            className="hidden absolute left-0 bottom-16 right-0 items-center justify-center gap-2 transition-opacity duration-300 bg-black/5 py-2
        lg:flex lg:opacity-0 lg:group-hover:opacity-100 pointer-events-none lg:group-hover:pointer-events-auto"
          >
            {product.variants
              .filter((v) => v.stock > 0) // Only show sizes that are in stock
              .map((v) => (
                <span
                  key={v.size}
                  className="bg-white text-[10px] font-bold py-2 px-3 rounded-full border hover:border-black shadow min-w-[40px] text-center text-black"
                >
                  {v.size}
                </span>
              ))}
          </div>
        )}

        {/* Quick Add / Notify Me Button (GRID MODE) */}
        {!isList && (
          <button
            disabled={isSoldOut && false} // Keep clickable if you want to trigger a modal
            className={`relative lg:absolute bottom-0 left-0 w-full z-20 mt-2 py-2 font-bold uppercase! text-sm! border! border-black! 
                        transition-transform duration-300 ease-out translate-y-0 
                        lg:translate-y-full lg:group-hover:translate-y-0
                        ${isSoldOut ? "bg-white border-black! text-black" : "bg-black text-white"}`}
          >
            {isSoldOut ? "Notify Me" : "Quick Add"}
          </button>
        )}
      </div>

      {/* Product Details Section */}
      <div
        className={`mt-4 ${isList ? "flex-1 text-left mt-0 pt-2" : "text-center"}`}
      >
        <h3 className="text-[12px]! text-gray-800 px-2 uppercase tracking-tight font-medium break-words leading-tight hover:underline">
          {product.name}
        </h3>
        <p className="mt-1.5 font-bold text-[14px] text-black">
          Tk {product.price}
        </p>

        {/* List mode এর জন্য ডেসক্রিপশন এবং বাটন */}
        {isList && (
          <div className="mt-4">
            <p className="text-gray-500 text-xs line-clamp-2 mb-4">
              {product.description}
            </p>
            <button className="px-6 py-2 bg-black text-white text-[10px] uppercase font-bold tracking-widest">
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
