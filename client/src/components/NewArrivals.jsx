import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import "swiper/css";

import { SectionTitle } from "./shared/SectionTitle";
import { ProductCard } from "./shared/ProductCard";
import { PrimaryButton } from "./atoms/PrimaryButton";

export const NewArrivals = () => {
  const products = [1, 2, 3, 4, 5, 6, 7, 8];

  const SLIDES_PER_VIEW = 2;
  const SLIDES_PER_GROUP = 2;

  const [currentIndex, setCurrentIndex] = useState(SLIDES_PER_VIEW);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [prevRef.current, nextRef.current]);

  return (
    <section className="lg:px-22 py-4 lg:py-24">
      <SectionTitle title="NEW ARRIVALS" linkText="View All" linkUrl="/shop" />

      {/* MOBILE & TABLET */}
      <div className="block lg:hidden mt-8">
        <Swiper
          modules={[Navigation]}
          spaceBetween={12} // Space reduced for mobile
          slidesPerView={SLIDES_PER_VIEW}
          slidesPerGroup={SLIDES_PER_GROUP}
          speed={500}
          allowTouchMove={true} // Mobile এ টাচ মুভ অন রাখা ভালো
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) =>
            setCurrentIndex(
              Math.min(swiper.activeIndex + SLIDES_PER_VIEW, products.length)
            )
          }
          className="product-swiper" // Custom class if needed
        >
          {products.map((item) => (
            <SwiperSlide key={item} className="pb-4">
              {" "}
              {/* Slide padding added */}
              <ProductCard
                title={`Shirt: Full Sleeve Blue Door _0${item}`}
                price="2,490.00"
                disabled={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation - Relative positioned so it doesn't overlap */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 bg-white mt-4">
          {/* Fraction Display */}
          <div className="text-gray-500 font-light text-xl tracking-widest">
            {currentIndex}
            <span className="mx-1 text-gray-300">/</span>
            {products.length}
          </div>

          {/* Nav Buttons */}
          <div className="flex gap-3">
            <button
              ref={prevRef}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
            >
              <HiOutlineArrowLeft size={20} />
            </button>
            <button
              ref={nextRef}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30"
            >
              <HiOutlineArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden lg:grid grid-cols-4 gap-x-8 gap-y-16 py-16">
        {products.map((item) => (
          <ProductCard
            key={item}
            title="Shirt: Full Sleeve Blue Door Regular Fit"
            price="2,490.00"
          />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <PrimaryButton title="Show More" />
      </div>
    </section>
  );
};
