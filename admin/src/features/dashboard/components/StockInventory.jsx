import React, { useState, useMemo } from "react";
import {
  Search,
  AlertTriangle,
  BarChart2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStockAnalysis } from "../hooks/useStockAnalysis";

export const StockInventory = ({ cardStyle }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch paginated and sorted data
  const { data: response, isLoading, isError } = useStockAnalysis(currentPage);

  const products = response?.data || [];
  const totalPages = response?.totalPages || 1;

  // Filter logic for search and local status filtering
  const filteredItems = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (filter === "low") {
        return (
          matchSearch && p.variants.some((v) => v.stock > 0 && v.stock <= 5)
        );
      }
      if (filter === "out") {
        return matchSearch && p.variants.some((v) => v.stock === 0);
      }
      return matchSearch;
    });
  }, [searchTerm, filter, products]);

  // Helper function to generate page numbers with ellipsis (...)
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
              currentPage === i
                ? "bg-theme-act text-white shadow-md shadow-theme-act/20"
                : "bg-theme-base border border-theme-line text-theme-front hover:bg-theme-sub"
            }`}
          >
            {i}
          </button>,
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={i} className="px-1 text-theme-muted">
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div
        className={`${cardStyle} flex items-center justify-center min-h-[500px]`}
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-theme-act" size={24} />
          <p className="text-xs text-theme-muted font-medium">
            Analyzing Inventory...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`${cardStyle} flex items-center justify-center min-h-[500px]`}
      >
        <p className="text-xs text-theme-error font-bold">
          Failed to load stock data.
        </p>
      </div>
    );
  }

  return (
    <div className={`${cardStyle} flex flex-col min-h-[600px]`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="text-sm font-black flex items-center gap-2 text-theme-front uppercase">
          <BarChart2 size={16} className="text-theme-act" /> Stock Status
        </h3>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-theme-muted"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-theme-base border border-theme-line rounded-xl pl-8 pr-3 py-1.5 text-[11px] text-theme-front focus:outline-none focus:ring-1 focus:ring-theme-act"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-theme-base border border-theme-line rounded-xl px-2 py-1.5 text-[11px] text-theme-front focus:outline-none focus:ring-1 focus:ring-theme-act"
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Critical</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar max-h-[420px]">
        {filteredItems.length > 0 ? (
          filteredItems.map((product) => {
            const totalStock = product.totalStock;
            const stockPercentage = Math.min(
              (totalStock / (product.totalCapacity || 50)) * 100,
              100,
            );

            return (
              <div
                key={product.id}
                className="p-4 bg-theme-sub border border-theme-line rounded-2xl group hover:border-theme-act/30 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[11px] font-bold text-theme-front uppercase tracking-tight">
                    {product.name}
                  </p>
                  <span className="text-[10px] text-theme-muted font-bold">
                    {totalStock} Total
                  </span>
                </div>

                <div className="w-full h-1.5 bg-theme-line rounded-full mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stockPercentage < 20
                        ? "bg-theme-error"
                        : stockPercentage < 50
                          ? "bg-orange-500"
                          : "bg-theme-success"
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black border flex items-center gap-1.5 ${
                        v.stock === 0
                          ? "bg-theme-error/10 border-theme-error/20 text-theme-error"
                          : v.stock <= 5
                            ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                            : "bg-theme-base border-theme-line text-theme-muted"
                      }`}
                    >
                      {v.size}: {v.stock}
                      {v.stock <= 5 && <AlertTriangle size={10} />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center">
            <p className="text-xs text-theme-muted">
              No critical stock items found.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer (Based on your image) */}
      <div className="mt-6 pt-4 border-t border-theme-line flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-theme-base border border-theme-line rounded-lg disabled:opacity-20 hover:bg-theme-sub transition-colors"
          >
            <ChevronLeft size={14} className="text-theme-front" />
          </button>

          <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-theme-base border border-theme-line rounded-lg disabled:opacity-20 hover:bg-theme-sub transition-colors"
          >
            <ChevronRight size={14} className="text-theme-front" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold text-theme-muted">
          <span className="uppercase tracking-wider text-[10px]">Page</span>
          <div className="relative">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="appearance-none bg-theme-base border border-theme-line rounded-lg pl-3 pr-8 py-1.5 text-theme-front focus:outline-none focus:ring-1 focus:ring-theme-act cursor-pointer min-w-[60px]"
            >
              {[...Array(totalPages)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <ChevronRight
              size={10}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"
            />
          </div>
          <span className="uppercase tracking-wider text-[10px]">
            of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
};
