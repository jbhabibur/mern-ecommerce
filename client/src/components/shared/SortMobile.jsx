import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export const SortMobile = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const options = [
    "Featured",
    "Best selling",
    "Alphabetically, A-Z",
    "Alphabetically, Z-A",
    "Price, low to high",
    "Price, high to low",
    "Date, old to new",
    "Date, new to old",
  ];

  return (
    <div className="md:hidden">
      {/* Sort Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="flex items-center gap-1 text-xs font-bold uppercase text-gray-500"
      >
        Sort <ChevronDown size={14} />
      </button>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-[100] transition-opacity">
          {/* Drawer Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-bold text-sm uppercase tracking-widest">
                SORT BY:
              </span>
              <button onClick={() => setIsDrawerOpen(false)}>
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="py-2 mb-4">
              {options.map((opt) => (
                <div
                  key={opt}
                  className={`px-5 py-3 text-[15px] text-gray-800 active:bg-gray-100 ${
                    opt === "Featured" ? "font-bold" : ""
                  }`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
