import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const SortDesktop = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mapping display labels to technical URL keys used in useCategory hook
  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Best selling", value: "best-selling" },
    { label: "Alphabetically, A-Z", value: "alphabetical-az" },
    { label: "Alphabetically, Z-A", value: "alphabetical-za" },
    { label: "Price, low to high", value: "price-low" },
    { label: "Price, high to low", value: "price-high" },
    { label: "Date, old to new", value: "date-old" },
    { label: "Date, new to old", value: "date-new" },
  ];

  // Find current label based on value prop from URL
  const currentLabel =
    sortOptions.find((opt) => opt.value === selected)?.label || "Featured";

  // Close dropdown when clicking outside
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
      className="hidden md:flex items-center gap-6 relative"
      ref={dropdownRef}
    >
      {/* Label: SORT BY */}
      <span className="text-[13px]! font-bold! uppercase tracking-wider text-[#1a1a1a]">
        Sort By
      </span>

      <div className="relative">
        {/* Main Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            border border-gray-300 p-3! w-40 flex justify-between items-center bg-white 
            transition-all duration-200 
            ${isOpen ? "border-gray-400" : "hover:border-gray-400 focus:outline-none"}
          `}
        >
          <span className="text-[14px] text-gray-800 truncate pr-4">
            {currentLabel}
          </span>

          <ChevronDown
            size={16}
            className={`text-gray-500 shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu (Style like First Image) */}
        {isOpen && (
          <div className="absolute top-full right-0 w-[calc(100%+100px)] bg-white border border-gray-100 z-[100] shadow-[0_10px_25px_rgba(0,0,0,0.1)] py-2 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {sortOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`
                  px-3 py-2 text-[15px] cursor-pointer transition-colors duration-200 
                  hover:bg-gray-50
                  ${
                    selected === opt.value
                      ? "underline underline-offset-[6px] decoration-1 font-medium text-black"
                      : "text-gray-600 hover:text-black"
                  }
                `}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
