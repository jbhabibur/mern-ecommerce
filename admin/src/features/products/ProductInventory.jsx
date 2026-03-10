import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { fetchPaginatedProducts } from "./services/productApi";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  LayoutGrid,
  List,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Package,
  ShoppingCart,
  AlertTriangle,
  Archive,
  Eye,
  X,
  Save,
} from "lucide-react";

// ==========================================
// 1. REUSABLE SUB-COMPONENTS
// ==========================================

const SummaryCard = ({
  icon: Icon,
  title,
  value,
  color,
  cardBg,
  textColor,
  mutedColor,
}) => (
  <div
    className={`p-5 rounded-2xl ${cardBg} border border-theme-line flex items-center gap-4 shadow-sm`}
  >
    <div
      className={`p-3 rounded-xl bg-theme-base border border-theme-line ${color}`}
    >
      <Icon size={24} />
    </div>
    <div>
      <p
        className={`text-[10px] font-black uppercase tracking-widest ${mutedColor}`}
      >
        {title}
      </p>
      <p className={`text-2xl font-black ${textColor}`}>
        {value?.toLocaleString()}
      </p>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 border-b border-theme-line/50 last:border-0">
    <span className="text-theme-muted text-sm font-medium">{label}</span>
    <span className="text-theme-front font-semibold text-sm">
      {value || "N/A"}
    </span>
  </div>
);

// ==========================================
// 2. MODAL COMPONENTS (Details & Edit)
// ==========================================

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;
  const totalStock =
    product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-theme-sub w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-theme-line">
        <div className="sticky top-0 bg-theme-sub/90 backdrop-blur-md p-6 border-b border-theme-line flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-theme-front flex items-center gap-2">
            <Package size={20} className="text-theme-act" /> Product
            Intelligence
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-base rounded-full transition text-theme-muted"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={product.images?.[0]?.url}
              className="w-40 h-40 rounded-2xl object-cover border border-theme-line"
              alt=""
            />
            <div className="space-y-2">
              <span className="px-2 py-0.5 bg-theme-act/10 text-theme-act text-[10px] font-bold uppercase rounded">
                {product.itemType}
              </span>
              <h3 className="text-3xl font-black text-theme-front leading-tight">
                {product.name}
              </h3>
              <p className="text-theme-muted font-mono text-xs">
                {product.slug}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h4 className="text-xs font-black text-theme-act uppercase mb-4 tracking-widest">
                Specifications
              </h4>
              <DetailRow
                label="Price"
                value={`${product.currency} ${product.price}`}
              />
              <DetailRow label="Fabric" value={product.fabric} />
              <DetailRow label="Color" value={product.color} />
              <DetailRow label="Stock Status" value={`${totalStock} Total`} />
            </section>
            <section>
              <h4 className="text-xs font-black text-theme-act uppercase mb-4 tracking-widest">
                Analytics
              </h4>
              <DetailRow
                label="Total Sales"
                value={product.analytics?.totalSales}
              />
              <DetailRow
                label="Rating"
                value={`⭐ ${product.analytics?.averageRating}`}
              />
              <DetailRow label="Views" value={product.analytics?.totalViews} />
              <DetailRow
                label="Popularity"
                value={product.analytics?.popularityScore}
              />
            </section>
          </div>

          <section>
            <h4 className="text-xs font-black text-theme-act uppercase mb-4 tracking-widest">
              Inventory Sizes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.variants?.map((v, i) => (
                <div
                  key={i}
                  className="bg-theme-base p-3 rounded-xl border border-theme-line text-center"
                >
                  <p className="text-[10px] text-theme-muted uppercase font-bold">
                    Size {v.size}
                  </p>
                  <p className="text-lg font-black text-theme-front">
                    {v.stock}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ProductEditModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-theme-sub w-full max-w-lg rounded-3xl shadow-2xl border border-theme-line p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-theme-front mb-6 flex items-center gap-2">
          <Edit2 size={20} className="text-theme-act" /> Edit Product
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-theme-muted uppercase ml-1">
              Product Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mt-1 px-4 py-3 rounded-xl border border-theme-line bg-theme-base text-theme-front outline-none focus:ring-2 focus:ring-theme-act"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-theme-muted uppercase ml-1">
                Price ({formData.currency})
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 rounded-xl border border-theme-line bg-theme-base text-theme-front outline-none focus:ring-2 focus:ring-theme-act"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-theme-muted uppercase ml-1">
                Fabric
              </label>
              <input
                value={formData.fabric}
                onChange={(e) =>
                  setFormData({ ...formData, fabric: e.target.value })
                }
                className="w-full mt-1 px-4 py-3 rounded-xl border border-theme-line bg-theme-base text-theme-front outline-none focus:ring-2 focus:ring-theme-act"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-theme-line text-theme-front font-bold hover:bg-theme-base transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-3 rounded-xl bg-theme-act text-white font-bold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Update
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN INVENTORY COMPONENT
// ==========================================

export const ProductInventory = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'details' | 'edit' | null

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

  useEffect(() => {
    loadProducts();
  }, [currentPage, limit, searchTerm, stockFilter]);

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

  const handleUpdateProduct = async (updatedData) => {
    console.log("Saving to DB:", updatedData);
    // Add your API call here: await updateProductApi(updatedData._id, updatedData);
    setActiveModal(null);
    loadProducts();
  };

  const lowStockCount = products.filter((p) => {
    const s = getTotalStock(p.variants);
    return s > 0 && s <= 5;
  }).length;

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-theme-base min-h-screen text-theme-front">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Product Inventory
          </h1>
          <p className="text-theme-muted text-sm mt-1">
            Real-time stock management and analytics
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
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-theme-act text-white font-bold hover:opacity-90 shadow-lg shadow-theme-act/20 transition-all active:scale-95">
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
          cardBg="bg-theme-sub"
          textColor="text-theme-front"
          mutedColor="text-theme-muted"
        />
        <SummaryCard
          icon={ShoppingCart}
          title="Items Loaded"
          value={products.length}
          color="text-emerald-500"
          cardBg="bg-theme-sub"
          textColor="text-theme-front"
          mutedColor="text-theme-muted"
        />
        <SummaryCard
          icon={AlertTriangle}
          title="Low Stock"
          value={lowStockCount}
          color="text-amber-500"
          cardBg="bg-theme-sub"
          textColor="text-theme-front"
          mutedColor="text-theme-muted"
        />
        <SummaryCard
          icon={Archive}
          title="Out of Stock"
          value={products.filter((p) => getTotalStock(p.variants) <= 0).length}
          color="text-red-500"
          cardBg="bg-theme-sub"
          textColor="text-theme-front"
          mutedColor="text-theme-muted"
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
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-theme-base border border-theme-line text-theme-front focus:ring-2 focus:ring-theme-act outline-none"
            placeholder="Search by name, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="px-4 py-3 rounded-xl bg-theme-base border border-theme-line text-sm outline-none"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
          <select
            className="px-4 py-3 rounded-xl bg-theme-base border border-theme-line text-sm outline-none"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10 Per Page</option>
            <option value={25}>25 Per Page</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-theme-muted">
          <Loader2 className="animate-spin text-theme-act" size={40} />
          <p className="font-bold animate-pulse">Fetching Inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="h-64 border-2 border-dashed border-theme-line rounded-3xl flex flex-col items-center justify-center text-theme-muted">
          <Package size={48} className="mb-2 opacity-20" />
          <p>No products found matching filters.</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-theme-sub border border-theme-line rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.images?.[0]?.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setActiveModal("details");
                        }}
                        className="p-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white shadow-lg"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setActiveModal("edit");
                        }}
                        className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white shadow-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold line-clamp-1">{product.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-lg font-black text-theme-act">
                        {product.currency} {product.price}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStockStatus(getTotalStock(product.variants)).color}`}
                      >
                        {getStockStatus(getTotalStock(product.variants)).text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-theme-sub border border-theme-line rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-theme-base border-b border-theme-line text-theme-muted uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Fabric</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-line">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-theme-base/50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.url}
                          className="w-10 h-10 rounded-lg object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-sm line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-theme-muted font-mono">
                            {product._id.slice(-6)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-muted">
                        {product.fabric}
                      </td>
                      <td className="px-6 py-4 font-black text-theme-act">
                        {product.currency} {product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStockStatus(getTotalStock(product.variants)).color}`}
                        >
                          {getStockStatus(getTotalStock(product.variants)).text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setActiveModal("details");
                            }}
                            className="p-2 text-theme-muted hover:text-theme-act transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setActiveModal("edit");
                            }}
                            className="p-2 text-theme-muted hover:text-blue-500 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-theme-muted hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-theme-sub border border-theme-line rounded-2xl">
            <p className="text-sm text-theme-muted font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-theme-line hover:bg-theme-base disabled:opacity-30"
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-theme-line hover:bg-theme-base disabled:opacity-30"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals Container */}
      {activeModal === "details" && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "edit" && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdateProduct}
        />
      )}
    </div>
  );
};
