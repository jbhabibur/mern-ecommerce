import { X } from "lucide-react";
import { DualRangeSlider } from "../atoms/DualRangeSlider";

export const FilterSidebar = ({
  isOpen,
  onClose,
  inStockCount,
  outOfStockCount,
  selectedStock,
  onStockChange,
  priceRange,
  onPriceChange,
}) => {
  const handleToggle = (value) => {
    const updated = selectedStock.includes(value)
      ? selectedStock.filter((i) => i !== value)
      : [...selectedStock, value];
    onStockChange(updated);
  };

  const handlePriceSlider = (e) => {
    const val = parseInt(e.target.value);
    onPriceChange([priceRange[0], val]);
  };

  return (
    <>
      {/* 1. Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* 2. Sidebar Main Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] bg-white z-50 p-6 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-full md:p-0 md:z-0 md:bg-transparent
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="font-bold text-sm tracking-widest uppercase">
            Filters
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="sticky top-4 space-y-12 mt-4">
          {/* CATEGORIES SECTION (Added to match image) */}
          <div>
            <h3 className="font-bold! border-b-[1.5px] border-gray-400 pb-2 mb-4 text-base! tracking-widest uppercase text-[#1a1a1a]">
              Categories
            </h3>
          </div>

          {/* AVAILABILITY */}
          <div>
            <h3 className="font-bold! border-b-[1.5px] border-gray-400 pb-2 mb-4 text-base! tracking-widest uppercase text-[#1a1a1a]">
              Availability
            </h3>
            <div className="flex flex-col gap-y-4">
              {[
                { id: "in-stock", label: "In Stock", count: inStockCount },
                {
                  id: "out-of-stock",
                  label: "Out of Stock",
                  count: outOfStockCount,
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-x-3 leading-none cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="w-[20px]! h-[20px]! border border-gray-300 rounded-none accent-black cursor-pointer shrink-0 appearance-none checked:bg-black checked:border-black relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[6px] after:top-[2px] after:w-[5px] after:h-[10px] after:border-white after:border-b-2 after:border-r-2 after:rotate-45"
                    checked={selectedStock.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                  />
                  <span className="text-[16px] text-[#1a1a1a] leading-none select-none">
                    {item.label}({item.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div>
            <h3 className="font-bold! border-b-[1.5px] border-gray-400 pb-3 mb-8 text-base! tracking-widest uppercase text-[#1a1a1a]">
              Price
            </h3>
            <div className="px-1">
              {/* Range Input Styling */}
              <div className="relative mb-8 flex items-center">
                <DualRangeSlider />
              </div>

              {/* APPLY Button */}
              <button
                onClick={onClose}
                className="w-full bg-[#1c1c1c] text-white py-2 mt-10 text-xl font-bold tracking-[0.1em] uppercase hover:bg-black transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
