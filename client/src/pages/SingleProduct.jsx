import React from "react";
import { useParams } from "react-router-dom";

// Logic: RTK Query Hook
import { useGetProductBySlugQuery } from "../redux/services/productApi";

// Modules: Modularized UI Components
import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ProductImageGallery } from "../components/shared/ProductImageGallery";
import { ProductInfoSection } from "../components/shared/ProductInfoSection";
import { ProductExtraInfo } from "../components/shared/ProductExtraInfo";
import { RelatedProducts } from "../components/shared/RelatedProducts";

export const SingleProduct = () => {
  const { slug } = useParams();

  // Environment Variable for Image Paths
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Data Fetching
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);

  // LOADING & ERROR STATES
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg font-medium">
        Loading product details...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Product not found or server error!
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12">
      <Breadcrumb />

      {/* MAIN PRODUCT SECTION */}
      <div className="flex flex-col md:flex-row gap-16 relative">
        {/* Module 1: Image Gallery & Lightbox */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          baseUrl={BASE_URL}
        />

        {/* Module 2: Pricing, Variations, and Add to Cart */}
        <ProductInfoSection product={product} />
      </div>

      {/* ADDITIONAL INFO SECTION */}
      {/* Module 3: Tabs for Description & Shipping Policy */}
      <ProductExtraInfo product={product} />

      {/* Related Items Section */}
      <RelatedProducts />
    </div>
  );
};
