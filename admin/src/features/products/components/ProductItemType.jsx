import React from "react";
import { Layers, ChevronDown } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export const ProductItemType = ({ formData, handleInputChange }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const options = [
    { value: "men-top", label: "Men Top", icon: "👕" },
    { value: "men-bottom", label: "Men Bottom", icon: "👖" },
    { value: "outware", label: "Outware", icon: "🧥" },
    { value: "accessories", label: "Accessories", icon: "🕶️" },
    { value: "others", label: "Others", icon: "📦" },
  ];

  return (
    <section className="space-y-4">
      {/* Header */}
      <div
        className={`flex items-center gap-2 border-b pb-3 ${isDark ? "border-theme-line/10" : "border-gray-100"}`}
      >
        <div className="w-1.5 h-5 bg-indigo-600 rounded-full"></div>
        <h2
          className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-theme-front" : "text-gray-800"}`}
        >
          <Layers className="w-5 h-5 text-indigo-600" /> Classification
        </h2>
      </div>

      <div className="relative group">
        <label
          className={`text-xs font-bold uppercase mb-2 block ${isDark ? "text-theme-muted" : "text-gray-500"}`}
        >
          Item Type *
        </label>

        <div className="relative">
          <select
            name="itemType"
            value={formData.itemType || ""}
            onChange={handleInputChange}
            className={`w-full p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-all border ${
              isDark
                ? "bg-theme-base border-theme-line/20 text-theme-front shadow-sm"
                : "bg-gray-50/50 border-gray-100 text-gray-800"
            }`}
            required
          >
            <option
              value=""
              disabled
              className={isDark ? "bg-theme-base text-theme-muted" : ""}
            >
              Choose a type...
            </option>
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className={isDark ? "bg-theme-base text-theme-front" : ""}
              >
                {opt.icon} {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Arrow Icon */}
          <div
            className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              isDark ? "text-theme-muted" : "text-gray-400"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </section>
  );
};
