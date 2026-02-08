import React from "react";
import { useCategories } from "../hooks/useCategories";

export const ProductCategorization = ({ formData, handleInputChange }) => {
  const { categories, isLoading, error } = useCategories();

  if (error)
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-2 border-b pb-3">
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800">
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
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Parent Category (Optional)
          </label>
          <select
            name="parentCategory"
            value={formData.parentCategory || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50"
          >
            {/* Value is empty string to represent null/none */}
            <option value="">None / No Parent</option>
            {categories.map((cat) => (
              <option key={`parent-${cat._id}`} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Main Category Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50"
          >
            <option value="">--- Select Category ---</option>
            {categories.map((cat) => (
              <option key={`cat-${cat._id}`} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Subcategory Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Subcategory (Optional)
          </label>
          <select
            name="subcategory"
            value={formData.subcategory || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50"
          >
            {/* Value is empty string to allow resetting to null */}
            <option value="">None / No Subcategory</option>
            {categories.map((cat) => (
              <option key={`sub-${cat._id}`} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
