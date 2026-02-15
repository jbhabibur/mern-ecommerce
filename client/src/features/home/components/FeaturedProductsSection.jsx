import { SectionLayout } from "../../../layout/SectionLayout";
import { ProductCard } from "../../../components/shared/ProductCard";
import { useFeturedProductsData } from "../hooks/useFeturedProductsData";
import { SectionHeader } from "../../../components/atoms/SectionHeader";
import { FeaturedProductsSkeleton } from "./FeaturedProductsSectionSkeleton";
import { FeaturedProductsError } from "./FeaturedProductsSectionError";

export const FeaturedProductsSection = () => {
  const { products, loading, error } = useFeturedProductsData();

  // Loading State: Renders skeleton cards while fetching data
  if (loading) return <FeaturedProductsSkeleton />;

  // Error handle: Do not render section if there is an error or no products found
  if (error || !products || products.length === 0) {
    return <FeaturedProductsError error={error} />;
  }

  return (
    <SectionLayout bgColor="bg-white">
      {/* Header Section */}
      <div className="mt-10">
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
