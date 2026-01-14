import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const ItemsPerPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(25);
  const dropdownRef = useRef(null);

  const options = [10, 15, 20, 25, 30, 50];

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="hidden md:flex items-center gap-3 relative"
      ref={dropdownRef}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
        Items Per Page
      </span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          // w-48 ফিক্সড রাখা হয়েছে যাতে টেক্সট বড় হলে বক্স না বাড়ে
          className="border border-gray-300 px-4 py-2 w-48 flex justify-between items-center text-sm bg-white hover:border-gray-400 transition-all"
        >
          {/* টেক্সট বক্সের চেয়ে বড় হলে এখানে ডট ডট (...) দেখাবে */}
          <span className="truncate pr-2 text-left">{selected}</span>

          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 w-full bg-white border border-t-0 border-gray-300 z-50 shadow-lg">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                  selected === opt ? "underline font-medium" : ""
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
