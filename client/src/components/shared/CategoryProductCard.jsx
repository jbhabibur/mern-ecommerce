import React from "react";
import { Heart, Eye } from "lucide-react";

export const CategoryProductCard = ({
  images,
  title,
  price,
  description,
  view,
}) => {
  const isList = view === "list";

  // Image path check: images array theke prothom image nibe
  // Backend uploads folder-er file access korar jonno full URL banano hoyeche
  const imageUrl =
    images && images.length > 0 ? `http://localhost:5000/${images[0]}` : "";

  return (
    <div
      className={`group flex transition-all duration-300 ${
        isList
          ? "flex-row gap-4 md:gap-6 items-start md:items-center border-b border-gray-100 pb-6"
          : "flex-col w-full"
      }`}
    >
      {/* Image Container */}
      <div
        className={`relative overflow-hidden bg-gray-50 shrink-0 transition-all duration-500 ${
          isList
            ? "w-32 h-40 sm:w-40 sm:h-52 md:w-56 md:h-72"
            : "aspect-[3/4] w-full"
        }`}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition translate-x-2 group-hover:translate-x-0">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition">
            <Heart size={14} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition">
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isList ? "flex-1 pt-2" : "mt-3 text-left"}`}>
        <h3 className="font-bold text-gray-800 uppercase tracking-tight line-clamp-2 text-xs md:text-sm">
          {title}
        </h3>
        <p className="font-bold mt-1 text-gray-900 text-sm md:text-base">
          ৳ {price?.toLocaleString()}
        </p>

        {isList && (
          <div className="mt-2 md:mt-3">
            <p className="hidden sm:line-clamp-2 md:line-clamp-3 text-xs md:text-sm text-gray-500 leading-relaxed">
              {description || "No description available for this product."}
            </p>
            <button className="mt-3 px-6 py-2 bg-black text-white text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
