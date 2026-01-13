import React, { useState } from "react";
import demoImage from "../../assets/images/hero/hero2.jpeg";
import { QuickAddActionBtn } from "../atoms/QuickAddActionBtn";
import { SizeBadge } from "../atoms/SizeBadge";
import { RoundActionButton as ActionButton } from "../atoms/RoundActionButton";

export const ProductCard = ({
  title = "Product Name",
  price = "TK 2490",
  disabled = false,
}) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Separate states for each button expansion
  const [wishlistExpanded, setWishlistExpanded] = useState(false);
  const [quickViewExpanded, setQuickViewExpanded] = useState(false);

  return (
    <div className="w-full bg-white transition-shadow duration-300">
      <div
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        className="relative overflow-hidden group bg-gray-50 aspect-square"
      >
        <img
          src={demoImage}
          alt="Product"
          className="w-full h-full object-cover block transition-all duration-200 ease-out group-hover:scale-300 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />

        {/* Buttons Layer */}
        <div
          className={`absolute top-2 right-2 md:top-4 md:right-4 z-10 flex flex-col items-end transition-all duration-300
          ${
            isCardHovered
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
          }`}
        >
          {/* Wishlist Toggle */}
          <div
            onMouseEnter={() => setWishlistExpanded(true)}
            onMouseLeave={() => setWishlistExpanded(false)}
          >
            <ActionButton
              type="wishlist"
              isExpanded={wishlistExpanded}
              onClick={() => console.log("Wishlist Clicked")}
            />
          </div>

          {/* Quick View Toggle */}
          <div
            onMouseEnter={() => setQuickViewExpanded(true)}
            onMouseLeave={() => setQuickViewExpanded(false)}
          >
            <ActionButton
              type="quickview"
              isExpanded={quickViewExpanded}
              onClick={() => console.log("Quick View Clicked")}
            />
          </div>
        </div>

        {/* Size Badge */}
        <div
          className={`absolute bottom-[65px] left-0 w-full flex justify-center transition-opacity duration-300 
          ${isCardHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <SizeBadge />
        </div>

        {/* Quick Add Button */}
        <div
          className={`absolute bottom-0 left-0 w-full transition-transform duration-300 
          ${isCardHovered ? "translate-y-0" : "translate-y-full"}`}
        >
          <QuickAddActionBtn title="QUICK ADD" />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <h3 className="text-xs! text-gray-900 font-normal line-clamp-2">
          {title}
        </h3>
        <span className="text-gray-950 font-bold text-sm mt-1">Tk {price}</span>
      </div>
    </div>
  );
};
