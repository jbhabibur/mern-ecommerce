import React from "react";
import {
  X,
  Phone,
  ShoppingBag,
  MapPin,
  Edit3,
  Loader2,
  Clock,
  CreditCard,
  Truck,
  User,
  ExternalLink,
  Package,
} from "lucide-react";

export const OrderActionModal = ({
  isOpen,
  onClose,
  order,
  newStatus,
  setNewStatus,
  internalNote,
  setInternalNote,
  isUpdating,
  onSave,
}) => {
  if (!isOpen || !order) return null;

  const statusColors = {
    "Order Placed":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Confirmed:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    Shipped:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Delivered:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl bg-theme-base border border-theme-line rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-line bg-theme-sub/20">
          <div className="flex items-center gap-3">
            <div className="bg-theme-act/10 p-2 rounded-lg text-theme-act">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-theme-front flex items-center gap-2">
                Order #{order._id?.slice(-8).toUpperCase()}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.orderStatus] || "bg-theme-line"}`}
                >
                  {order.orderStatus}
                </span>
              </h2>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-theme-muted">
                <span className="flex items-center gap-1">
                  <Clock size={12} />{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard size={12} />{" "}
                  {order.payment?.method?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-sub rounded-md text-theme-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Customer & Shipping */}
            <div className="space-y-6">
              <section>
                <h4 className="text-[11px] font-bold text-theme-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={14} /> Customer Information
                </h4>
                <div className="p-4 border border-theme-line rounded-lg bg-theme-sub/10">
                  <p className="font-semibold text-theme-front">
                    {order.billingAddress?.fullName}
                  </p>
                  <p className="text-sm text-theme-muted mt-1">
                    {order.customer?.email}
                  </p>
                  <a
                    href={`tel:${order.billingAddress?.phoneNumber}`}
                    className="mt-3 flex items-center justify-center gap-2 w-full py-2 bg-theme-base border border-theme-line rounded-md text-sm font-medium hover:bg-theme-sub transition-colors"
                  >
                    <Phone size={14} /> {order.billingAddress?.phoneNumber}
                  </a>
                </div>
              </section>

              <section>
                <h4 className="text-[11px] font-bold text-theme-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin size={14} /> Shipping Address
                </h4>
                <div className="p-4 border border-theme-line rounded-lg">
                  <p className="text-sm leading-relaxed text-theme-front">
                    {order.billingAddress?.address ||
                      order.billingAddress?.houseAddress}
                    <br />
                    {order.billingAddress?.city}, {order.billingAddress?.zone}
                  </p>
                  <div className="mt-2 text-[10px] font-medium text-theme-act uppercase bg-theme-act/5 inline-block px-2 py-0.5 rounded">
                    Type: {order.billingAddress?.label || "Home"}
                  </div>
                </div>
              </section>
            </div>

            {/* Column 2: Items & Financials */}
            <div className="lg:col-span-1 space-y-6">
              <section>
                <h4 className="text-[11px] font-bold text-theme-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShoppingBag size={14} /> Order Items ({order.items?.length})
                </h4>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-2 border border-theme-line rounded-lg items-center"
                    >
                      <img
                        src={item.image}
                        className="w-12 h-12 rounded object-cover bg-theme-sub"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-front truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-theme-muted">
                          Qty: {item.quantity} • Size: {item.size}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        ৳{item.priceAtCheckout}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-4 bg-theme-front text-theme-base rounded-lg">
                <div className="flex justify-between items-center mb-2 opacity-80 text-xs">
                  <span>Subtotal</span>
                  <span>
                    ৳{order.financials?.subtotal || order.priceAtCheckout}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-theme-base/20">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-lg font-bold">
                    ৳{order.financials?.subtotal || order.priceAtCheckout}
                  </span>
                </div>
              </section>
            </div>

            {/* Column 3: Actions */}
            <div className="space-y-6">
              <section className="p-5 bg-theme-sub/30 border border-theme-line rounded-xl">
                <h4 className="text-[11px] font-bold text-theme-muted uppercase tracking-wider mb-4">
                  Update Workflow
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-theme-muted mb-1.5 block">
                      Logistic Status
                    </label>
                    <div className="relative">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full bg-theme-base border border-theme-line p-2.5 rounded-lg text-sm font-medium appearance-none focus:ring-2 focus:ring-theme-act/20 outline-none"
                      >
                        {[
                          "Order Placed",
                          "Confirmed",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <Truck
                        size={14}
                        className="absolute right-3 top-3 text-theme-muted pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-theme-muted mb-1.5 block">
                      Internal Audit Note
                    </label>
                    <textarea
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add staff remarks..."
                      className="w-full bg-theme-base border border-theme-line p-3 rounded-lg text-sm h-32 resize-none focus:ring-2 focus:ring-theme-act/20 outline-none"
                    />
                  </div>

                  <button
                    onClick={onSave}
                    disabled={isUpdating}
                    className="w-full bg-theme-act text-theme-actfg font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
