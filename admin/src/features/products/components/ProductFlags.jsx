import React from "react";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export const ProductFlags = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-4">
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800">Product Flags</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* New Arrival Flag */}
        <label className="relative flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/30 cursor-pointer hover:bg-indigo-50/50 transition-all group">
          <input
            type="checkbox"
            name="isNewArrival"
            // FIX: formData theke value na pele jeno false hoy (controlled input)
            checked={formData.isNewArrival || false}
            onChange={handleInputChange}
            className="peer h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
          />
          <div className="ml-4 flex flex-col">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> New Arrival
            </span>
            <p className="text-xs text-gray-500">
              Enable "NEW" tag on product card
            </p>
          </div>
          {/* Subtle highlight when checked */}
          <div className="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-600/20 rounded-xl pointer-events-none"></div>
        </label>

        {/* Best Seller Flag */}
        <label className="relative flex items-center p-4 rounded-xl border border-gray-100 bg-gray-50/30 cursor-pointer hover:bg-indigo-50/50 transition-all group">
          <input
            type="checkbox"
            name="bestSeller"
            // FIX: formData theke value na pele jeno false hoy (controlled input)
            checked={formData.bestSeller || false}
            onChange={handleInputChange}
            className="peer h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
          />
          <div className="ml-4 flex flex-col">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-green-500" /> Best Seller
            </span>
            <p className="text-xs text-gray-500">
              Enable "HOT" badge for high demand
            </p>
          </div>
          {/* Subtle highlight when checked */}
          <div className="absolute inset-0 border-2 border-transparent peer-checked:border-indigo-600/20 rounded-xl pointer-events-none"></div>
        </label>
      </div>
    </div>
  );
};
