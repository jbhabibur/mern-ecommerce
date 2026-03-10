import React from "react";
import {
  X,
  Phone,
  ShoppingBag,
  MapPin,
  Edit3,
  PhoneCall,
  Loader2,
  Clock,
  CreditCard,
  Truck,
  User,
  Hash,
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

  const isCOD = order.payment?.method === "cod";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-theme-base border border-theme-line rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 bg-theme-sub/40 border-b border-theme-line">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${isCOD ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}
            >
              {isCOD ? <PhoneCall size={22} /> : <Edit3 size={22} />}
            </div>
            <div>
              <h3 className="font-black text-theme-front uppercase text-sm tracking-tighter">
                Manage Order #{order._id?.slice(-8).toUpperCase()}
              </h3>
              <p className="text-[10px] text-theme-muted font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Placed on{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-theme-line rounded-full transition-colors text-theme-muted"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Information (Col 7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Customer Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-theme-sub/30 p-5 rounded-3xl border border-theme-line relative overflow-hidden group">
                  <div className="flex items-center gap-2 text-theme-act font-black uppercase text-[10px] tracking-widest mb-3">
                    <User size={14} /> Customer Profile
                  </div>
                  <p className="font-bold text-theme-front text-lg">
                    {order.billingAddress?.fullName}
                  </p>
                  <p className="text-xs text-theme-muted mb-3 italic">
                    {order.customer?.email}
                  </p>
                  <a
                    href={`tel:${order.billingAddress?.phoneNumber}`}
                    className="inline-flex items-center gap-2 bg-theme-act text-theme-actfg px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform"
                  >
                    <Phone size={14} /> Call Customer
                  </a>
                </section>

                <section className="bg-theme-sub/30 p-5 rounded-3xl border border-theme-line">
                  <div className="flex items-center gap-2 text-theme-act font-black uppercase text-[10px] tracking-widest mb-3">
                    <MapPin size={14} /> Shipping Destination
                  </div>
                  <p className="text-xs text-theme-front font-bold leading-relaxed">
                    {order.billingAddress?.address ||
                      order.billingAddress?.houseAddress}
                    ,<br />
                    {order.billingAddress?.city}, {order.billingAddress?.zone}
                  </p>
                  <span className="mt-2 inline-block px-2 py-1 bg-theme-line rounded-md text-[9px] font-black uppercase text-theme-muted">
                    Label: {order.billingAddress?.label || "Home"}
                  </span>
                </section>
              </div>

              {/* 2. Order Breakdown */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-theme-line pb-2">
                  <div className="flex items-center gap-2 text-theme-act font-black uppercase text-[10px] tracking-widest">
                    <ShoppingBag size={14} /> Cart Summary (
                    {order.items?.length})
                  </div>
                </div>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-theme-sub/20 rounded-2xl border border-theme-line/40 hover:border-theme-act/30 transition-colors"
                    >
                      <img
                        src={item.image}
                        className="w-16 h-16 rounded-xl object-cover border border-theme-line shadow-sm"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-theme-front truncate">
                          {item.name}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-theme-line px-2 py-0.5 rounded font-bold">
                            Size: {item.size}
                          </span>
                          <span className="text-[10px] bg-theme-line px-2 py-0.5 rounded font-bold">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-theme-front">
                          ৳{item.priceAtCheckout || order.financials?.subtotal}
                        </p>
                        <p className="text-[9px] text-theme-muted font-bold uppercase">
                          Unit Price
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Financial Summary */}
              <section className="bg-theme-front text-theme-base p-6 rounded-[2rem] shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-black opacity-60">
                      Payment via
                    </p>
                    <p className="text-sm font-bold flex items-center gap-2 capitalize">
                      <CreditCard size={14} /> {order.payment?.method} (
                      {order.payment?.status})
                    </p>
                  </div>
                  <div className="text-right border-l border-theme-base/20 pl-4">
                    <p className="text-[10px] uppercase font-black opacity-60">
                      Total Bill
                    </p>
                    <p className="text-2xl font-black">
                      ৳{order.financials?.subtotal || order.priceAtCheckout}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Admin Actions (Col 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-theme-sub p-6 rounded-[2rem] border-2 border-theme-line space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest flex items-center gap-2">
                    <Truck size={14} className="text-theme-act" /> Logistic
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-theme-base border-2 border-theme-line p-4 rounded-2xl text-sm font-bold text-theme-front focus:border-theme-act outline-none transition-all appearance-none cursor-pointer hover:bg-theme-sub/50"
                  >
                    {[
                      "Order Placed",
                      "Confirmed",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest flex items-center gap-2">
                    <Edit3 size={14} className="text-theme-act" /> Internal
                    Audit Note
                  </label>
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="E.g., Customer confirmed on call, requested delivery after 4PM..."
                    className="w-full bg-theme-base border-2 border-theme-line p-4 rounded-2xl text-sm h-48 resize-none focus:border-theme-act outline-none transition-all"
                  />
                  <p className="text-[9px] text-theme-muted font-medium px-2">
                    * This note is only visible to staff members.
                  </p>
                </div>

                <button
                  onClick={onSave}
                  disabled={isUpdating}
                  className="w-full bg-theme-act text-theme-actfg font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-theme-act/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Update Order Lifecycle</>
                  )}
                </button>
              </div>

              {/* Quick Status History (Optional/Visual) */}
              <div className="px-4">
                <h4 className="text-[10px] font-black text-theme-muted uppercase tracking-widest mb-4">
                  Workflow Progress
                </h4>
                <div className="flex justify-between items-center relative">
                  <div className="absolute h-[2px] bg-theme-line w-full top-1/2 -translate-y-1/2 z-0" />
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full border-2 border-theme-base z-10 ${order.orderStatus === "Delivered" ? "bg-theme-success" : "bg-theme-line"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
