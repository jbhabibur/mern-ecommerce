import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import Components
import { HeroSkeleton } from "./HeroSkeleton";
import { HeroError } from "./HeroError";

// Import hooks
import { useHeroData } from "../hooks/useHeroData";

export const Hero = () => {
  const {
    categories,
    currentIndex,
    loading,
    error,
    nextSlide,
    prevSlide,
    goToSlide,
  } = useHeroData(5000);

  const headerHeight = "125px";

  if (loading) return <HeroSkeleton />;

  if (error) return <HeroError />;

  return (
    <section
      className="relative w-full group overflow-hidden bg-white h-auto sm:h-[500px] lg:h-[var(--dynamic-height)]!"
      style={{ "--dynamic-height": `calc(100vh - ${headerHeight})` }}
    >
      {/* --- Main Slider --- */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {categories.map((item) => (
          <div
            key={item._id}
            className="w-full flex-shrink-0 h-full overflow-hidden"
          >
            <Link
              to={`/categories/${item.slug}`}
              className="block w-full h-full relative group/item"
            >
              {/* Image */}
              <img
                src={item.carouselImage}
                alt={item.name}
                className="w-full h-auto sm:h-full object-contain sm:object-cover transition-transform duration-700 group-hover/item:scale-105"
              />

              {/* --- Title Overlay --- */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 group-hover/item:bg-black/25 transition-all duration-500">
                <h2 className="text-white font-bold text-2xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase drop-shadow-2xl pointer-events-none transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
                  {item.name}
                </h2>
                <div className="w-12 h-1 bg-white mt-4 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-500"></div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* --- Controls: Arrows --- */}
      {categories.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden lg:group-hover:flex absolute top-1/2 left-8 -translate-y-1/2 z-30 items-center justify-center w-14 h-14 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={36} />
          </button>

          <button
            onClick={nextSlide}
            className="hidden lg:group-hover:flex absolute top-1/2 right-8 -translate-y-1/2 z-30 items-center justify-center w-14 h-14 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
          >
            <ChevronRight size={36} />
          </button>

          {/* --- Controls: Dots --- */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-30">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 rounded-full ${
                  currentIndex === index
                    ? "bg-white w-10 h-1.5 shadow-lg"
                    : "bg-white/40 w-2 h-2 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
