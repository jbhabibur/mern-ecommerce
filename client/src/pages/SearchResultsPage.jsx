import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useSearch } from "../features/search/hooks/useSearch";

// Components
import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { TitleAndDescription } from "../components/atoms/TitleAndDescription";
import { FilterSidebar } from "../components/shared/FilterSidebar";
import { ViewToggle } from "../components/shared/ViewToggle";
import { ItemsPerPage } from "../components/shared/ItemsPerPage";
import { SortDesktop } from "../components/shared/SortDesktop";
import { SortMobile } from "../components/shared/SortMobile";
import { ProductCard } from "../components/shared/ProductCard";
import { GRID_CLASSES } from "../constants/layout";
import { CategoriesSkeleton } from "../components/shared/skeletons/CategoriesSkeleton";

export const SearchResultsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState("grid4");
  const [itemsPerPageBase, setItemsPerPageBase] = useState(12); // Base step for "Show More"
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    products,
    loading,
    error,
    inStockCount,
    outOfStockCount,
    totalFound,
    maxPriceInRange,
    priceRange,
    selectedStock,
    sortOption,
    itemsPerPage,
    query,
    updateFilters,
  } = useSearch();

  useEffect(() => {
    if (!loading) {
      setIsInitialMount(false);
      setIsLoadingMore(false);
    }
  }, [loading]);

  if (loading && isInitialMount && !isLoadingMore) {
    return <CategoriesSkeleton />;
  }

  const ButtonSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div className="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-gray-800">
      <Breadcrumb />
      <div className="flex flex-col md:flex-row gap-8">
        <aside
          className={`${isFilterOpen ? "fixed inset-0 z-[100] bg-white p-6 overflow-y-auto block" : "hidden"} md:block md:static md:w-56 lg:w-60 shrink-0`}
        >
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            inStockCount={inStockCount}
            outOfStockCount={outOfStockCount}
            totalFound={totalFound}
            selectedStock={selectedStock}
            priceRange={priceRange}
            updateFilters={updateFilters}
            maxPrice={maxPriceInRange}
            loading={loading}
          />
        </aside>

        <main className="flex-1">
          <TitleAndDescription
            title="Search Results"
            description={
              query
                ? `Found ${totalFound} items for "${query}"`
                : "Popular Products"
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

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <ItemsPerPage
                  selected={itemsPerPageBase}
                  onChange={(val) => {
                    setItemsPerPageBase(val);
                    updateFilters(
                      selectedStock,
                      priceRange,
                      val,
                      sortOption,
                      true,
                    );
                  }}
                />
              </div>
              <div className="lg:hidden">
                <SortMobile
                  selected={sortOption}
                  onChange={(val) =>
                    updateFilters(
                      selectedStock,
                      priceRange,
                      itemsPerPage,
                      val,
                      true,
                    )
                  }
                />
              </div>
              <div className="hidden lg:block">
                <SortDesktop
                  selected={sortOption}
                  onChange={(val) =>
                    updateFilters(
                      selectedStock,
                      priceRange,
                      itemsPerPage,
                      val,
                      true,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div
            className={`grid ${GRID_CLASSES[view]} gap-x-4 gap-y-10 transition-opacity duration-300 ${loading ? "opacity-30" : "opacity-100"}`}
          >
            {products.length > 0
              ? products.map((p) => (
                  <ProductCard key={p._id} product={p} view={view} />
                ))
              : !loading && (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    No products found.
                  </div>
                )}
          </div>

          {/* --- LOAD MORE SECTION --- */}
          {products.length > 0 && (
            <div className="mt-16 mb-24 flex flex-col items-center gap-3">
              <div className="flex flex-col items-center w-full max-w-[200px] gap-3">
                <p className="text-[15px] text-gray-500 font-normal m-0">
                  Showing 1 - {products.length} of {totalFound} total
                </p>
                <div className="w-full h-[2.5px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4a6cf7] transition-all duration-700 ease-in-out"
                    style={{
                      width: `${(products.length / (totalFound || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="w-full max-w-[320px]">
                {totalFound > products.length ? (
                  <button
                    disabled={isLoadingMore}
                    onClick={() => {
                      setIsLoadingMore(true);
                      setTimeout(() => {
                        const nextLimit =
                          products.length + Number(itemsPerPageBase);
                        updateFilters(
                          selectedStock,
                          priceRange,
                          nextLimit,
                          sortOption,
                          true,
                        );
                      }, 1000);
                    }}
                    className="w-full h-[54px] border border-black bg-white text-black font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <ButtonSpinner />{" "}
                        <span className="normal-case font-medium text-gray-600">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      "SHOW MORE"
                    )}
                  </button>
                ) : (
                  <div className="w-full h-[54px] border border-gray-300 bg-white text-gray-400 font-bold text-[16px] uppercase flex items-center justify-center">
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
