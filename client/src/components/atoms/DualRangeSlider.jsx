import React, { useState } from "react";

export const DualRangeSlider = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2990);
  const minLimit = 0;
  const maxLimit = 10000;

  // স্লাইডারের কালো অংশটুকুর পজিশন ক্যালকুলেশন
  const minPos = (minPrice / maxLimit) * 100;
  const maxPos = (maxPrice / maxLimit) * 100;

  return (
    <div className="w-full max-w-[350px] bg-white ">
      {/* Slider Container */}
      <div className="relative h-10 flex items-center mb-4">
        {/* Background Track (Light Grey) */}
        <div className="absolute w-full h-[5px] bg-[#e5e7eb] rounded-full"></div>

        {/* Active Track (Black) */}
        <div
          className="absolute h-[5px] bg-[#1a1a1a] rounded-full"
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        ></div>

        {/* Min Range Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minPrice}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxPrice - 500);
            setMinPrice(value);
          }}
          className="absolute w-full pointer-events-none appearance-none bg-transparent z-30 
          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white 
          [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-[#222] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxPrice}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minPrice + 500);
            setMaxPrice(value);
          }}
          className="absolute w-full pointer-events-none appearance-none bg-transparent z-30 
          [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white 
          [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-[#222] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
        />
      </div>

      {/* Input Boxes Section */}
      <div className="flex items-center justify-between gap-3">
        {/* Min Input Box */}
        <div className="flex flex-1 items-center border border-gray-300 px-3 py-2 h-12">
          <span className="text-lg text-gray-700">৳</span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full text-right outline-none bg-transparent text-gray-700 font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <span className="text-gray-500 text-sm lowercase">to</span>

        {/* Max Input Box */}
        <div className="flex flex-1 items-center border border-gray-300 px-3 py-2 h-12">
          <span className="text-lg text-gray-700">৳</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full text-right outline-none bg-transparent text-gray-700 font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};
