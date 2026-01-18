import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { SectionHeader } from "../../components/atoms/SectionHeader";
import { ProductCard } from "../../components/shared/ProductCard";
import { PrimaryButton } from "../../components/atoms/PrimaryButton";

export const ProductSection = ({
  title,
  filterType,
  isSliderMobile = false,
}) => {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        const filtered = data.filter((item) => item[filterType] === true);
        setProducts(filtered);
        setInitialLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setInitialLoading(false);
      }
    };
    fetchProducts();
  }, [filterType]);

  const handleLoadMore = () => {
    setIsMoreLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsMoreLoading(false);
    }, 1500);
  };

  if (initialLoading)
    return <div className="text-center py-10">Loading...</div>;

  const slugify = (name) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <section className="py-10">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        <SectionHeader title={title} linkText="View All" />

        {/* --- Desktop & Tablet Layout (Always Grid) --- */}
        <div className={`mt-8 ${isSliderMobile ? "hidden md:block" : "block"}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.slice(0, visibleCount).map((product) => (
              <a
                key={product.id}
                href={`/products/${slugify(product.name)}`}
                className="block"
              >
                <ProductCard product={product} />
              </a>
            ))}
          </div>

          {visibleCount < products.length && (
            <div className="mt-12 flex justify-center">
              <PrimaryButton
                label="Show More"
                onClick={handleLoadMore}
                hasLoad={isMoreLoading}
              />
            </div>
          )}
        </div>

        {/* --- Mobile Slider Layout (Only if isSliderMobile is true) --- */}
        {isSliderMobile && (
          <div className="md:hidden mt-6">
            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={2}
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              navigation={{
                nextEl: `.${filterType}-next`,
                prevEl: `.${filterType}-prev`,
              }}
            >
              {products.slice(0, 8).map((product) => (
                <SwiperSlide key={product.id}>
                  <a
                    href={`/products/${slugify(product.name)}`}
                    className="block"
                  >
                    <ProductCard product={product} />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-bold">
                {Math.min(currentIndex + 2, 8)} / 8
              </span>
              <div className="flex gap-2">
                <button
                  className={`${filterType}-prev p-2 border rounded-full`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className={`${filterType}-next p-2 border rounded-full`}
                >
                  <svg
                    width="20"
                    height="20"
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
        )}
      </div>
    </section>
  );
};
