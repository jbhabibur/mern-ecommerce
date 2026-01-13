import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const images = [
  "/images/insta1.jpg",
  "/images/insta2.jpg",
  "/images/insta3.jpg",
  "/images/insta4.jpg",
  "/images/insta5.jpg",
  "/images/insta6.jpg",
];

export const InstagramGallery = () => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    // মোবাইলে স্ক্রিন সাইজ অনুযায়ী স্ক্রল করার দূরত্ব
    const isMobile = window.innerWidth < 768;
    const scrollAmount = isMobile
      ? sliderRef.current.offsetWidth / 2 // ২টা ইমেজের জন্য অর্ধেক স্ক্রল
      : 320;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
        <span className="text-xl">📷</span>
        <h2 className="text-lg md:text-2xl font-semibold tracking-wide uppercase">
          DORJIBARI ON INSTAGRAM
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Left Button (Visible on all devices) */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll Left"
          className="absolute left-1 md:-left-4 top-1/2 -translate-y-1/2 z-20 
          w-8 h-8 md:w-10 md:h-10 rounded-full border bg-white/90 flex items-center justify-center
          hover:bg-black hover:text-white transition shadow-md"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Image Slider */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-3
            overflow-x-auto
            scroll-smooth
            snap-x snap-mandatory
            scrollbar-hide
          "
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Webkit scrollbar hiding style */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            div::-webkit-scrollbar { display: none; }
          `,
            }}
          />

          {images.map((img, index) => (
            <div
              key={index}
              className="
                snap-start
                shrink-0
                /* মোবাইল ২টা ইমেজ গ্যাপ বাদে */
                w-[calc(50%-6px)] 
                md:w-[300px]
                aspect-square
                md:h-[380px]
                bg-gray-100
                overflow-hidden
                rounded-sm
              "
            >
              <img
                src={img}
                alt={`Instagram ${index + 1}`}
                className="w-full h-full object-cover transition duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Right Button (Visible on all devices) */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll Right"
          className="absolute right-1 md:-right-4 top-1/2 -translate-y-1/2 z-20 
          w-8 h-8 md:w-10 md:h-10 rounded-full border bg-white/90 flex items-center justify-center
          hover:bg-black hover:text-white transition shadow-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* View Gallery Button */}
      <div className="mt-10 md:mt-12 flex justify-center">
        <button className="px-10 py-3 bg-black text-white text-sm tracking-widest hover:bg-gray-800 transition-colors">
          VIEW GALLERY
        </button>
      </div>
    </section>
  );
};
