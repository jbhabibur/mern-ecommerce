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
    <section className="w-full bg-white my-6 md:my-10 lg:my-16 py-3 md:py-6 lg:py-8">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((item) => (
            <a
              href={`/categories/${item.name.toLowerCase().split(" ")[0]}`}
              key={item.id}
            >
              <div className="relative aspect-[4/3] overflow-hidden group cursor-pointer">
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <h2 className="text-white font-bold text-sm md:text-lg lg:text-xl tracking-widest drop-shadow-lg">
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
