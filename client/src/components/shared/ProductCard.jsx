import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import { RoundActionButton } from "../atoms/RoundActionButton";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SizeBadge } from "../atoms/SizeBadge";

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="group relative cursor-pointer bg-white">
      {/* ✅ Image Container: Acts as the relative anchor for absolute children */}
      <div
        className="relative lg:overflow-hidden bg-gray-100 aspect-[5/5] lg:aspect-square"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Primary Image */}
        <img
          src={product.images?.[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Secondary Image */}
        {product.images?.[2] && (
          <img
            src={product.images[2]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* ✅ Action Buttons Overlay */}
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

        {/* ✅ Size Tags - Hidden on Mobile/Tablet, Smooth Fade on Desktop Hover */}
        <div
          className="hidden absolute left-0 bottom-16 right-0 items-center justify-center gap-2 transition-opacity duration-300 bg-black/5 py-2
                lg:flex lg:opacity-0 lg:group-hover:opacity-100 pointer-events-none lg:group-hover:pointer-events-auto"
        >
          {product.variants?.map((v) => (
            <span
              key={v.size}
              className="bg-white text-[10px] font-bold py-2 px-3 rounded-full border hover:border-black shadow min-w-[40px] text-center"
            >
              {v.size}
            </span>
          ))}
        </div>

        {/* ✅ Quick Add Button */}
        <button
          className="relative lg:absolute bottom-0 left-0 w-full z-20 bg-white mt-2 py-2 font-bold uppercase! text-sm! border! border-black! 
                        transition-transform duration-300 ease-out
                        /* Mobile: Visible */
                        translate-y-0 
                        /* Desktop: Slides up from bottom edge */
                        lg:translate-y-full lg:group-hover:translate-y-0"
        >
          Quick Add
        </button>
      </div>

      {/* Product Details Section */}
      <div className="mt-4 text-center">
        <h3 className="text-[12px]! text-gray-800 px-2 uppercase tracking-tight font-medium break-words leading-tight hover:underline">
          {/* Removed 'line-clamp-1' to allow text to wrap to the next line instead of truncating */}
          {product.name}
        </h3>
        <p className="mt-1.5 font-bold text-[14px] text-black">
          Tk {product.price}
        </p>
      </div>
    </div>
  );
};
