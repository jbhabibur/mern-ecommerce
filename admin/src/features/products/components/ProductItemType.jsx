import React from "react";
import { Layers, ChevronDown } from "lucide-react";

export const ProductItemType = ({ formData, handleInputChange }) => {
  const options = [
    { value: "men-top", label: "Men Top", icon: "👕" },
    { value: "men-bottom", label: "Men Bottom", icon: "👖" },
    { value: "outware", label: "Outware", icon: "🧥" },
    { value: "accessories", label: "Accessories", icon: "🕶️" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3">
        <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" /> Classification
        </h2>
      </div>

      <div className="relative group">
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
          Item Type *
        </label>
        <div className="relative">
          <select
            name="itemType" // This must match the state key exactly
            value={formData.itemType || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-100 bg-gray-50/50 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            required
          >
            <option value="" disabled>
              Choose a type...
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
