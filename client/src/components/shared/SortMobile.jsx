import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export const SortMobile = ({ selected, onChange }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Desktop-er moto same value mapping
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

  // Current selected option er label khuje ber kora
  const currentLabel =
    sortOptions.find((opt) => opt.value === selected)?.label || "Featured";

  const handleSelect = (val) => {
    onChange(val); // Desktop-er moto backend-e value pathabe
    setIsDrawerOpen(false); // Drawer bondho hobe
  };

  return (
    <div className="md:hidden">
      {/* Sort Toggle Button - UI ager motoi */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-1 text-xs font-bold uppercase text-gray-500"
      >
        Sort <ChevronDown size={14} />
      </button>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        >
          {/* Drawer Content - UI ager motoi */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
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
                  className={`px-5 py-3 text-[15px] text-gray-800 active:bg-gray-100 ${
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
      )}
    </div>
  );
};
