import React from "react";
import { useProductForm } from "./hooks/useProductForm";
import { GeneralInfo } from "./components/GeneralInfo";
import { ImageUpload } from "./components/ImageUpload";
import { ProductSpecifications } from "./components/ProductSpecifications";
import { ProductFlags } from "./components/ProductFlags";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { ProductCategorization } from "./components/ProductCategorization";
import { ProductItemType } from "./components/ProductItemType";

export const AddProduct = () => {
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

  console.log(formData);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50/50 min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-8">
        <GeneralInfo
          formData={formData}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
        />

        <ProductCategorization
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />

        {/* <ImageUpload formData={formData} setFormData={setFormData} /> */}

        {/* Pass extra handlers for variants */}
        {/* <ProductSpecifications
          formData={formData}
          handleVariantChange={handleVariantChange} // Eita thik ache
          addVariant={addVariant}
          removeVariant={removeVariant}
          setFormData={setFormData}
        /> */}

        {/* <ProductFlags
          formData={formData}
          handleInputChange={handleInputChange}
        /> */}

        {/* <ProductAnalytics formData={formData} setFormData={setFormData} /> */}

        {/* <ProductItemType
          formData={formData}
          handleInputChange={handleInputChange}
        /> */}

        <div className="sticky bottom-6 pt-4 z-40">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl disabled:bg-gray-400"
          >
            {loading ? "Syncing..." : "🚀 Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
