import React from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export const ProductFlags = ({ formData, handleInputChange }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Shared classes for the checkbox card
  const labelBaseClass = `relative flex items-center p-4 rounded-xl border cursor-pointer transition-all group ${
    isDark
      ? "bg-theme-base/40 border-theme-line/10 hover:bg-theme-line/5"
      : "bg-gray-50/30 border-gray-100 hover:bg-indigo-50/50"
  }`;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div
        className={`flex items-center gap-2 border-b pb-4 ${isDark ? "border-theme-line/10" : "border-gray-100"}`}
      >
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2
          className={`text-xl font-bold ${isDark ? "text-theme-front" : "text-gray-800"}`}
        >
          Product Flags
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* New Arrival Flag */}
        <label className={labelBaseClass}>
          <input
            type="checkbox"
            name="isNewArrival"
            // FIX: Ensure it's a controlled input with a fallback
            checked={formData.isNewArrival || false}
            onChange={handleInputChange}
            className={`peer h-5 w-5 rounded transition-all cursor-pointer ${
              isDark
                ? "bg-theme-base border-theme-line/30 text-indigo-500 focus:ring-indigo-500/50"
                : "border-gray-300 text-indigo-600 focus:ring-indigo-500"
            }`}
          />
          <div className="ml-4 flex flex-col">
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-theme-front" : "text-gray-800"}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> New Arrival
            </span>
            <p
              className={`text-xs ${isDark ? "text-theme-muted" : "text-gray-500"}`}
            >
              Enable "NEW" tag on product card
            </p>
          </div>
          {/* Highlight when checked */}
          <div
            className={`absolute inset-0 border-2 border-transparent peer-checked:border-indigo-600/30 rounded-xl pointer-events-none ${
              isDark
                ? "peer-checked:bg-indigo-500/5"
                : "peer-checked:bg-indigo-50/20"
            }`}
          ></div>
        </label>

        {/* Best Seller Flag */}
        <label className={labelBaseClass}>
          <input
            type="checkbox"
            name="bestSeller"
            // FIX: Ensure it's a controlled input with a fallback
            checked={formData.bestSeller || false}
            onChange={handleInputChange}
            className={`peer h-5 w-5 rounded transition-all cursor-pointer ${
              isDark
                ? "bg-theme-base border-theme-line/30 text-indigo-500 focus:ring-indigo-500/50"
                : "border-gray-300 text-indigo-600 focus:ring-indigo-500"
            }`}
          />
          <div className="ml-4 flex flex-col">
            <span
              className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-theme-front" : "text-gray-800"}`}
            >
              <TrendingUp className="w-4 h-4 text-green-500" /> Best Seller
            </span>
            <p
              className={`text-xs ${isDark ? "text-theme-muted" : "text-gray-500"}`}
            >
              Enable "HOT" badge for high demand
            </p>
          </div>
          {/* Highlight when checked */}
          <div
            className={`absolute inset-0 border-2 border-transparent peer-checked:border-indigo-600/30 rounded-xl pointer-events-none ${
              isDark
                ? "peer-checked:bg-indigo-500/5"
                : "peer-checked:bg-indigo-50/20"
            }`}
          ></div>
        </label>
      </div>
    </section>
  );
};
