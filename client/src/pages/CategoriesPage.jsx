import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import { Filter } from "lucide-react";

// Components
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

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    products,
    categoryInfo,
    loading,
    error,
    inStockCount,
    outOfStockCount,
    totalFound,
    maxPriceInRange,
    selectedStock,
    priceRange,
    itemsPerPage,
    sortOption,
    updateFilters,
  } = useCategory(slug);

  useEffect(() => {
    if (!loading) {
      setIsLoadingMore(false);
    }
  }, [loading]);

  if (error)
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-gray-800">
      {loading && !isLoadingMore && (
        <div className="fixed inset-0 z-[999] bg-white/40 backdrop-blur-[2px] flex justify-center items-center transition-opacity duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      )}

      <Breadcrumb />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Adjusted Aside Logic for Desktop Visibility */}
        <aside
          className={`
            ${isFilterOpen ? "fixed inset-0 z-[100] bg-white p-6 overflow-y-auto block" : "hidden"} 
            md:block md:static md:w-56 lg:w-60 md:p-0 md:bg-transparent md:z-auto shrink-0
          `}
        >
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            inStockCount={inStockCount}
            outOfStockCount={outOfStockCount}
            totalFound={totalFound}
            selectedStock={selectedStock}
            priceRange={priceRange}
            itemsPerPage={itemsPerPage}
            sortOption={sortOption}
            updateFilters={updateFilters}
            maxPrice={maxPriceInRange}
            loading={loading}
          />
        </aside>

        <main className="flex-1 relative">
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

          <div className="flex items-center justify-between py-3 mb-8 border-b border-gray-100">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
            >
              <Filter size={14} /> Filter
            </button>

            <ViewToggle currentView={view} onViewChange={setView} />

            <div className="flex items-center gap-4 md:gap-4">
              <div className="hidden md:block">
                <ItemsPerPage
                  selected={itemsPerPage}
                  onChange={(val) =>
                    updateFilters(selectedStock, priceRange, val, sortOption)
                  }
                />
              </div>

              <div className="block lg:hidden">
                <SortMobile
                  selected={sortOption}
                  onChange={(val) =>
                    updateFilters(selectedStock, priceRange, itemsPerPage, val)
                  }
                />
              </div>
              <div className="hidden lg:block">
                <SortDesktop
                  selected={sortOption}
                  onChange={(val) =>
                    updateFilters(selectedStock, priceRange, itemsPerPage, val)
                  }
                />
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            <div
              className={`grid ${GRID_CLASSES[view]} gap-x-4 gap-y-8 md:gap-y-10 transition-opacity duration-300 ${
                loading ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
            >
              {products.length > 0
                ? products.map((product) => (
                    <div
                      key={product._id}
                      className={view === "list" ? "border-b pb-6" : ""}
                    >
                      <ProductCard product={product} view={view} />
                    </div>
                  ))
                : !loading && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                      No products found matching your filters.
                    </div>
                  )}
            </div>
          </div>

          {!loading && products.length > 0 && totalFound > products.length && (
            <LoadMoreSection
              currentItems={products.length}
              totalItems={totalFound}
              loading={isLoadingMore}
              onLoadMore={() => {
                setIsLoadingMore(true);
                const step = Number(itemsPerPage);
                const nextLimit = products.length + step;
                updateFilters(selectedStock, priceRange, nextLimit, sortOption);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};
