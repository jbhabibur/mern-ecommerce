import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";

export const InventoryView = ({
  viewMode,
  products,
  getTotalStock,
  getStockStatus,
  onView,
  onEdit,
  onDelete,
}) => {
  console.log(products);
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const totalStock = getTotalStock(product.variants);
          const status = getStockStatus(totalStock);
          return (
            <div
              key={product._id}
              className="bg-theme-sub border border-theme-line rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={
                    product.images?.[0]?.url ||
                    "https://via.placeholder.com/400x500"
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onView(product)}
                    className="p-3 bg-white text-black rounded-2xl hover:scale-110 transition-transform"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="p-3 bg-theme-act text-white rounded-2xl hover:scale-110 transition-transform"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg line-clamp-1">
                    {product.name}
                  </h3>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-theme-line">
                  <p className="text-xl font-black text-theme-act">
                    {product.currency} {product.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => onDelete(product)}
                    className="text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-theme-sub border border-theme-line rounded-[2rem] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-theme-base/50 border-b border-theme-line text-theme-muted uppercase text-[10px] font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">Product</th>
              <th className="px-6 py-6">Category</th>
              <th className="px-6 py-6">Stock Status</th>
              <th className="px-6 py-6">Price</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-line">
            {products.map((product) => {
              const totalStock = getTotalStock(product.variants);
              const status = getStockStatus(totalStock);
              return (
                <tr
                  key={product._id}
                  className="hover:bg-theme-base/30 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-theme-line">
                        <img
                          src={product.images?.[0]?.url}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-theme-act transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10px] font-mono text-theme-muted uppercase">
                          ID: {product._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase bg-theme-base px-3 py-1.5 rounded-full border border-theme-line">
                      {product.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-transparent! border whitespace-nowrap ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-theme-front tracking-tighter text-md!">
                    {product.currency} {product.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onView(product)}
                        className="p-2.5 text-theme-muted hover:text-theme-act hover:bg-theme-base rounded-xl transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2.5 text-theme-muted hover:text-blue-500 hover:bg-theme-base rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2.5 text-theme-muted hover:text-red-500 hover:bg-theme-base rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
