import React from "react";

const SkeletonCard = () => (
  <div className="flex flex-col items-center w-full">
    {/* Image Placeholder: Matches the 220px height & styling */}
    <div className="relative overflow-hidden bg-gray-200 w-full h-[220px] mb-8">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>

    {/* Title Placeholder: Matches the text size/spacing */}
    <div className="relative overflow-hidden bg-gray-200 h-8 w-3/4 mb-2">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>

    {/* Subtitle/Product Count Placeholder */}
    <div className="relative overflow-hidden bg-gray-200 h-4 w-1/4 mb-8">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>

    {/* Button Placeholder: Matches the Shop Now button shape */}
    <div className="relative overflow-hidden bg-gray-200 h-12 w-[160px]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  </div>
);

export const AllCategoriesSkeleton = () => {
  return (
    // Grid settings matching your main AllCategories component
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
        {/* Rendering 6 items as a placeholder for the initial grid */}
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};
