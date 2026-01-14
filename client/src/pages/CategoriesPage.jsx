import React, { useState } from "react";
import { Filter } from "lucide-react";

// Atom/Shared Components
import { Breadcrumb } from "../components/atoms/Breadcrumb.jsx";
import { FilterSidebar } from "../components/shared/FilterSidebar.jsx";
import { CategoriesPageBanner } from "../components/atoms/CategoriesPageBanner.jsx";
import { TitleAndDescription } from "../components/atoms/TitleAndDescription.jsx";
import { SortDesktop } from "../components/shared/SortDesktop.jsx";
import { SortMobile } from "../components/shared/SortMobile.jsx";
import { ItemsPerPage } from "../components/shared/ItemsPerPage.jsx";
import { LoadMoreSection } from "../components/shared/LoadMoreSection.jsx";

// Sub-components
import { ViewToggle } from "../components/shared/ViewToggle.jsx";
import { CategoryProductCard } from "../components/shared/CategoryProductCard.jsx";

export const CategoriesPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState("grid2");

  const gridClasses = {
    list: "grid-cols-1",
    grid2: "grid-cols-2",
    grid3: "grid-cols-2 md:grid-cols-3",
    grid4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans text-gray-800">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Render FilterSidebar once. 
           It functions as a static sidebar on desktop via the 'aside' wrapper 
           and as a toggleable modal on mobile.
        */}
        <aside
          className={`${
            isFilterOpen ? "block" : "hidden"
          } md:block w-full md:w-64 lg:w-72 shrink-0`}
        >
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </aside>

        <main className="flex-1">
          <CategoriesPageBanner />
          <TitleAndDescription />

          {/* Controls Bar */}
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

          {/* Dynamic Product Grid */}
          <div
            className={`grid ${gridClasses[view]} gap-x-4 gap-y-8 md:gap-y-10 transition-all duration-300`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <CategoryProductCard key={item} view={view} />
            ))}
          </div>

          <div className="mt-12">
            <LoadMoreSection />
          </div>
        </main>
      </div>
    </div>
  );
};
