import React from "react";
import {
  LuFilter,
  LuLayoutGrid,
  LuStretchHorizontal,
  LuGrid,
  LuColumns,
  LuRows,
} from "react-icons/lu";

const ProductToolbar = ({ onFilterOpen }) => {
  return (
    <div className="w-full bg-white py-4 border-b border-gray-200 px-4">
      {/* 1. Mobile & Tablet View (Reference: Image 1) */}
      <div className="flex lg:hidden items-center justify-between">
        {/* Filter Trigger */}
        <button
          onClick={onFilterOpen}
          className="flex items-center gap-2 text-gray-700 font-medium"
        >
          <LuFilter className="text-xl" />
          <span className="text-sm">Filter</span>
        </button>

        {/* Layout Switchers (Mobile) */}
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-300 bg-gray-100">
            <div className="w-5 h-4 flex flex-col gap-[2px] justify-center">
              <span className="bg-gray-600 h-[2px] w-full"></span>
              <span className="bg-gray-600 h-[2px] w-full"></span>
              <span className="bg-gray-600 h-[2px] w-full"></span>
            </div>
          </button>
          <button className="p-1 border border-gray-300">
            <div className="w-5 h-4 flex gap-[2px] justify-center">
              <span className="bg-black w-[4px] h-full"></span>
              <span className="bg-black w-[4px] h-full"></span>
            </div>
          </button>
        </div>

        {/* Sort Trigger */}
        <div className="flex items-center gap-1 text-gray-700">
          <span className="text-sm">Sort</span>
          <select className="bg-transparent text-sm outline-none cursor-pointer">
            <option></option>
            <option>Featured</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* 2. Desktop View (Reference: Image 2) */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-bold uppercase tracking-wider text-gray-800">
            View As
          </span>

          {/* Grid Options Icons */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((col) => (
              <button
                key={col}
                className={`p-1 border ${
                  col === 2 ? "border-black" : "border-gray-200"
                } hover:border-black transition-colors`}
              >
                <div
                  className={`flex gap-[2px] h-4 ${
                    col === 1 ? "flex-col" : "flex-row"
                  }`}
                >
                  {Array.from({ length: col }).map((_, i) => (
                    <span
                      key={i}
                      className={`bg-gray-400 ${col === 2 && "bg-black"} ${
                        col === 1 ? "w-5 h-[2px]" : "w-[2px] h-full"
                      }`}
                    ></span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Items Per Page */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold uppercase text-gray-800">
              Items Per Page
            </span>
            <div className="relative border border-gray-300 px-4 py-2 min-w-[80px]">
              <select className="appearance-none bg-transparent w-full outline-none text-sm pr-4">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ⌄
              </span>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold uppercase text-gray-800">
              Sort By
            </span>
            <div className="relative border border-gray-300 px-4 py-2 min-w-[150px]">
              <select className="appearance-none bg-transparent w-full outline-none text-sm pr-4">
                <option>Featured</option>
                <option>Best Selling</option>
                <option>Price: Low to High</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ⌄
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
