import React from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { useCategories } from "./hooks/useCategories";

export const CategoriesManager = () => {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    isFetching,
    pendingId,
    loadCategories,
    handleToggle,
  } = useCategories();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-theme-base">
        <Loader2 className="w-12 h-12 animate-spin text-theme-act" />
        <p className="mt-6 text-theme-muted font-black uppercase tracking-widest text-xs">
          Syncing Catalog...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <AlertCircle className="w-10 h-10 text-theme-error mb-4" />
        <h3 className="text-xl font-black text-theme-front">
          System Sync Error
        </h3>
        <button
          onClick={() => loadCategories()}
          className="mt-6 px-8 py-3 bg-theme-act text-theme-actfg rounded-2xl font-bold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-theme-base min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
              Catalog Visibility
            </h1>
            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
              GLOBAL STOREFRONT NAVIGATION & CATEGORY SCOPE
            </p>
          </div>

          <button
            onClick={() => loadCategories(false)}
            disabled={isFetching}
            className="group flex items-center gap-3 px-6 py-3 bg-theme-sub border border-theme-line rounded-2xl hover:border-theme-act transition-all"
          >
            <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
            <span className="text-sm font-black uppercase">Refresh Grid</span>
          </button>
        </header>

        {/* SEARCH BAR */}
        <div className="w-full">
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-theme-act transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Filter catalog by name..."
              className="w-full bg-theme-sub border border-theme-line rounded-[1.5rem] py-5 pl-14 pr-6 text-lg text-theme-front placeholder:text-theme-muted focus:ring-4 focus:ring-theme-act/10 focus:border-theme-act outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRID SYSTEM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              cat={cat}
              isPending={pendingId === cat._id}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-theme-line rounded-[2rem]">
            <p className="text-theme-muted font-bold uppercase tracking-widest text-sm">
              No Categories Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryCard = ({ cat, isPending, onToggle }) => {
  const isActive = cat.showInCategories;
  const thumbnailImg = cat.thumbnail || cat.bannerImage;

  return (
    <div
      className={`group relative bg-theme-sub rounded-[2rem] border-2 transition-all duration-500 ${
        isActive
          ? "border-theme-act/20 shadow-lg shadow-theme-act/5"
          : "grayscale opacity-60 border-transparent"
      }`}
    >
      <div className="aspect-[4/3] relative overflow-hidden rounded-t-[2rem]">
        {thumbnailImg ? (
          <img
            src={thumbnailImg}
            alt={cat.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-theme-base">
            <ImageIcon size={40} className="opacity-20" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-black text-theme-front truncate group-hover:text-theme-act transition-colors">
          {cat.name}
        </h3>
        <button
          disabled={isPending}
          onClick={() => onToggle(cat._id)}
          className={`w-full mt-4 py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
            isActive
              ? "bg-theme-act text-theme-actfg shadow-md shadow-theme-act/20"
              : "bg-theme-base border border-theme-line text-theme-muted hover:text-theme-front"
          }`}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isActive ? (
            <>
              <Eye size={16} /> Take Down
            </>
          ) : (
            <>
              <EyeOff size={16} /> Show In Shop
            </>
          )}
        </button>
      </div>
    </div>
  );
};
