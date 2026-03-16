import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  fetchPaginatedProducts,
  deleteProduct,
  fetchInventoryStats,
} from "./services/productApi";
import {
  Plus,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Package,
  ShoppingCart,
  AlertTriangle,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Components
import { SummaryCard } from "./components/SummaryCard";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import { ProductEditModal } from "./components/ProductEditModal";
import { ProductAddModal } from "./ProductAddModal";
import { InventoryView } from "./components/InventoryView";

export const ProductInventory = () => {
  const { theme } = useTheme();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [inventorySummary, setInventorySummary] = useState({
    lowStock: 0,
    outOfStock: 0,
  });

  // Fetch Logic: Load all products
  const loadProducts = async () => {
    setLoading(true);
    const result = await fetchPaginatedProducts(
      currentPage,
      limit,
      searchTerm,
      stockFilter,
    );
    if (result.success) {
      setProducts(result.data);
      setTotalPages(result.totalPages);
      setTotalProductsCount(result.totalProducts);
    }
    setLoading(false);
  };

  // Fetch Logic: Load stats of out-of-stock and low-stock data
  const loadInventorySummary = async () => {
    const result = await fetchInventoryStats();
    if (result.success) {
      setInventorySummary({
        lowStock: result.data.lowStock,
        outOfStock: result.data.outOfStock,
      });
    }
  };

  useEffect(() => {
    loadProducts();
    loadInventorySummary();
  }, [currentPage, limit, searchTerm, stockFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, stockFilter]);

  // Helper Functions
  const getTotalStock = (variants) =>
    variants?.reduce((total, v) => total + (v.stock || 0), 0) || 0;

  const getStockStatus = (totalStock) => {
    if (totalStock <= 0)
      return {
        text: "Out of Stock",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    if (totalStock <= 5)
      return {
        text: `Low: ${totalStock}`,
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      };
    return {
      text: `${totalStock} In Stock`,
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedProduct(null);
  };

  // --- DYNAMIC PAGINATION RANGE (1 2 ... 11) ---
  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (product) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (isConfirmed) {
      try {
        const result = await deleteProduct(product._id);
        if (result.success) {
          setProducts((prev) => prev.filter((p) => p._id !== product._id));
          setTotalProductsCount((prev) => prev - 1);

          if (products.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            loadProducts(); // Reload to keep data in sync
          }
        } else {
          alert("Error: " + result.message);
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Something went wrong while deleting.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-theme-base min-h-screen text-theme-front transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
            Product Inventory
          </h1>
          <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
            MENS FASHION • Catalog Archive & Stock Control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-theme-sub border border-theme-line rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-theme-act text-white" : "text-theme-muted hover:bg-theme-base"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-theme-act text-white" : "text-theme-muted hover:bg-theme-base"}`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={() => setActiveModal("add")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-theme-act text-white font-bold hover:opacity-90 shadow-lg shadow-theme-act/20 transition-all active:scale-95"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          icon={Package}
          title="Total Products"
          value={totalProductsCount}
          color="text-blue-500"
        />
        <SummaryCard
          icon={ShoppingCart}
          title="Items Loaded"
          value={products.length}
          color="text-emerald-500"
        />
        <SummaryCard
          icon={AlertTriangle}
          title="Low Stock"
          value={inventorySummary.lowStock}
          color="text-amber-500"
        />
        <SummaryCard
          icon={Archive}
          title="Out of Stock"
          value={inventorySummary.outOfStock}
          color="text-red-500"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-theme-sub rounded-2xl border border-theme-line flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted"
            size={18}
          />
          <input
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-theme-base border border-theme-line text-theme-front focus:ring-2 focus:ring-theme-act outline-none font-medium"
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-3 rounded-xl bg-theme-base border border-theme-line text-sm outline-none cursor-pointer font-bold"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="inStock">In Stock</option>
          <option value="lowStock">Low Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-theme-muted">
          <Loader2 className="animate-spin text-theme-act" size={40} />
          <p className="font-bold animate-pulse uppercase tracking-widest">
            Syncing Inventory...
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
          <InventoryView
            viewMode={viewMode}
            products={products}
            getTotalStock={getTotalStock}
            getStockStatus={getStockStatus}
            onView={(p) => {
              setSelectedProduct(p);
              setActiveModal("details");
            }}
            onEdit={(p) => {
              setSelectedProduct(p);
              setActiveModal("edit");
            }}
            onDelete={handleDelete}
          />

          {/* --- ADVANCED PAGINATION BAR --- */}
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-theme-line pt-8">
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-lg border border-theme-line hover:bg-theme-sub disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {getPaginationRange().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      typeof page === "number" && setCurrentPage(page)
                    }
                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${page === currentPage ? "bg-theme-act text-white shadow-xl scale-110" : page === "..." ? "cursor-default text-theme-muted" : "hover:bg-theme-sub border border-theme-line text-theme-muted"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg border border-theme-line hover:bg-theme-sub disabled:opacity-20 transition-all active:scale-90"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest">
                  Page
                </span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="bg-theme-sub border border-theme-line rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-1 focus:ring-theme-act"
                >
                  {[...Array(totalPages)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest">
                  of {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === "add" && (
        <ProductAddModal
          isOpen={true}
          onClose={handleModalClose}
          onSuccess={() => {
            handleModalClose();
            loadProducts();
          }}
        />
      )}
      {activeModal === "edit" && (
        <ProductEditModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSave={loadProducts}
        />
      )}
      {activeModal === "details" && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
