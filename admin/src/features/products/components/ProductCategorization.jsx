import React from "react";
import { useCategories } from "../hooks/useCategories";
import { useTheme } from "../../../contexts/ThemeContext";

export const ProductCategorization = ({ formData, handleInputChange }) => {
  const { categories, isLoading, error } = useCategories();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /**
   * Error State styling
   */
  if (error)
    return (
      <div
        className={`p-4 rounded-lg border ${
          isDark
            ? "bg-red-900/20 border-red-800 text-red-400"
            : "bg-red-50 border-red-100 text-red-500"
        }`}
      >
        Error: {error}
      </div>
    );

  // Dynamic style variables
  const inputClass = `w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 cursor-pointer ${
    isDark
      ? "bg-theme-base border-theme-line/20 text-theme-front"
      : "bg-gray-50/50 border-gray-200 text-gray-800"
  }`;

  const labelClass = `text-sm font-semibold ml-1 ${
    isDark ? "text-theme-front" : "text-gray-700"
  }`;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div
        className={`flex items-center gap-2 border-b pb-3 ${
          isDark ? "border-theme-line/10" : "border-gray-100"
        }`}
      >
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2
          className={`text-xl font-bold ${isDark ? "text-theme-front" : "text-gray-800"}`}
        >
          Product Categorization
        </h2>
        {isLoading && (
          <span className="text-xs text-indigo-500 animate-pulse font-medium ml-auto">
            Fetching categories...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Parent Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Parent Category (Optional)</label>
          <select
            name="parentCategory"
            value={formData.parentCategory || ""}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="" className={isDark ? "bg-theme-base" : ""}>
              None / No Parent
            </option>
            {categories.map((cat) => (
              <option
                key={`parent-${cat._id}`}
                value={cat._id}
                className={isDark ? "bg-theme-base" : ""}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Main Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Category</label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="" className={isDark ? "bg-theme-base" : ""}>
              --- Select Category ---
            </option>
            {categories.map((cat) => (
              <option
                key={`cat-${cat._id}`}
                value={cat._id}
                className={isDark ? "bg-theme-base" : ""}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Subcategory Dropdown */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Subcategory (Optional)</label>
          <select
            name="subcategory"
            value={formData.subcategory || ""}
            onChange={handleInputChange}
            className={inputClass}
          >
            <option value="" className={isDark ? "bg-theme-base" : ""}>
              None / No Subcategory
            </option>
            {categories.map((cat) => (
              <option
                key={`sub-${cat._id}`}
                value={cat._id}
                className={isDark ? "bg-theme-base" : ""}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
