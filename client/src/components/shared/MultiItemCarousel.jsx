import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { MultiItemCarouselSkeleton } from "../shared/skeletons/MultiItemCarouselSkeleton";
import { MultiItemCarouselError } from "../shared/errors/MultiItemCarouselError";
import { ProductCard } from "../shared/ProductCard";

import "swiper/css";
import "swiper/css/navigation";

export const MultiItemCarousel = ({
  slides = [],
  loading,
  error,
  isSocial = false,
}) => {
  if (loading) return <MultiItemCarouselSkeleton />;
  if (error) return <MultiItemCarouselError error={error} />;

  // Define breakpoints dynamically based on the mode
  const responsiveBreakpoints = isSocial
    ? {
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 }, // 5 slides for Social
      }
    : {
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 }, // Only 4 slides for ProductCard
      };

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={isSocial ? 0 : 20}
        slidesPerView={1}
        // Adjust loop logic to match the slide count
        loop={slides.length >= (isSocial ? 5 : 4)}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        breakpoints={responsiveBreakpoints}
        className="mySwiper"
      >
        {slides.map((item) => (
          <SwiperSlide key={item._id || item.id}>
            {isSocial ? (
              <div className="relative aspect-square w-full border-[1px] border-white overflow-hidden group/social">
                <img
                  src={item?.image?.url}
                  alt={item.title || "Social Post"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/social:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                  <span className="text-white text-xs font-semibold uppercase tracking-widest bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                    View Post
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full pb-4">
                {/* Added padding bottom for shadow visibility */}
                <ProductCard product={item} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button
        className={`swiper-button-prev-custom absolute  ${isSocial ? "left-0 top-1/2 -translate-y-1/2" : "-left-5 top-1/3 -translate-y-1/2"} z-20 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg text-gray-600 hover:text-black transition-all disabled:opacity-0`}
      >
        &#10094;
      </button>
      <button
        className={`swiper-button-next-custom absolute  ${isSocial ? "right-0 top-1/2 -translate-y-1/2" : "-right-5 top-1/3 -translate-y-1/2"} z-20 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg text-gray-600 hover:text-black transition-all disabled:opacity-0`}
      >
        &#10095;
      </button>
    </div>
  );
};
