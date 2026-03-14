import React, { useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { Loader2, X, Edit2, Save } from "lucide-react";

// Imported hooks
import { useProductForm } from "../hooks/useProductForm";

// Imported components
import { GeneralInfo } from "../components/GeneralInfo";
import { ImageUpload } from "../components/ImageUpload";
import { ProductSpecifications } from "../components/ProductSpecifications";
import { ProductFlags } from "../components/ProductFlags";
import { ProductCategorization } from "../components/ProductCategorization";
import { ProductItemType } from "../components/ProductItemType";
import { ProductAnalytics } from "../components/ProductAnalytics";

export const ProductEditModal = ({ product, onClose, onSave }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /**
   * Initialize the hook with the existing product data.
   * We destructure the necessary methods and state.
   */
  const {
    formData,
    setFormData,
    loading,
    handleInputChange,
    handleVariantChange,
    handleSubmit,
  } = useProductForm(product);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /**
   * Form submission wrapper.
   * It calls the hook's handleSubmit and then triggers the onSave/onClose logic.
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Logic inside handleSubmit usually performs the API call/validation
    const success = await handleSubmit(onSave);
    if (success) {
      onClose();
    }
  };

  const textColor = "text-theme-front";
  const mutedColor = "text-theme-muted";
  const cardBg = "bg-theme-sub";
  const cardShadow = isDark
    ? "shadow-lg shadow-black/10"
    : "shadow-md shadow-gray-200/40";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-theme-base shadow-2xl transition-all duration-300 border border-theme-line/10 animate-in zoom-in-95 duration-300`}
      >
        <div className="sticky top-0 z-50 flex items-center justify-between p-6 bg-theme-base/80 backdrop-blur-md border-b border-theme-line/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-theme-act/10 rounded-lg">
              <Edit2 className="text-theme-act" size={24} />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${textColor}`}>
                Edit Product
              </h1>
              <p className={`text-xs mt-0.5 ${mutedColor}`}>
                Modify existing product details and specifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl hover:bg-theme-line/10 transition-colors ${textColor} cursor-pointer`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 sm:p-10">
          <form onSubmit={handleUpdate} className="space-y-8">
            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <GeneralInfo
                formData={formData}
                handleInputChange={handleInputChange}
                setFormData={setFormData}
              />
            </div>

            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ProductCategorization
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
              />
            </div>

            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ImageUpload formData={formData} setFormData={setFormData} />
            </div>

            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ProductSpecifications
                formData={formData}
                setFormData={setFormData}
                handleVariantChange={handleVariantChange} // Using hook's optimized variant handler
              />
            </div>

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

            <div
              className={`${cardBg} ${cardShadow} rounded-2xl p-6 border border-theme-line/20`}
            >
              <ProductAnalytics formData={formData} setFormData={setFormData} />
            </div>

            <div className="pt-4 pb-2 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-bold border border-theme-line text-theme-front hover:bg-theme-sub transition-all"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3
                  ${isDark ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"} 
                  disabled:bg-gray-400 cursor-pointer`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="text-lg">Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span className="text-lg">Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
