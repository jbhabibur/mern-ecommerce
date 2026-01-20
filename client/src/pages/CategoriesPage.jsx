import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";

import { Filter } from "lucide-react";

import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { TitleAndDescription } from "../components/atoms/TitleAndDescription";
import { FilterSidebar } from "../components/shared/FilterSidebar";
import { ViewToggle } from "../components/shared/ViewToggle";
import { ItemsPerPage } from "../components/shared/ItemsPerPage";
import { SortMobile } from "../components/shared/SortMobile";
import { SortDesktop } from "../components/shared/SortDesktop";
import { ProductCard } from "../components/shared/ProductCard";
import { LoadMoreSection } from "../components/shared/LoadMoreSection";
import { CategoriesPageBanner } from "../components/atoms/CategoriesPageBanner";

import { GRID_CLASSES } from "../constants/layout";

export const CategoriesPage = () => {
  const { categoryName: slug } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState("grid2");

  const {
    products, // If you renamed it in the hook's return statement, use that name here
    categoryInfo,
    loading,
    error,
    inStockCount,
    outOfStockCount,
    selectedStock,
    setSelectedStock,
    priceRange,
    setPriceRange,
  } = useCategory(slug);

  // 1. Fix: Ensure you are logging/mapping the correct variable name
  console.log("Rendering products:", products);

  if (loading)
    return <div className="text-center py-20 font-sans">Loading items...</div>;

  if (error)
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-gray-800">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside
          className={`${isFilterOpen ? "block" : "hidden"} md:block w-full md:w-64 lg:w-72 shrink-0`}
        >
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            inStockCount={inStockCount}
            outOfStockCount={outOfStockCount}
            selectedStock={selectedStock}
            onStockChange={setSelectedStock}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* categoriesPage.jsx line 73 check */}
          {categoryInfo.banner && categoryInfo.banner.trim() !== "" && (
            <div className="mb-6">
              <CategoriesPageBanner
                banner={`http://localhost:5000${categoryInfo.banner}`}
              />
            </div>
          )}

          <TitleAndDescription
            title={categoryInfo.title || "Category"}
            description={
              categoryInfo.description || "Explore our latest collection."
            }
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between py-3 mb-8 border-b border-gray-100">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
            >
              <Filter size={14} /> Filter
            </button>
            <ViewToggle currentView={view} onViewChange={setView} />
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:block">
                <ItemsPerPage />
              </div>
              <div className="block md:hidden">
                <SortMobile />
              </div>
              <div className="hidden md:block">
                <SortDesktop />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div
            className={`grid ${GRID_CLASSES[view]} gap-x-4 gap-y-8 md:gap-y-10 transition-all duration-300`}
          >
            {products && products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className={view === "list" ? "border-b pb-6" : ""}
                >
                  <ProductCard product={product} view={view} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found matching your filters.
              </div>
            )}
          </div>

          {products.length > 10 && (
            <div className="mt-12">
              <LoadMoreSection />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
