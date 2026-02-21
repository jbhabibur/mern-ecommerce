import React from "react";
import { MultiItemCarousel } from "../../../components/shared/MultiItemCarousel";

// Import hooks
import { useRelatedProducts } from "../hooks/useRelatedProducts";

export const RelatedProducts = ({ product }) => {
  const { data, isLoading, isError, error } = useRelatedProducts();

  // If there is no data or an empty array, we can handle it gracefully
  const slides = data || [];
  const filteredSlides = slides.filter((item) => item._id !== product?._id);

  return (
    /* 1. Use 'mt' (margin-top) to pull the border closer to the previous section.
     2. Use 'pt' (padding-top) to push the content down away from the border. */
    <section className="border-t border-[#E8E8E8]">
      <div className="">
        {/* 3. Added 'mb-10' to give the carousel some space from the title */}
        <h2 className="text-center uppercase text-xl! font-bold! tracking-wider py-4">
          Related Products
        </h2>

        <MultiItemCarousel
          slides={filteredSlides}
          loading={isLoading}
          error={isError ? error : null}
        />

        {!isLoading && !isError && filteredSlides.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No related products found.
          </p>
        )}
      </div>
    </section>
  );
};
