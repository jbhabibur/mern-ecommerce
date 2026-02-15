import React from "react";
import { useParams } from "react-router-dom";

import { useProduct } from "../hooks/useProduct";

// Modules: Modularized UI Components
import { SectionLayout } from "../layout/SectionLayout";
import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { ProductDetailsView } from "../features/product-details/components/ProductDetailsView";

import { RelatedProducts } from "../components/shared/RelatedProducts";

export const ProductOverview = () => {
  const { slug } = useParams();

  // Data Fetching
  const { data: product, isLoading, isError } = useProduct(slug);
  console.log("Fetched Product:", product); // Debug log to verify fetched data

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
    <SectionLayout>
      <div className="max-w-7xl mx-auto p-2 md:p-8 lg:px-12">
        {/* Navigation aid for user path tracking */}
        <Breadcrumb />

        {/* 
          Main Product Section: 
          Renders core product details including Gallery, Pricing, and CTA 
        */}
        <ProductDetailsView product={product} />

        {/* 
          Supplementary Content: 
          Displays related items to drive cross-selling and engagement 
        */}
        <RelatedProducts />
      </div>
    </SectionLayout>
  );
};
