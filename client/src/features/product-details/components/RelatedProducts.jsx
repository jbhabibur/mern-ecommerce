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
    <section className="border-t border-[#E8E8E8]">
      <div className="">
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
