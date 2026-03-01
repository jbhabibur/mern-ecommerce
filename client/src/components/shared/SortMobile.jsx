import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom"; // Import createPortal

export const SortMobile = ({ selected, onChange }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleSelect = (val) => {
    onChange(val);
    setIsDrawerOpen(false);
  };

  // --- Scroll Lock for Sort Drawer ---
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const drawerContent = (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 md:hidden ${
        isDrawerOpen ? "visible" : "invisible"
      }`}
    >
      {/* Background Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 touch-none ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transform transition-transform duration-300 ease-in-out z-[10000] ${
          isDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="font-bold text-sm uppercase tracking-widest">
            SORT BY:
          </span>
          <button onClick={() => setIsDrawerOpen(false)}>
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="py-2 mb-4">
          {sortOptions.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2.5 text-[15px] text-gray-800 active:bg-gray-100 ${
                selected === opt.value ? "font-bold bg-gray-50" : ""
              }`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      {/* Sort Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-1 text-xs font-bold uppercase text-gray-500"
      >
        Sort <ChevronDown size={14} />
      </button>

      {/* Render the drawer at the body level */}
      {createPortal(drawerContent, document.body)}
    </div>
  );
};
