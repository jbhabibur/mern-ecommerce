import React from "react";
import { useProductForm } from "./hooks/useProductForm";
import { useTheme } from "../../contexts/ThemeContext";
import { Rocket, Loader2 } from "lucide-react";

// Components
import { GeneralInfo } from "./components/GeneralInfo";
import { ImageUpload } from "./components/ImageUpload";
import { ProductSpecifications } from "./components/ProductSpecifications";
import { ProductFlags } from "./components/ProductFlags";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { ProductCategorization } from "./components/ProductCategorization";
import { ProductItemType } from "./components/ProductItemType";

export const AddProduct = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    formData,
    setFormData,
    loading,
    handleInputChange,
    handleVariantChange,
    addVariant,
    removeVariant,
    handleSubmit,
  } = useProductForm();

  // Dashboard consistent spacing & design logic (image_88bb2f.png)
  const textColor = "text-theme-front";
  const mutedColor = "text-theme-muted";
  const cardBg = "bg-theme-sub";
  const cardShadow = isDark
    ? "shadow-lg shadow-black/10"
    : "shadow-md shadow-gray-200/40";

  return (
    // Dashboard header padding (image_88bb2f.png) er moto kore
    <div
      className={`p-4 sm:p-6 lg:p-10 bg-theme-base min-h-screen transition-all duration-300`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textColor}`}>
            Add New Product
          </h1>
          <p className={`text-sm mt-1 ${mutedColor}`}>
            Fill in the information below to create a new product in inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. General Info Section - Dashboard Card Style */}
          <div
            className={`${cardBg} ${cardShadow} rounded-2xl p-6 sm:p-8 border border-theme-line/20`}
          >
            <GeneralInfo
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          </div>

          {/* 2. Categorization Section - image_88bed1.png Style */}
          <div
            className={`${cardBg} ${cardShadow} rounded-2xl p-6 sm:p-8 border border-theme-line/20`}
          >
            <ProductCategorization
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
            />
          </div>

          {/* 3. Image Upload */}
          <div
            className={`${cardBg} ${cardShadow} rounded-2xl p-6 sm:p-8 border border-theme-line/20`}
          >
            <ImageUpload formData={formData} setFormData={setFormData} />
          </div>

          {/* 4. Specifications & Variants */}
          <div
            className={`${cardBg} ${cardShadow} rounded-2xl p-6 sm:p-8 border border-theme-line/20`}
          >
            <ProductSpecifications
              formData={formData}
              handleVariantChange={handleVariantChange}
              addVariant={addVariant}
              removeVariant={removeVariant}
              setFormData={setFormData}
            />
          </div>

          {/* 5. Flags & Classification */}
          <div
            className={`${cardBg} ${cardShadow} rounded-2xl p-6 sm:p-8 border border-theme-line/20`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProductFlags
                formData={formData}
                handleInputChange={handleInputChange}
              />
              <ProductItemType
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* 6. Analytics Section */}
          <div
            className={`${cardBg} ${cardShadow} rounded-2xl p-6 sm:p-8 border border-theme-line/20`}
          >
            <ProductAnalytics formData={formData} setFormData={setFormData} />
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-6 pt-4 z-40">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4.5 rounded-2xl font-bold shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3
                ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                } disabled:bg-gray-400 cursor-pointer`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-lg">Publishing...</span>
                </>
              ) : (
                <span className="text-lg">🚀 Publish Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
