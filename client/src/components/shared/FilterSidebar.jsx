import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { DualRangeSlider } from "../atoms/DualRangeSlider";

export const FilterSidebar = ({
  isOpen,
  onClose,
  inStockCount,
  outOfStockCount,
  selectedStock,
  priceRange,
  updateFilters,
  totalFound,
  maxPrice,
  loading,
}) => {
  const sidebarRef = useRef(null);
  const [localPrice, setLocalPrice] = useState(priceRange);
  const [shouldShowRefined, setShouldShowRefined] = useState(false);

  /* ---------------- Sync price range ---------------- */
  useEffect(() => {
    if (priceRange[0] !== localPrice[0] || priceRange[1] !== localPrice[1]) {
      setLocalPrice(priceRange);
    }
  }, [priceRange]);

  /* ---------------- Refined By visibility + optimized scroll ---------------- */
  useEffect(() => {
    const isPriceFiltered = priceRange[0] !== 0 || priceRange[1] !== maxPrice;
    const hasSelectedStock = selectedStock.length > 0;
    const shouldShow = hasSelectedStock || isPriceFiltered;

    // Do not set to false during loading to prevent flickering.
    // It should only be set to false when "Clear All" is triggered or the filters are empty.
    setShouldShowRefined(shouldShow);

    // Only scroll if a new filter is added and the sidebar is at the bottom.
    if (
      shouldShow &&
      !loading &&
      sidebarRef.current &&
      sidebarRef.current.scrollTop > 100
    ) {
      requestAnimationFrame(() => {
        sidebarRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }, [selectedStock.length, priceRange, maxPrice, loading]);

  /* ---------------- Handlers ---------------- */
  const handleToggle = (value) => {
    if (loading) return;

    const updated = selectedStock.includes(value)
      ? selectedStock.filter((i) => i !== value)
      : [...selectedStock, value];

    updateFilters(updated, priceRange);
  };

  const handleSliderChange = (newRange) => {
    setLocalPrice(newRange);
    updateFilters(selectedStock, newRange);
  };

  const handleApplyClick = () => {
    if (loading) return;
    updateFilters(selectedStock, localPrice, null, null, true);
    if (window.innerWidth < 768) onClose();
  };

  const handleClearAll = () => {
    if (loading) return;
    updateFilters([], [0, maxPrice], null, null, true);
  };

  const isPriceFiltered = priceRange[0] !== 0 || priceRange[1] !== maxPrice;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-white z-50 p-6 
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          overflow-y-auto max-h-screen
          md:relative md:block md:translate-x-0 md:opacity-100 md:w-full md:p-0 md:z-0 md:bg-transparent md:overflow-visible
          ${
            isOpen
              ? "translate-x-0 opacity-100 shadow-2xl"
              : "max-md:-translate-x-full max-md:opacity-0"
          }
        `}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="font-bold text-sm tracking-widest uppercase">
            Filters
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="md:sticky md:top-4 space-y-12 mt-4 pb-12 md:pb-0">
          {/* Categories */}
          <div>
            <h3 className="font-bold! border-b-[1.5px] border-gray-400 pb-2 mb-4 text-base! tracking-widest uppercase text-[#1a1a1a]">
              Categories
            </h3>
          </div>

          {/* Refined By - Now uses CSS transition to avoid jumping */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              shouldShowRefined
                ? "max-h-[500px] opacity-100 mb-8"
                : "max-h-0 opacity-0 mb-0 pointer-events-none"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold! text-[15px]! text-[#1a1a1a]">
                REFINED BY
              </h3>
              <button
                onClick={handleClearAll}
                className="text-[13px]! text-gray-800 underline underline-offset-4 hover:text-black"
              >
                Clear All
              </button>
            </div>

            <p className="text-[14px] text-gray-500 mb-4">
              {totalFound} results
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedStock.map((id) => (
                <button
                  key={id}
                  onClick={() => handleToggle(id)}
                  className="flex items-center gap-2 bg-[#f8f8f8] px-3 py-1.5 text-[13px]! hover:bg-[#707070] hover:text-white transition"
                >
                  {id === "1" ? "In stock" : "Out of stock"}
                  <X size={14} />
                </button>
              ))}

              {isPriceFiltered && (
                <button
                  onClick={() =>
                    updateFilters(
                      selectedStock,
                      [0, maxPrice],
                      null,
                      null,
                      true,
                    )
                  }
                  className="flex items-center gap-2 bg-[#f8f8f8] px-3 py-1.5 text-[13px]! hover:bg-[#707070] hover:text-white transition"
                >
                  Tk {localPrice[0].toLocaleString()} – Tk{" "}
                  {localPrice[1].toLocaleString()}
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-bold! border-b-[1.5px] border-gray-400 pb-2 mb-4 text-base! tracking-widest uppercase text-[#1a1a1a]">
              Availability
            </h3>

            <div className="flex flex-col gap-y-4">
              {[
                { id: "1", label: "In Stock", count: inStockCount },
                { id: "0", label: "Out of Stock", count: outOfStockCount },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center cursor-pointer h-5"
                >
                  <input
                    type="checkbox"
                    disabled={loading}
                    checked={selectedStock.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    className="w-[15px] h-[15px] border border-gray-300 appearance-none checked:bg-black checked:border-black relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[1px] after:w-[4px] after:h-[8px] after:border-white after:border-b-2 after:border-r-2 after:rotate-45"
                  />
                  <span className="ml-2 text-[14px] text-[#1a1a1a]">
                    {item.label} ({item.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-bold! border-b-[1.5px] border-gray-400 pb-3 mb-8 text-base! tracking-widest uppercase text-[#1a1a1a]">
              Price
            </h3>

            <DualRangeSlider
              value={localPrice}
              onChange={handleSliderChange}
              minLimit={0}
              maxLimit={maxPrice > 0 ? maxPrice : localPrice[1]}
            />

            <button
              onClick={handleApplyClick}
              disabled={loading}
              className="w-full bg-[#1c1c1c] text-white py-2.5 mt-3 text-lg font-bold tracking-[0.1em] uppercase hover:bg-black disabled:opacity-50"
            >
              {loading ? "Applying..." : "Apply"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
