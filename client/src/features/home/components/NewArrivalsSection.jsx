import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { SectionLayout } from "../../../layout/SectionLayout"; // Adjust path as needed
import { SectionHeader } from "../../../components/atoms/SectionHeader";
import { ProductCard } from "../../../components/shared/ProductCard";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";
import { useNewArrivals } from "../hooks/useNewArrivals";

export const NewArrivalsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);

  const {
    products,
    initialLoading,
    isMoreLoading,
    error,
    visibleCount,
    handleLoadMore,
    totalProducts,
  } = useNewArrivals(8);

  if (initialLoading) {
    return (
      <SectionLayout>
        <div className="text-center py-20 font-medium text-gray-500">
          Loading New Arrivals...
        </div>
      </SectionLayout>
    );
  }

  if (error) {
    return (
      <SectionLayout>
        <div className="text-center py-20 text-red-500 font-medium">
          Error: {error}
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout bgColor="bg-white">
      {/* Header Section */}
      <div className="py-5">
        <SectionHeader title="New Arrivals" linkText="View All" />
      </div>

      {/* Content Section */}
      <div className="py-2">
        {/* --- Desktop Grid Layout --- */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-8">
            {products.slice(0, visibleCount).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {visibleCount < totalProducts && (
            <div className="mt-20 flex items-center justify-center">
              <PrimaryButton
                label="Show More"
                onClick={handleLoadMore}
                hasLoad={isMoreLoading}
              />
            </div>
          )}
        </div>

        {/* --- Mobile & Tablet Swiper --- */}
        <div className="lg:hidden">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={2}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            onBreakpoint={(swiper) =>
              setSlidesPerView(swiper.params.slidesPerView)
            }
            breakpoints={{
              768: { slidesPerView: 3 },
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
          >
            {products.slice(0, 8).map((product) => (
              <SwiperSlide key={product._id}>
                <a
                  href={`/products/${product.slug}`}
                  className="no-underline! text-current! block!"
                >
                  <ProductCard product={product} />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-between mt-10 px-3">
            <div className="text-sm font-medium text-gray-600">
              {Math.min(
                currentIndex + slidesPerView,
                products.length > 8 ? 8 : products.length,
              )}{" "}
              / {products.length > 8 ? 8 : products.length}
            </div>

            <div className="flex gap-4">
              <button className="custom-prev p-3 border border-gray-400 rounded-full hover:bg-black hover:text-white transition disabled:opacity-30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="custom-next p-3 border border-gray-400 rounded-full hover:bg-black hover:text-white transition disabled:opacity-30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
