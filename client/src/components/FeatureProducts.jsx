import React, { useState, useEffect } from "react";
import { SectionHeader } from "../components/atoms/SectionHeader";
import { ProductCard } from "../components/shared/ProductCard";

export const FeatureProducts = () => {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();

        // Filter and limit to exactly 8 products
        const newArrivals = data
          .filter((item) => item.isNewArrival === true)
          .slice(0, 8);

        setProducts(newArrivals);
        setInitialLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setInitialLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (initialLoading) {
    return <div className="text-center py-10 font-medium">Loading...</div>;
  }

  return (
    <section>
      {/* Header Container */}
      <div className="max-w-[1240px] mx-auto py-2 px-4 md:px-6">
        <SectionHeader title="Feature Products" linkText="View All" />
      </div>

      {/* Products Grid Container */}
      <div className="max-w-[1240px] mx-auto py-2 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="no-underline! text-current! block!"
            >
              <ProductCard product={product} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
