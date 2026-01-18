import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Arrow icon gulo import korte hobe
import { ProductCard } from "../shared/ProductCard"; // Apnar ProductCard import korun

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// products = [] deya mane holo data undefined thakle eta empty array nibe
export const RelatedProducts = ({ products = [] }) => {
  // Jodi data loading thake ba array khali thake tobe component render hobe na
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-t border-gray-100 bg-white">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-10 uppercase tracking-widest">
        Related Products
      </h2>

      <div className="relative px-4 md:px-12">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.4}
          centeredSlides={false}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          className="mySwiper"
        >
          {/* Optional chaining products?.map bebohar kora safer */}
          {products?.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button className="swiper-button-prev-custom hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <button className="swiper-button-next-custom hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm">
          <ChevronRight size={20} />
        </button>

        {/* Custom Pagination Dots */}
        <div className="custom-pagination flex justify-center gap-2 mt-8"></div>
      </div>
    </section>
  );
};
