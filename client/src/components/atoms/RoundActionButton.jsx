import React from "react";
import { Heart, Eye } from "lucide-react";

export const RoundActionButton = ({
  type = "wishlist",
  onClick,
  isExpanded,
}) => {
  const isWishlist = type === "wishlist";

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-end bg-white text-black rounded-full h-10 transition-all duration-300 ease-in-out cursor-pointer shadow-md overflow-hidden mb-2 border border-gray-100
        ${isExpanded ? "w-36 px-2" : "w-10"} 
      `}
    >
      {/* Label: Controlled by isExpanded prop */}
      <span
        className={`absolute left-4 transition-opacity duration-300 whitespace-nowrap text-[11px] font-bold uppercase tracking-tight
        ${isExpanded ? "opacity-100" : "opacity-0"}
      `}
      >
        {isWishlist ? "Add To Wishlist" : "Quick View"}
      </span>

      {/* Icon Wrapper */}
      <div className="flex items-center justify-center w-10 h-10 shrink-0">
        {isWishlist ? (
          <Heart
            size={18}
            className={`${isExpanded ? "fill-black" : ""} transition-colors`}
          />
        ) : (
          <Eye size={18} />
        )}
      </div>
    </div>
  );
};
