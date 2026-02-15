import React from "react";
import { Link } from "react-router-dom";
import placeholderImage from "../../../assets/images/placeholder-carousel.jpg";

export const HeroError = () => {
  const headerHeight = "125px";

  return (
    <section
      className="relative w-full group/item overflow-hidden bg-white h-auto sm:h-[500px] lg:h-[var(--dynamic-height)]!"
      style={{ "--dynamic-height": `calc(100vh - ${headerHeight})` }}
    >
      <Link to="/shop" className="block w-full h-full relative">
        {/* Fallback Image with Hero Hover Scale */}
        <img
          src={placeholderImage}
          alt="New Collection"
          className="w-full h-auto sm:h-full object-contain sm:object-cover transition-transform duration-700 group-hover/item:scale-105"
        />

        {/* Hero-style Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 group-hover/item:bg-black/25 transition-all duration-500">
          <h2 className="text-white font-bold text-2xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase drop-shadow-2xl transform translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500">
            New Collection
          </h2>

          {/* Hero-style Underline Animation */}
          <div className="w-12 h-1 bg-white mt-4 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-500"></div>

          {/* Action Button */}
          <button className="mt-8 px-8 py-3 bg-white/10 text-white backdrop-blur-md border border-white/20 font-semibold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover/item:opacity-100 translate-y-4 group-hover/item:translate-y-0">
            Shop Now
          </button>
        </div>
      </Link>
    </section>
  );
};
