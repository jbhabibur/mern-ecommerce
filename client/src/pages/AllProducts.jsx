import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { createPortal } from "react-dom";

import { Breadcrumb } from "../components/atoms/Breadcrumb";
import { TitleAndDescription } from "../components/atoms/TitleAndDescription";
import { FilterSidebar } from "../components/shared/FilterSidebar";
import { ViewToggle } from "../components/shared/ViewToggle";
import { ItemsPerPage } from "../components/shared/ItemsPerPage";
import { SortMobile } from "../components/shared/SortMobile";
import { SortDesktop } from "../components/shared/SortDesktop";
import { ProductCard } from "../components/shared/ProductCard";
import { GRID_CLASSES } from "../constants/layout";
import { CategoriesSkeleton } from "../components/shared/skeletons/CategoriesSkeleton";

import { useProducts } from "../hooks/useProducts";

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
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

export const AllProducts = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState("grid4");

  // Base items per page state (unchanged by Show More)
  const [itemsPerPageBase, setItemsPerPageBase] = useState(10);

  const {
    products,
    loading,
    error,
    inStockCount,
    outOfStockCount,
    totalFound,
    maxPriceInRange,
    selectedStock,
    priceRange,
    sortOption,
    itemsPerPage,
    updateFilters,
  } = useProducts();

  // Scroll lock for mobile filters
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isFilterOpen && isMobile) {
      document.body.classList.add("lock-scroll");
    } else {
      document.body.classList.remove("lock-scroll");
    }
    return () => document.body.classList.remove("lock-scroll");
  }, [isFilterOpen]);

  if (loading && products.length === 0) return <CategoriesSkeleton />;
  if (error)
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  const canLoadMore = products.length < totalFound;

  return (
    <div className="max-w-[78rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-gray-800">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:block lg:w-60 md:w-56">
          {createPortal(
            <div
              className={`fixed inset-0 z-[100] md:hidden ${
                isFilterOpen ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                  isFilterOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setIsFilterOpen(false)}
              />
              <div
                className={`fixed top-0 left-0 h-full w-[280px] bg-white transform transition-transform duration-300 ${
                  isFilterOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="h-full overflow-y-auto custom-scrollbar">
                  <FilterSidebar
                    isOpen={true}
                    inStockCount={inStockCount}
                    outOfStockCount={outOfStockCount}
                    totalFound={totalFound}
                    selectedStock={selectedStock}
                    priceRange={priceRange}
                    sortOption={sortOption}
                    updateFilters={updateFilters}
                    maxPrice={maxPriceInRange}
                    loading={loading}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )}

          <div className="hidden md:block sticky top-4">
            <FilterSidebar
              isOpen={true}
              inStockCount={inStockCount}
              outOfStockCount={outOfStockCount}
              totalFound={totalFound}
              selectedStock={selectedStock}
              priceRange={priceRange}
              sortOption={sortOption}
              updateFilters={updateFilters}
              maxPrice={maxPriceInRange}
              loading={loading}
            />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 relative">
          <TitleAndDescription
            title="All Products"
            description="Browse our entire collection of premium products."
          />

          {/* Controls */}
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
                  selected={itemsPerPageBase} // base value stays same
                  onChange={(val) => {
                    setItemsPerPageBase(val); // update base value
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

              <div className="block md:hidden">
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

          {/* Product Grid */}
          <div
            className={`grid ${GRID_CLASSES[view]} gap-x-4 gap-y-8 md:gap-y-10 transition-opacity duration-300 ${
              loading ? "opacity-30 pointer-events-none" : "opacity-100"
            }`}
          >
            {products.length > 0
              ? products.map((product) => (
                  <div key={product._id}>
                    <ProductCard product={product} view={view} />
                  </div>
                ))
              : !loading && (
                  <div className="col-span-full text-center py-20 text-gray-500">
                    No products found matching your filters.
                  </div>
                )}
          </div>

          {/* Load More */}
          {products.length > 0 && (
            <div className="mt-16 mb-24 flex flex-col items-center gap-4">
              <p className="text-gray-500">
                Showing 1 - {products.length} of {totalFound}
              </p>

              {canLoadMore ? (
                <button
                  disabled={isLoadingMore}
                  onClick={() => {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                      const nextLimit = products.length + itemsPerPageBase;
                      updateFilters(
                        selectedStock,
                        priceRange,
                        nextLimit,
                        sortOption,
                        true,
                      );
                      setIsLoadingMore(false);
                    }, 1000); // 1 sec spinner
                  }}
                  className="w-[320px] h-[54px] border border-black bg-white text-black font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-black! hover:text-white! transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <ButtonSpinner />
                      <span className="text-gray-600 font-medium">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    "SHOW MORE"
                  )}
                </button>
              ) : (
                <div className="w-[320px] h-[54px] border border-gray-300 bg-white text-gray-400 font-bold text-[14px] uppercase tracking-[0.1em] flex items-center justify-center">
                  NO MORE PRODUCT
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
