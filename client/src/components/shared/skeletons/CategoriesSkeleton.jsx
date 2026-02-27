import React from "react";

export const CategoriesSkeleton = () => {
  return (
    <div className="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="w-full py-6">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-4 w-4 bg-gray-100 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="hidden md:block md:w-56 lg:w-60 shrink-0">
          <div className="space-y-12 mt-4">
            <div>
              <div className="h-5 bg-gray-300 rounded w-32 mb-4 border-b-[1.5px] border-gray-400 pb-2"></div>
            </div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-36 mb-4 border-b-[1.5px] border-gray-400 pb-2"></div>
              <div className="space-y-4">
                {[1, 0].map((i) => (
                  <div key={i} className="flex items-center gap-2 h-5">
                    <div className="w-[15px] h-[15px] bg-gray-200 border border-gray-300"></div>
                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-5 bg-gray-300 rounded w-20 mb-8 border-b-[1.5px] border-gray-400 pb-3"></div>
              <div className="h-1 bg-gray-200 w-full mb-6 rounded"></div>
              <div className="h-10 bg-gray-900 w-full mt-3"></div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1">
          {/* Title & Description - Matched to image font/spacing */}
          <div className="mb-6">
            <div className="h-9 bg-gray-300 rounded w-48 mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-64 italic"></div>
          </div>

          {/* Toolbar - EXACT MATCH TO IMAGE */}
          <div className="flex items-center justify-between py-3 mb-8 border-b border-gray-100">
            {/* View As Section */}
            <div className="flex items-center gap-3">
              <div className="h-3 bg-gray-200 w-12 hidden lg:block rounded-sm"></div>{" "}
              {/* "VIEW AS" text */}
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 bg-gray-50 border border-gray-200 rounded-sm"
                  ></div>
                ))}
              </div>
            </div>

            {/* Items Per Page & Sort By */}
            <div className="flex items-center gap-6">
              {/* Items per page block */}
              <div className="hidden md:flex items-center gap-3">
                <div className="h-3 bg-gray-200 w-24 rounded-sm"></div>
                <div className="h-10 w-16 bg-white border border-gray-200 rounded-sm"></div>
              </div>

              {/* Sort by block */}
              <div className="flex items-center gap-3">
                <div className="h-3 bg-gray-200 w-16 rounded-sm"></div>
                <div className="h-10 w-32 bg-white border border-gray-200 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="relative min-h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="aspect-[3/4] bg-gray-200 rounded-sm w-full mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                    <div className="h-5 bg-gray-300 rounded w-1/3 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
