import React, { useEffect } from "react";
import { useProductForm } from "./hooks/useProductForm";
import { useTheme } from "../../contexts/ThemeContext";
import { Rocket, Loader2, X } from "lucide-react";

// Components
import { GeneralInfo } from "./components/GeneralInfo";
import { ImageUpload } from "./components/ImageUpload";
import { ProductSpecifications } from "./components/ProductSpecifications";
import { ProductFlags } from "./components/ProductFlags";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { ProductCategorization } from "./components/ProductCategorization";
import { ProductItemType } from "./components/ProductItemType";

export const ProductAddModal = ({ isOpen, onClose }) => {
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

  // 1. Handle Escape Key to close
  // 2. Prevent body scroll when modal is open
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Design logic
  const textColor = "text-theme-front";
  const mutedColor = "text-theme-muted";
  const cardBg = "bg-theme-sub";
  const cardShadow = isDark
    ? "shadow-lg shadow-black/10"
    : "shadow-md shadow-gray-200/40";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-theme-base shadow-2xl transition-all duration-300 border border-theme-line/10 animate-in zoom-in-95 duration-300`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 flex items-center justify-between p-6 bg-theme-base/80 backdrop-blur-md border-b border-theme-line/10">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${textColor}`}>
              Add New Product
            </h1>
            <p className={`text-xs mt-0.5 ${mutedColor}`}>
              Create a new entry in your inventory.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl hover:bg-theme-line/10 transition-colors ${textColor} cursor-pointer`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. General Info */}
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <GeneralInfo
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
              />
            </div>

            {/* 2. Categorization */}
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ProductCategorization
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
              />
            </div>

            {/* 3. Image Upload */}
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ImageUpload formData={formData} setFormData={setFormData} />
            </div>

            {/* 4. Specifications */}
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
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
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
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

            {/* 6. Analytics */}
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ProductAnalytics formData={formData} setFormData={setFormData} />
            </div>

            {/* Footer Action Bar */}
            <div className="pt-4 pb-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3
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
    </div>
  );
};
