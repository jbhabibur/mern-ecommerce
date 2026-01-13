import { useEffect, useState } from "react";
import { useHeader } from "../hooks/useHeader";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Hero1 from "../assets/images/hero/hero1.jpeg";
import Hero2 from "../assets/images/hero/hero2.jpeg";
import Hero3 from "../assets/images/hero/hero3.jpeg";

// Slide data (same as before)
const slides = [
  {
    id: 1,
    image: Hero1,
    title: "Slide 1 Title",
    subtitle: "Best quality guaranteed",
  },
  {
    id: 2,
    image: Hero2,
    title: "Slide 2 Title",
    subtitle: "New Winter Collection",
  },
  {
    id: 3,
    image: Hero3,
    title: "Slide 3 Title",
    subtitle: "Shop With Confidence",
  },
];

export const Hero = () => {
  const { headerHeight } = useHeader();
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(false);

  // Auto slide effect (pause on hover)
  useEffect(() => {
    if (pause) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [pause, current]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className={`relative w-full overflow-hidden bg-black
    h-[300px]               // mobile fallback
    sm:h-[calc(100vh-${headerHeight}px)]  // small screens
    md:h-[500px]            // tablet
    lg:h-[calc(100vh-${headerHeight}px)]  // desktop
  `}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            // Fade motion logic: using only opacity and scale (no translate-x)
            className={`absolute inset-0 h-full w-full transition-all duration-[1500ms] ease-in-out transform ${
              index === current
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-100 z-0"
            }`}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 z-[5]" />

            {/* Background image */}
            <img
              src={slide.image}
              className="w-full h-full object-cover object-top"
              alt={slide.title}
            />

            {/* Text animation (fade and rise) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-6 pointer-events-none">
              <h1
                className={`text-4xl md:text-7xl font-bold mb-4 transition-all duration-1000 delay-500 ${
                  index === current
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {slide.title}
              </h1>

              <p
                className={`text-lg md:text-2xl opacity-90 transition-all duration-1000 delay-700 ${
                  index === current
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="group absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white text-white w-12 h-12 flex items-center justify-center rounded-full transition-all backdrop-blur-md border border-white/20"
      >
        <ChevronLeft className="group-hover:text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="group absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white text-white w-12 h-12 flex items-center justify-center rounded-full transition-all backdrop-blur-md border border-white/20"
      >
        <ChevronRight className="group-hover:text-black" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full border border-white ${
              index === current
                ? "bg-white w-10 h-2"
                : "bg-transparent w-2 h-2 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
