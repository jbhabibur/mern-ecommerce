import React from "react";
import { SectionLayout } from "../../../layout/SectionLayout";

export const NewArrivalsSkeleton = () => {
  return (
    <SectionLayout bgColor="bg-white">
      {/* Header Skeleton - Matches your SectionHeader structure */}
      <div className="mt-10 mb-10 w-full flex flex-col items-center animate-pulse">
        <div className="flex items-center justify-center w-full">
          <div className="flex-grow h-[2px] bg-gray-200"></div>
          <div className="mx-10 md:mx-20 lg:mx-32 h-5 w-40 bg-gray-200 rounded"></div>
          <div className="flex-grow h-[2px] bg-gray-200"></div>
        </div>
        <div className="mt-4 h-4 w-16 bg-gray-100 rounded"></div>
      </div>

      {/* Content Skeleton */}
      <div className="py-2">
        {/* Desktop Grid Skeleton (8 Items) */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              {/* Product Image Box */}
              <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm"></div>
              {/* Product Title line */}
              <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
              {/* Product Price line */}
              <div className="h-4 w-1/4 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet Skeleton (Swiper Preview) */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[45%] md:min-w-[30%] space-y-4">
                <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
          {/* Mobile Pagination/Nav Skeleton */}
          <div className="flex justify-between items-center mt-10 px-3">
            <div className="h-4 w-12 bg-gray-100 rounded"></div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100"></div>
              <div className="w-10 h-10 rounded-full bg-gray-100"></div>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
