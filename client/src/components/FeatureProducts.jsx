import { SectionTitle } from "./shared/SectionTitle";
import { ProductCard } from "../components/shared/ProductCard";

export const FeatureProducts = () => {
  const products = Array.from({ length: 8 }); // ২০টি কার্ডের জন্য লুপ

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <SectionTitle title="Featured Products" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        {products.map((_, index) => (
          <ProductCard key={index} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button className="bg-black text-white px-10 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          Show More
        </button>
      </div>
    </section>
  );
};
