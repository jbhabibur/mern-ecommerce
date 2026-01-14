import { X } from "lucide-react";

export const FilterSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* 1. Mobile Overlay: Filter open thakle pichon-ta kalo hobe */}
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
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h2 className="font-bold text-sm tracking-widest uppercase">
            Filters
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="sticky top-4 space-y-8">
          {/* CATEGORIES */}
          <div>
            <h3 className="font-bold border-b pb-2 mb-4 text-sm! tracking-wider uppercase">
              CATEGORIES
            </h3>
            {/* Category list items here */}
            <div className="text-xs text-gray-500 italic">
              No categories added...
            </div>
          </div>

          {/* AVAILABILITY */}
          <div>
            <h3 className="font-bold border-b pb-2 mb-4 text-sm! tracking-wider uppercase">
              AVAILABILITY
            </h3>
            <div className="space-y-2">
              <div className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-3">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-x-2">
                      <input type="checkbox" className="w-4 h-4 accent-black" />
                      <span className="text-sm text-gray-600 hover:text-black transition-colors">
                        In Stock (204)
                      </span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <div className="flex items-center gap-x-2">
                      <input type="checkbox" className="w-4 h-4 accent-black" />
                      <span className="text-sm text-gray-600 hover:text-black transition-colors">
                        Out Of Stock (70)
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div>
            <h3 className="font-bold border-b pb-2 mb-4 text-sm! tracking-wider uppercase">
              PRICE
            </h3>
            <div className="px-1">
              <div className="h-1 w-full bg-gray-200 rounded-lg relative mb-6">
                <div className="absolute h-1 bg-black w-full rounded-lg"></div>
                <div className="absolute -top-1 left-0 w-3 h-3 bg-black rounded-full border-2 border-white shadow cursor-pointer"></div>
                <div className="absolute -top-1 right-0 w-3 h-3 bg-black rounded-full border-2 border-white shadow cursor-pointer"></div>
              </div>
              <div className="flex justify-between mt-3 text-xs font-medium">
                <div className="border p-2 w-20 text-center">৳ 0</div>
                <div className="border p-2 w-20 text-center">৳ 2490</div>
              </div>
              <button className="w-full bg-[#222] text-white py-3 mt-6! text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all active:scale-[0.98]">
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
