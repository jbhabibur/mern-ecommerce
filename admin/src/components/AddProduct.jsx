import React, { useState, useEffect } from "react";
import { Plus, Trash2, Package, Image as ImageIcon, Tag } from "lucide-react";
import axios from "axios";

/**
 * AddProduct Component
 * Provides a comprehensive form to create new products based on the defined Mongoose schema.
 */
const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compare_at_price: "",
    category: "",
    itemType: "men-top",
    color: "",
    fabric: "",
    images: [""],
    variants: [{ size: "", stock: 0 }],
    isNewArrival: false,
    bestSeller: false,
  });

  const [categories, setCategories] = useState([]); // To be fetched from your API

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Variant Management ---
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", stock: 0 }],
    }));
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const removeVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  // --- Image URL Management ---
  const addImageField = () =>
    setFormData({ ...formData, images: [...formData.images, ""] });

  const updateImage = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to your backend
      console.log("Submitting Product Data:", formData);
      // await axios.post("/api/products", formData);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Create New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Premium Silk Panjabi"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Slug (URL) *
            </label>
            <input
              type="text"
              name="slug"
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="premium-silk-panjabi"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Price (BDT) *
            </label>
            <input
              type="number"
              name="price"
              required
              className="w-full p-2.5 border rounded-lg outline-none"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Compare at Price
            </label>
            <input
              type="number"
              name="compare_at_price"
              className="w-full p-2.5 border rounded-lg outline-none"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Item Type
            </label>
            <select
              name="itemType"
              className="w-full p-2.5 border rounded-lg outline-none bg-white"
              onChange={handleChange}
            >
              <option value="men-top">Men Top</option>
              <option value="men-bottom">Men Bottom</option>
              <option value="outware">Outware</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows="4"
            className="w-full p-2.5 border rounded-lg outline-none"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Variants Section */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
              <Tag size={16} /> Variants (Size & Stock)
            </label>
            <button
              type="button"
              onClick={addVariant}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>
          {formData.variants.map((v, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Size (e.g. XL)"
                className="flex-1 p-2 border rounded"
                onChange={(e) => updateVariant(index, "size", e.target.value)}
              />
              <input
                type="number"
                placeholder="Stock"
                className="w-24 p-2 border rounded"
                onChange={(e) => updateVariant(index, "stock", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
            <ImageIcon size={16} /> Product Images (URLs)
          </label>
          {formData.images.map((img, index) => (
            <input
              key={index}
              type="text"
              placeholder="Paste Image URL here"
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => updateImage(index, e.target.value)}
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            + Add more image fields
          </button>
        </div>

        {/* Marketing Flags */}
        <div className="flex gap-8 border-t pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNewArrival"
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as New Arrival
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="bestSeller"
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as Best Seller
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
          Publish Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
