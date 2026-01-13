export const PromoBanner = ({ image, title }) => {
  return (
    <section className="w-full">
      <div
        className="relative w-full 
        /* Mobile: Square ratio, Desktop: Wide ratio */
        aspect-square md:aspect-[21/9] lg:aspect-[16/6] 
        overflow-hidden"
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />

        {/* Content Overlay */}
        <div className="absolute bottom-10 left-10">
          <button className="bg-orange-500 text-white px-6 py-2 rounded font-bold">
            SHOP NOW
          </button>
        </div>
      </div>
    </section>
  );
};
