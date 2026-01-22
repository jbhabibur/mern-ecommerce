import React, { useState, useEffect, useRef } from "react";

export const DualRangeSlider = ({
  value,
  onChange,
  minLimit = 0,
  maxLimit,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef(null);

  // Sync with external value changes (e.g., URL resets)
  useEffect(() => {
    setLocalValue(value);
  }, [JSON.stringify(value)]);

  const minPrice = localValue[0];
  const maxPrice = localValue[1];

  const range = maxLimit - minLimit;
  const minPos = range > 0 ? ((minPrice - minLimit) / range) * 100 : 0;
  const maxPos = range > 0 ? ((maxPrice - minLimit) / range) * 100 : 100;

  // Debounced callback to parent
  const triggerChange = (newRange) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newRange);
    }, 1000); // 1 second delay
  };

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxPrice - 1);
    const newRange = [val, maxPrice];
    setLocalValue(newRange); // Immediate UI update
    triggerChange(newRange); // Delayed API/URL update
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minPrice + 1);
    const finalVal = val > maxLimit ? maxLimit : val;
    const newRange = [minPrice, finalVal];
    setLocalValue(newRange); // Immediate UI update
    triggerChange(newRange); // Delayed API/URL update
  };

  return (
    <div className="w-full relative py-4">
      <div className="relative h-2 flex items-center mb-8">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-black rounded-full"
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        />

        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={minPrice}
          onChange={handleMinChange}
          className="absolute w-full appearance-none pointer-events-none bg-transparent z-20 h-2 thumb-style"
        />
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={maxPrice}
          onChange={handleMaxChange}
          className="absolute w-full appearance-none pointer-events-none bg-transparent z-30 h-2 thumb-style"
        />
      </div>

      {/* Manual Input Boxes */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center border border-gray-300 px-2 h-10 bg-white">
          <span className="text-gray-500 mr-1">৳</span>
          <input
            type="number"
            value={minPrice}
            onChange={handleMinChange}
            className="w-full outline-none text-sm text-right"
          />
        </div>
        <span className="text-xs font-bold text-gray-400">TO</span>
        <div className="flex-1 flex items-center border border-gray-300 px-2 h-10 bg-white">
          <span className="text-gray-500 mr-1">৳</span>
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxChange}
            className="w-full outline-none text-sm text-right"
          />
        </div>
      </div>

      <style jsx>{`
        .thumb-style::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid black;
          cursor: pointer;
        }
        .thumb-style::-moz-range-thumb {
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
