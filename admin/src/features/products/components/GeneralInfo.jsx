import React from "react";
import { slugify } from "../utils/slugify";

export const GeneralInfo = ({ formData, handleInputChange, setFormData }) => {
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

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 border-b pb-3">
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Ex: Premium Silk Panjabi"
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50"
            required
          />
        </div>

        {/* URL Slug Input (Read-only styled but editable if needed) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            URL Slug <span className="text-red-400">*</span>
          </label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleSlugManualChange}
            placeholder="product-url-slug"
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-100 text-gray-500 font-mono text-sm"
            required
          />
        </div>

        {/* Pricing: Selling Price */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Price (BDT) <span className="text-red-400">*</span>
          </label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.00"
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 font-bold text-indigo-700"
            required
          />
        </div>

        {/* Pricing: Comparison Price (MSRP/Original Price) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">
            Compare at Price
          </label>
          <input
            name="compare_at_price"
            type="number"
            value={formData.compare_at_price}
            onChange={handleInputChange}
            placeholder="Original Price (before discount)"
            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-gray-300 outline-none bg-gray-50/50 text-gray-400"
          />
        </div>
      </div>

      {/* Full Width Description Field */}
      <div className="flex flex-col gap-2 pt-2">
        <label className="text-sm font-semibold text-gray-700 ml-1">
          Product Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter detailed product description, materials, and care instructions..."
          rows="5"
          className="w-full border border-gray-200 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50"
        ></textarea>
      </div>
    </section>
  );
};
