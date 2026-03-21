import React from "react";
import {
  Upload,
  Trash2,
  XCircle,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Search,
  Lock,
} from "lucide-react";
import { useCarouselManager } from "./hooks/useCarouselManager";
import { hasAccess } from "../../utils/authUtils"; // Import auth utility

export const CarouselManager = () => {
  const {
    filteredCategories,
    isLoading,
    isFetching,
    uploadingId,
    searchTerm,
    setSearchTerm,
    refetch,
    handleImageChange,
    toggleCarousel,
    removeImage,
    stats,
  } = useCarouselManager();

  // --- Permission Check ---
  const canModify = hasAccess("super-admin", "manager");

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-theme-base">
        <Loader2 className="animate-spin text-theme-act" size={48} />
      </div>
    );

  return (
    <div className="min-h-screen bg-theme-base text-theme-front p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
              Hero Carousel
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] opacity-70">
                Active Carousel Selection & Display Priority
              </p>
              <span className="h-1 w-1 rounded-full bg-theme-line" />
              <p className="text-[10px] text-theme-act uppercase font-black tracking-[0.2em]">
                {stats.active} Active / {stats.total} Total
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-theme-sub px-6 py-3 rounded-2xl border border-theme-line hover:border-theme-act transition-all font-bold text-theme-muted hover:text-theme-front shadow-sm group"
          >
            <RefreshCw
              size={18}
              className={`${isFetching ? "animate-spin" : ""} group-hover:rotate-180 transition-transform duration-500`}
            />
            Sync Content
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
              placeholder="Search by category name..."
              className="w-full bg-theme-sub border border-theme-line rounded-[1.5rem] py-5 pl-14 pr-6 text-lg text-theme-front placeholder:text-theme-muted focus:ring-4 focus:ring-theme-act/10 focus:border-theme-act outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRID SYSTEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="group bg-theme-sub rounded-[2.5rem] border border-theme-line overflow-hidden hover:shadow-2xl hover:border-theme-act/30 transition-all duration-300 flex flex-col"
            >
              {/* Image Area */}
              <div className="relative h-64 bg-theme-base/50 overflow-hidden">
                {cat.carouselImage ? (
                  <img
                    src={cat.carouselImage}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!cat.showInCarousel && "opacity-40 grayscale"}`}
                    alt={cat.name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-theme-muted italic">
                    <ImageIcon
                      size={56}
                      strokeWidth={1}
                      className="mb-3 opacity-10"
                    />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                      No Media Linked
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-10">
                  {cat.showInCarousel ? (
                    <span className="bg-theme-success text-theme-success-fg text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />{" "}
                      ACTIVE
                    </span>
                  ) : (
                    <span className="bg-theme-base/80 backdrop-blur-md text-theme-muted text-[10px] font-black px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-theme-line">
                      <XCircle size={14} /> INACTIVE
                    </span>
                  )}
                </div>

                {/* Upload Overlay - Only if canModify */}
                {canModify ? (
                  <label className="absolute inset-0 bg-theme-act/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[3px] z-20">
                    <div className="bg-theme-act text-theme-actfg p-5 rounded-3xl shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-300">
                      {uploadingId === cat._id ? (
                        <Loader2 className="animate-spin" size={32} />
                      ) : (
                        <Upload size={32} />
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, cat._id)}
                    />
                  </label>
                ) : (
                  <div className="absolute top-6 left-6 z-10">
                    <div className="bg-theme-base/40 backdrop-blur-sm p-2 rounded-xl border border-theme-line text-theme-muted">
                      <Lock size={14} />
                    </div>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-theme-front truncate group-hover:text-theme-act transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] bg-theme-base text-theme-muted px-2 py-1 rounded font-mono border border-theme-line uppercase tracking-widest font-bold">
                      SLUG: {cat.slug}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-4">
                  <button
                    onClick={() => toggleCarousel(cat._id, cat.showInCarousel)}
                    // Disabled if not authorized
                    disabled={!canModify}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                      cat.showInCarousel
                        ? "bg-theme-error/10 text-theme-error border border-theme-error/20 hover:bg-theme-error hover:text-white"
                        : "bg-theme-act text-theme-actfg hover:brightness-110 shadow-lg shadow-theme-act/20"
                    }`}
                  >
                    {!canModify && <Lock size={12} />}
                    {cat.showInCarousel ? "Take Down" : "Push to Home"}
                  </button>

                  {cat.carouselImage && canModify && (
                    <button
                      onClick={() => removeImage(cat._id)}
                      className="p-4 rounded-2xl bg-theme-base text-theme-muted border border-theme-line hover:text-theme-error hover:border-theme-error hover:bg-theme-error/5 transition-all active:scale-95"
                      title="Remove Media"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="py-32 text-center bg-theme-sub rounded-[3rem] border-2 border-dashed border-theme-line">
            <Search
              size={64}
              className="mx-auto text-theme-line mb-6 opacity-20"
            />
            <h3 className="text-xl font-black text-theme-muted uppercase tracking-widest">
              No matches for "{searchTerm}"
            </h3>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-theme-act font-bold uppercase text-xs tracking-widest hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
