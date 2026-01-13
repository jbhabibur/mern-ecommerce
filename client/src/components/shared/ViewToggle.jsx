import React from "react";
import { Menu, Tally2, Tally3, Tally4 } from "lucide-react";

const viewOptions = [
  { id: "list", icon: <Menu size={18} />, mobile: true },
  { id: "grid2", icon: <Tally2 size={18} />, mobile: true },
  { id: "grid3", icon: <Tally3 size={18} />, mobile: false },
  { id: "grid4", icon: <Tally4 size={18} />, mobile: false },
];

export const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <span className="hidden sm:inline text-[10px] uppercase font-bold text-gray-400">
        View As
      </span>
      <div className="flex gap-1.5">
        {viewOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onViewChange(option.id)}
            className={`p-1.5 border transition ${
              !option.mobile ? "hidden md:flex" : "flex"
            } ${
              currentView === option.id
                ? "bg-black text-white border-black"
                : "hover:bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
