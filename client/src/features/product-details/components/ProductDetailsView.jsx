import React from "react";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfoSection } from "./ProductInfoSection";
import { ProductExtraInfo } from "./ProductExtraInfo";

export const ProductDetailsView = ({ product }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-16 relative">
        {/* Module 1: Image Gallery & Lightbox */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
        />

        {/* Module 2: Pricing, Variations, and Add to Cart */}
        <ProductInfoSection product={product} />
      </div>

      {/* ADDITIONAL INFO SECTION */}
      {/* Module 3: Tabs for Description & Shipping Policy */}
      <ProductExtraInfo product={product} />
    </>
  );
};
