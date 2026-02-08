import { SectionLayout } from "../../../layout/SectionLayout";
import { ProductCard } from "../../../components/shared/ProductCard";
import { useFeturedProductsData } from "../hooks/useFeturedProductsData";
import { SectionHeader } from "../../../components/atoms/SectionHeader";

export const FeaturedProductsSection = () => {
  // Destructured products (renamed from categories)
  const { products, loading, error } = useFeturedProductsData();

  // Loading State: Renders skeleton cards while fetching data
  if (loading) {
    return (
      <SectionLayout bgColor="bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="aspect-[3/4] bg-gray-100 animate-pulse rounded-md"
            />
          ))}
        </div>
      </SectionLayout>
    );
  }

  // Error handle: Do not render section if there is an error or no products found
  if (error || !products || products.length === 0) return null;

  return (
    <SectionLayout bgColor="bg-white">
      {/* Header Section */}
      <div className="py-5">
        <SectionHeader title="Feature Products" linkText="View All" />
      </div>

      {/* Content Section */}
      <div className="py-2">
        {/* Responsive Grid Logic:
          grid-cols-1: Mobile (1 product per row)
          sm:grid-cols-2: Tablet (2 products per row)
          lg:grid-cols-4: Desktop (4 products per row) 
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} view="grid" />
          ))}
        </div>
      </div>
    </SectionLayout>
  );
};
