import React from "react";
import { Palette, Layers, Ruler, Plus, Trash2, Package } from "lucide-react";

export const ProductSpecifications = ({ formData, setFormData }) => {
  // Handle simple string inputs (Color, Fabric)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];

      updatedVariants[index] = {
        ...updatedVariants[index],
        // FIX: Empty string hole empty rakhen, noile Number-e convert korun
        // Eita korle input box theke 0 delete kora jabe
        [field]:
          field === "stock" ? (value === "" ? "" : Number(value)) : value,
      };

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  // Add a new empty variant row
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", stock: 0 }],
    }));
  };

  // Remove a variant row (prevents removing the last one)
  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        variants: updatedVariants,
      }));
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-4">
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-800">
          Product Specifications
        </h2>
      </div>

      {/* Row 1: Color & Fabric */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-500" /> Color
          </label>
          <input
            name="color"
            value={formData.color || ""}
            onChange={handleInputChange}
            placeholder="e.g. Charcoal Black"
            className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" /> Fabric / Material
          </label>
          <input
            name="fabric"
            value={formData.fabric || ""}
            onChange={handleInputChange}
            placeholder="e.g. 100% Pima Cotton"
            className="border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Section 2: Variants (Sizing & Inventory) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-indigo-500" /> Sizing & Inventory
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Size
          </button>
        </div>

        {/* Variants List */}
        <div className="space-y-3">
          {formData.variants?.map((variant, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex-1 relative">
                <input
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                  placeholder="Size (e.g. XL, 42, 10m)"
                  className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="w-32 relative">
                <div className="absolute left-3 top-3.5">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  // FIX: ekhane fallback "" deya holo jeno 0 delete korle blank hoye jay
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  min="0"
                  className="w-full bg-white border border-gray-200 p-3 pl-9 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={formData.variants.length === 1}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-20"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {formData.variants?.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">
            No variants added. Click "Add Size" to begin.
          </p>
        )}
      </div>
    </div>
  );
};
