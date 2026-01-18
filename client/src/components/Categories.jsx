import Category1 from "../assets/images/categories/category-panjabi.png";
import Category2 from "../assets/images/categories/category-shirt.png";
import Category3 from "../assets/images/categories/category-polo.png";
import Category4 from "../assets/images/categories/category-accessories.png";

const categories = [
  { id: 1, name: "PANJABI", image: Category1 },
  { id: 2, name: "SHIRT", image: Category2 },
  { id: 3, name: "POLO SHIRT", image: Category3 },
  { id: 4, name: "ACCESSORIES", image: Category4 },
];

export const Categories = () => {
  return (
    <section className="bg-white py-10 md:py-8">
      {/* Main Wrapper:
          - max-w-[1240px]: Matches the width of New Arrivals.
          - mx-auto: Centers the container.
          - px-4 (mobile) & md:px-6 (desktop): Standardized horizontal padding 
            to keep edges aligned vertically across all sections.
      */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-6">
        {/* Grid Layout:
            - grid-cols-2: Two items per row on mobile.
            - lg:grid-cols-4: Four items per row on large screens.
            - gap-[10px]: Tight spacing for mobile.
            - md:gap-8: Wider spacing for desktop.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-8">
          {categories.map((item) => (
            <a
              href={`/categories/${item.name.toLowerCase().split(" ")[0]}`}
              key={item.id}
              className="group block"
            >
              {/* Image Container:
                  - aspect-[4/3]: Maintains a consistent ratio.
                  - overflow-hidden: Clips the image during hover scale.
              */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay:
                    - bg-black/10: Light tint by default.
                    - group-hover:bg-black/30: Darkens on hover for better text contrast.
                */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                  <h2 className="text-white font-bold! text-sm! md:text-base tracking-[0.2em] uppercase drop-shadow-lg pointer-events-none">
                    {item.name}
                  </h2>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
