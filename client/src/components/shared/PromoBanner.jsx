export const PromoBanner = ({ image, title }) => {
  return (
    <section className="w-full my-5 px-0">
      <div
        className="relative w-full 
        /* Mobile: Let height be determined by image content (h-auto) */
        /* Tablet/Desktop: Apply fixed aspect ratios */
        h-auto md:aspect-[21/9] lg:aspect-[16/6] 
        overflow-hidden"
      >
        <img
          src={image}
          alt={title}
          /* On mobile: w-full and h-auto ensures no extra height is created.
             On md+: h-full and object-cover ensures it fills the aspect ratio box.
          */
          className="w-full h-auto md:h-full object-cover transition-transform duration-700 hover:scale-105"
        />

        {/* Content Overlay */}
        {/* Adjusted positioning for mobile (bottom-4) to prevent overlap */}
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10">
          <button className="bg-orange-500 text-white px-4 py-1.5 md:px-6 md:py-2 rounded font-bold shadow-lg text-sm md:text-base">
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
};
