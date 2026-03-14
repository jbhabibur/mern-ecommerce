import React from "react";
import { Palette, Layers, Ruler, Plus, Trash2, Package } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

export const ProductSpecifications = ({ formData, setFormData }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        // FIX: Keep empty string empty, otherwise convert to Number
        // This allows deleting the '0' in the input box
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

  // Shared dynamic classes
  const inputBaseClass = `w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
    isDark
      ? "bg-theme-base border-theme-line/20 text-theme-front placeholder:text-theme-muted/40"
      : "bg-white border-gray-200 text-gray-800"
  }`;

  const labelClass = `text-sm font-semibold flex items-center gap-2 ${
    isDark ? "text-theme-muted" : "text-gray-600"
  }`;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div
        className={`flex items-center gap-2 border-b pb-4 ${isDark ? "border-theme-line/10" : "border-gray-100"}`}
      >
        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
        <h2
          className={`text-xl font-bold ${isDark ? "text-theme-front" : "text-gray-800"}`}
        >
          Product Specifications
        </h2>
      </div>

      {/* Row 1: Color & Fabric */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            <Palette className="w-4 h-4 text-indigo-500" /> Color
          </label>
          <input
            name="color"
            value={formData.color || ""}
            onChange={handleInputChange}
            placeholder="e.g. Charcoal Black"
            className={inputBaseClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            <Layers className="w-4 h-4 text-indigo-500" /> Fabric / Material
          </label>
          <input
            name="fabric"
            value={formData.fabric || ""}
            onChange={handleInputChange}
            placeholder="e.g. 100% Pima Cotton"
            className={inputBaseClass}
          />
        </div>
      </div>

      {/* Section 2: Variants (Sizing & Inventory) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className={labelClass}>
            <Ruler className="w-4 h-4 text-indigo-500" /> Sizing & Inventory
          </label>
          <button
            type="button"
            onClick={addVariant}
            className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg font-bold transition-all active:scale-95 ${
              isDark
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            <Plus className="w-4 h-4" /> Add Size
          </button>
        </div>

        {/* Variants List */}
        <div className="space-y-3">
          {formData.variants?.map((variant, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 ${
                isDark
                  ? "bg-theme-base/40 border-theme-line/10"
                  : "bg-gray-50/50 border-gray-100"
              }`}
            >
              <div className="flex-1 relative">
                <input
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                  placeholder="Size (e.g. XL, 42)"
                  className={inputBaseClass}
                />
              </div>

              <div className="w-32 relative">
                <div className="absolute left-3 top-3.5">
                  <Package
                    className={`w-4 h-4 ${isDark ? "text-theme-muted/50" : "text-gray-400"}`}
                  />
                </div>
                <input
                  type="number"
                  // FIX: fallback to "" allows clearing the 0
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  placeholder="Stock"
                  min="0"
                  className={`${inputBaseClass} pl-9`}
                />
              </div>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={formData.variants.length === 1}
                className={`p-3 rounded-xl transition-all disabled:opacity-20 ${
                  isDark
                    ? "text-theme-muted hover:text-red-400 hover:bg-red-400/10"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {formData.variants?.length === 0 && (
          <p
            className={`text-center text-sm py-4 ${isDark ? "text-theme-muted" : "text-gray-400"}`}
          >
            No variants added. Click "Add Size" to begin.
          </p>
        )}
      </div>
    </section>
  );
};
