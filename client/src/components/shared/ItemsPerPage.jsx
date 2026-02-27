import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * ItemsPerPage Component
 * Now connected to URL state via props
 */
export const ItemsPerPage = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Pagination options
  const options = [10, 15, 20, 25, 30];

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
      className="hidden md:flex items-center gap-3 relative"
      ref={dropdownRef}
    >
      <span className="text-[13px] font-bold uppercase tracking-wider text-gray-700">
        Items Per Page
      </span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          // Set to a smaller width (w-24) to look better for numbers
          className="border border-gray-300 w-24 p-3! flex justify-between items-center text-sm bg-white hover:border-gray-400 transition-all"
        >
          <span className="truncate pr-2 text-left">{selected}</span>

          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 w-full bg-white border border-t-0 border-gray-300 z-50 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt); // Triggers updateFilters in useCategory hook
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                  selected === opt ? "underline font-medium bg-gray-50" : ""
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
