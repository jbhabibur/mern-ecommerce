import React from "react";
import { SectionLayout } from "../../../layout/SectionLayout";

export const FeaturedProductsSkeleton = () => {
  return (
    <SectionLayout bgColor="bg-white">
      {/* Header Skeleton */}
      <div className="mt-10 mb-10 w-full flex flex-col items-center animate-pulse">
        <div className="flex items-center justify-center w-full">
          <div className="flex-grow h-[2px] bg-gray-200"></div>
          <div className="mx-10 md:mx-20 lg:mx-32 h-5 w-48 bg-gray-200 rounded"></div>
          <div className="flex-grow h-[2px] bg-gray-200"></div>
        </div>
        <div className="mt-4 h-4 w-16 bg-gray-100 rounded"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8 py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-4 animate-pulse">
            {/* Image placeholder */}
            <div className="aspect-[3/4] w-full bg-gray-100 rounded-sm" />
            {/* Text lines placeholders */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
              <div className="h-4 w-1/2 bg-gray-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
};
