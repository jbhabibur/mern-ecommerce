import { Package, X, Eye, BarChart3, Star, Layers } from "lucide-react";
import { DetailRow } from "./DetailRow";

export const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  const totalStock =
    product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  const estimatedRevenue =
    (product.analytics?.totalSales || 0) * (product.price || 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-theme-sub w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-theme-line">
        {/* HEADER */}
        <div className="sticky top-0 bg-theme-sub/90 backdrop-blur-md p-6 border-b border-theme-line flex justify-between items-center">
          <h2 className="text-xl font-bold text-theme-front flex items-center gap-2">
            <Package size={20} className="text-theme-act" />
            Product Intelligence
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-base rounded-full transition text-theme-muted"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* PRODUCT HERO */}
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={product.images?.[0]?.url}
              className="w-44 h-44 rounded-2xl object-cover border border-theme-line"
              alt={product.name}
            />

            <div className="flex-1 space-y-3">
              <span className="px-3 py-1 bg-theme-act/10 text-theme-act text-xs font-bold uppercase rounded-lg">
                {product.itemType}
              </span>

              <h3 className="text-3xl font-black text-theme-front leading-tight">
                {product.name}
              </h3>

              <p className="text-theme-muted font-mono text-xs">
                {product.slug}
              </p>

              <div className="flex gap-8 pt-2 text-sm">
                <div>
                  <p className="text-theme-muted">Price</p>
                  <p className="font-bold text-theme-front">
                    {product.currency} {product.price}
                  </p>
                </div>

                <div>
                  <p className="text-theme-muted">Total Stock</p>
                  <p className="font-bold text-theme-front">{totalStock}</p>
                </div>

                <div>
                  <p className="text-theme-muted">Fabric</p>
                  <p className="font-bold text-theme-front">
                    {product.fabric || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-theme-base border border-theme-line p-4 rounded-xl">
              <p className="text-xs text-theme-muted flex items-center gap-1">
                <BarChart3 size={14} />
                Sales
              </p>

              <p className="text-xl font-bold text-theme-front">
                {product.analytics?.totalSales || 0}
              </p>
            </div>

            <div className="bg-theme-base border border-theme-line p-4 rounded-xl">
              <p className="text-xs text-theme-muted flex items-center gap-1">
                <Eye size={14} />
                Views
              </p>

              <p className="text-xl font-bold text-theme-front">
                {product.analytics?.totalViews || 0}
              </p>
            </div>

            <div className="bg-theme-base border border-theme-line p-4 rounded-xl">
              <p className="text-xs text-theme-muted flex items-center gap-1">
                <Star size={14} />
                Rating
              </p>

              <p className="text-xl font-bold text-theme-front">
                {product.analytics?.averageRating || 0}
              </p>
            </div>

            <div className="bg-theme-base border border-theme-line p-4 rounded-xl">
              <p className="text-xs text-theme-muted flex items-center gap-1">
                <Layers size={14} />
                Variants
              </p>

              <p className="text-xl font-bold text-theme-front">
                {product.variants?.length || 0}
              </p>
            </div>
          </div>

          {/* REVENUE CARD */}
          <div className="bg-theme-base border border-theme-line p-5 rounded-xl">
            <p className="text-xs text-theme-muted uppercase tracking-wider">
              Estimated Revenue
            </p>

            <p className="text-2xl font-black text-theme-front">
              {product.currency} {estimatedRevenue}
            </p>
          </div>

          {/* SPECIFICATIONS */}
          <section>
            <h4 className="text-xs font-black text-theme-act uppercase mb-4 tracking-widest">
              Specifications
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              <DetailRow label="Color" value={product.color} />

              <DetailRow label="Fabric" value={product.fabric} />

              <DetailRow label="Currency" value={product.currency} />

              <DetailRow label="Category" value={product.category?.name} />

              <DetailRow
                label="Subcategory"
                value={product.subcategory?.name}
              />
            </div>
          </section>

          {/* INVENTORY */}
          <section>
            <h4 className="text-xs font-black text-theme-act uppercase mb-4 tracking-widest">
              Inventory Sizes
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.variants?.map((v, i) => (
                <div
                  key={i}
                  className="bg-theme-base p-4 rounded-xl border border-theme-line text-center"
                >
                  <p className="text-[10px] text-theme-muted uppercase font-bold">
                    Size {v.size}
                  </p>

                  <p className="text-2xl font-black text-theme-front">
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
