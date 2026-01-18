import React from "react";

export const SizeBadge = ({ sizes }) => {
  return (
    // Ensure the parent container has h-full or a defined height for vertical centering
    <div className="flex flex-col items-center justify-center gap-3 p-6 h-full">
      {sizes.map((size, index) => (
        // Circular badge with centered text and hover transition effects
        <button
          key={index}
          className="bg-white rounded-full border shadow-sm flex items-center justify-center w-10 h-10 text-xs font-bold hover:border-black transition-colors"
        >
          {size}
        </button>
      ))}
    </div>
  );
};
