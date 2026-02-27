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
import { CategoriesSkeleton } from "../components/shared/skeletons/CategoriesSkeleton";
import { PrimaryButton } from "../components/atoms/PrimaryButton";

export const CategoriesPage = () => {
  const { categoryName: slug } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState("grid4");

  // 1. New State: Track if it's the very first load for this slug
  const [isInitialMount, setIsInitialMount] = useState(true);
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

  // 2. Reset initial mount when slug changes
  useEffect(() => {
    setIsInitialMount(true);
  }, [slug]);

  // 3. Turn off initial mount once data first arrives
  useEffect(() => {
    if (!loading && isInitialMount) {
      // Small delay for smooth transition if desired
      const timer = setTimeout(() => setIsInitialMount(false), 10);
      return () => clearTimeout(timer);
    }
    if (!loading) {
      setIsLoadingMore(false);
    }
  }, [loading, isInitialMount]);

  // 4. SHOW SKELETON: Only on first load of the page/category
  if (loading && isInitialMount && !isLoadingMore) {
    return <CategoriesSkeleton />;
  }

  if (error)
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  const ButtonSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  console.log(categoryInfo);

  return (
    <div className="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-gray-800">
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
              <CategoriesPageBanner banner={categoryInfo.banner} />
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

          {/* --- LOAD MORE SECTION --- */}
          {products.length > 0 && (
            <div className="mt-16 mb-24 flex flex-col items-center gap-3">
              {/* Progress Bar & Counter Area */}
              <div className="flex flex-col items-center w-full max-w-[200px] gap-3">
                <p className="text-[15px]! text-gray-500 font-normal whitespace-nowrap m-0">
                  Showing 1 - {products.length} of {totalFound} total
                </p>

                {/* Slim Progress Bar */}
                <div className="w-full h-[2.5px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4a6cf7] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${(products.length / totalFound) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Action Button Area */}
              <div className="w-full max-w-[320px]">
                {totalFound > products.length ? (
                  <button
                    disabled={isLoadingMore}
                    onClick={() => {
                      setIsLoadingMore(true);
                      setTimeout(() => {
                        const step = Number(itemsPerPage);
                        const nextLimit = products.length + step;
                        updateFilters(
                          selectedStock,
                          priceRange,
                          nextLimit,
                          sortOption,
                          true,
                        );
                      }, 1000);
                    }}
                    className="w-full h-[54px] border border-black bg-white text-black font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-black! hover:text-white! transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <ButtonSpinner />
                        <span className="normal-case font-medium tracking-normal text-gray-600">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      "SHOW MORE"
                    )}
                  </button>
                ) : (
                  /* NO MORE PRODUCT - Matches your uploaded image 19dc5a.png */
                  <div className="w-full h-[54px] border border-gray-300 bg-white text-gray-400 font-bold text-[16px] uppercase tracking-[0.1em] flex items-center justify-center">
                    NO MORE PRODUCT
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
