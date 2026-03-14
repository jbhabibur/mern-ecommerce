import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { slugify } from "../utils/slugify";

export const GeneralInfo = ({ formData, handleInputChange, setFormData }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /**
   * Syncs the 'name' field with 'slug' automatically.
   * This ensures that as the user types a product name,
   * a URL-friendly slug is generated in real-time.
   */
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      slug: slugify(value), // Auto-generate slug from name
    }));
  };

  /**
   * Manual override for the slug.
   * In case the user wants a custom URL different from the auto-generated one.
   */
  const handleSlugManualChange = (e) => {
    const manualValue = e.target.value.toLowerCase().replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      slug: manualValue,
    }));
  };

  // Dynamic classes based on theme
  const inputClass = `w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 ${
    isDark
      ? "bg-theme-base border-theme-line/20 text-theme-front placeholder:text-theme-muted/40"
      : "bg-gray-50/50 border-gray-200 text-gray-800 placeholder:text-gray-400"
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
          className={`text-xl font-bold ${
            isDark ? "text-theme-front" : "text-gray-800"
          }`}
        >
          Basic Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name Input */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Ex: Premium Silk Panjabi"
            className={inputClass}
            required
          />
        </div>

        {/* URL Slug Input */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            URL Slug <span className="text-red-400">*</span>
          </label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleSlugManualChange}
            placeholder="product-url-slug"
            className={`${inputClass} font-mono text-sm ${
              isDark ? "text-indigo-400" : "text-indigo-600"
            }`}
            required
          />
        </div>

        {/* Pricing: Selling Price */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            Price (BDT) <span className="text-red-400">*</span>
          </label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            className={`${inputClass} font-bold ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
            required
          />
        </div>

        {/* Pricing: Comparison Price */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Compare at Price</label>
          <input
            name="compare_at_price"
            type="number"
            value={formData.compare_at_price}
            onChange={handleInputChange}
            placeholder="Original Price"
            className={inputClass}
          />
        </div>
      </div>

      {/* Full Width Description Field */}
      <div className="flex flex-col gap-2 pt-2">
        <label className={labelClass}>Product Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter detailed product description..."
          rows="5"
          className={inputClass}
        ></textarea>
      </div>
    </section>
  );
};
