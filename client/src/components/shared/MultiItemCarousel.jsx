import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { MultiItemCarouselSkeleton } from "../shared/skeletons/MultiItemCarouselSkeleton";
import { MultiItemCarouselError } from "../shared/errors/MultiItemCarouselError";

import { useSocialMediaData } from "../../hooks/useSocialMediaData";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export const MultiItemCarousel = () => {
  const { posts: slides, loading, error } = useSocialMediaData();

  // Integrated Loading State
  if (loading) return <MultiItemCarouselSkeleton />;

  // Integrated Error State
  if (error) return <MultiItemCarouselError error={error} />;

  return (
    <div className="relative px-8 group">
      <Swiper
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length >= 5}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="mySwiper"
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-square w-full border-[1px] border-white overflow-hidden group">
              <img
                src={item?.image?.url}
                alt={item.title || "Instagram Post"}
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs font-semibold">
                  View Post
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full! shadow-lg text-gray-600 hover:text-black transition-all disabled:opacity-0">
        &#10094;
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full! shadow-lg text-gray-600 hover:text-black transition-all disabled:opacity-0">
        &#10095;
      </button>
    </div>
  );
};
