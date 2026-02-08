import React from "react";
import { useCategories } from "../hooks/useCategories";

export const ParentCategorySelector = ({ value, onChange }) => {
  const { categories, isLoading, error } = useCategories();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        Category (Optional) <span className="text-red-400">*</span>
      </label>
      <select
        className="border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-gray-100"
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value === "" ? null : e.target.value;
          onChange(val);
        }}
        disabled={isLoading}
      >
        <option value="">
          {isLoading ? "⌛ Loading..." : "--- No Parent (Root Category) ---"}
        </option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
