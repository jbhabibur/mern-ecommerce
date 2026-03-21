import React from "react";
import {
  ShoppingBag,
  Edit3,
  PhoneCall,
  ArrowRight,
  Mail,
  Calendar,
} from "lucide-react";

// Components
import { OrderActionModal } from "../../../components/OrderActionModal";

// Hooks - AllOrders er moto same hooks use kora hoyeche
import { useOrderActions } from "../../../hooks/useOrderActions";
import { useGetOrdersQuery } from "../../../redux/service/adminOrderApi";

// Utils
import { hasAccess } from "../../../utils/authUtils";

const getStatusStyles = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "order placed":
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    case "confirmed":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "shipped":
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case "delivered":
      return "bg-theme-success/10 text-theme-success border-theme-success/20";
    case "cancelled":
      return "bg-theme-error/10 text-theme-error border-theme-error/20";
    default:
      return "bg-theme-sub text-theme-muted border-theme-line";
  }
};

export const RecentActivity = () => {
  // 1. Data Fetching (Limit 8 rakha hoyeche recent activity jonno)
  const { data, isLoading, isError } = useGetOrdersQuery({ limit: 8 });
  const orders = data?.orders || [];

  // 2. Action Hooks (AllOrders theke copy kora logic)
  const {
    selectedOrder,
    isModalOpen,
    newStatus,
    setNewStatus,
    internalNote,
    setInternalNote,
    isUpdating,
    openModal,
    closeModal,
    handleSaveChanges,
  } = useOrderActions();

  // 3. Permission Check
  const canManage = hasAccess("super-admin", "manager");

  if (isLoading) {
    return (
      <div className="bg-theme-sub border border-theme-line rounded-3xl p-8 space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-theme-line rounded-full" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 w-full bg-theme-base/50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-theme-sub border border-theme-line rounded-3xl text-theme-error text-[10px] font-black uppercase tracking-widest text-center">
        Sync Error: Unable to fetch live logs
      </div>
    );
  }

  return (
    <>
      <div className="bg-theme-sub border border-theme-line rounded-3xl overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="px-6 py-5 flex justify-between items-center border-b border-theme-line bg-theme-sub/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-theme-act/10 rounded-2xl">
              <ShoppingBag size={18} className="text-theme-act" />
            </div>
            <div>
              <h3 className="text-sm font-black text-theme-front tracking-tight uppercase">
                Recent Activity
              </h3>
              <p className="text-[10px] text-theme-muted font-bold tracking-tight opacity-70 uppercase">
                Latest 8 transactions
              </p>
            </div>
          </div>
          <button className="group flex items-center gap-2 text-[10px] font-black text-theme-muted hover:text-theme-act transition-all uppercase tracking-[0.15em]">
            View Archive{" "}
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-theme-base/20 border-b border-theme-line">
              <tr className="text-[10px] font-black text-theme-muted uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-line/30">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="group hover:bg-theme-base/60 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] text-theme-act font-black uppercase tracking-tighter">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-[9px] text-theme-muted mt-0.5 flex items-center gap-1 font-bold">
                        <Calendar size={10} />{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-theme-front uppercase tracking-tighter">
                        {order.billingAddress?.fullName || "Guest"}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] text-theme-muted font-bold lowercase">
                        <Mail size={10} /> {order.customer?.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-theme-front">
                        ৳{" "}
                        {(
                          order.financials?.totalAmount ||
                          order.totalAmount ||
                          0
                        ).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-theme-muted">
                        {order.payment?.method || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border whitespace-nowrap ${getStatusStyles(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canManage ? (
                      <button
                        onClick={() => openModal(order)}
                        className={`p-2 rounded-xl border transition-all active:scale-95 ${
                          order.payment?.method === "cod" &&
                          order.orderStatus === "Order Placed"
                            ? "bg-theme-act text-theme-actfg border-transparent shadow-lg shadow-theme-act/20"
                            : "bg-theme-sub text-theme-front border-theme-line hover:bg-theme-line"
                        }`}
                      >
                        {order.payment?.method === "cod" &&
                        order.orderStatus === "Order Placed" ? (
                          <PhoneCall size={14} />
                        ) : (
                          <Edit3 size={14} />
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] text-theme-muted font-bold uppercase opacity-50">
                        View Only
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal - AllOrders er moto props pass kora hoyeche */}
      <OrderActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        internalNote={internalNote}
        setInternalNote={setInternalNote}
        isUpdating={isUpdating}
        onSave={handleSaveChanges}
      />
    </>
  );
};
