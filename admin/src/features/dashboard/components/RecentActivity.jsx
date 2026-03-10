import React from "react";
import {
  ShoppingBag,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCcw,
  ArrowRight,
  Mail,
} from "lucide-react";
import { useGetOrdersQuery } from "../../../redux/service/adminOrderApi";

export const RecentActivity = () => {
  const { data, isLoading, isError } = useGetOrdersQuery({ limit: 8 });
  const orders = data?.orders || [];

  // Mapping based on your console: "Order Placed", etc.
  const statusConfig = {
    "order placed": {
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      icon: <Clock size={12} strokeWidth={2.5} />,
    },
    processing: {
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      icon: <RefreshCcw size={12} strokeWidth={2.5} />,
    },
    shipped: {
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      icon: <Truck size={12} strokeWidth={2.5} />,
    },
    delivered: {
      color: "text-theme-success",
      bg: "bg-theme-success/10",
      icon: <CheckCircle size={12} strokeWidth={2.5} />,
    },
    cancelled: {
      color: "text-theme-error",
      bg: "bg-theme-error/10",
      icon: <XCircle size={12} strokeWidth={2.5} />,
    },
  };

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
    <div className="bg-theme-sub border border-theme-line rounded-3xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-theme-line bg-theme-sub/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-act/10 rounded-2xl">
            <ShoppingBag size={18} className="text-theme-act" />
          </div>
          <div>
            <h3 className="text-sm font-black text-theme-front tracking-tight uppercase">
              Recent Activity
            </h3>
            <p className="text-[10px] text-theme-muted font-bold tracking-tight opacity-70">
              Real-time transaction stream
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-theme-base/20">
              <th className="px-6 py-4 text-[10px] font-black text-theme-muted uppercase tracking-widest">
                Order ID
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-theme-muted uppercase tracking-widest">
                Customer
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-theme-muted uppercase tracking-widest">
                Amount
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-theme-muted uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-theme-muted uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-line/30">
            {orders.length > 0 ? (
              orders.map((order) => {
                // Using orderStatus from your image
                const currentStatus =
                  order.orderStatus?.toLowerCase() || "pending";
                const status =
                  statusConfig[currentStatus] || statusConfig["order placed"];

                return (
                  <tr
                    key={order._id}
                    className="group hover:bg-theme-base/60 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold text-theme-front font-mono tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-black text-theme-front uppercase tracking-tighter">
                          {order.shippingAddress?.fullName || "Anonymous"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] text-theme-muted font-bold">
                          <Mail size={10} className="opacity-50" />
                          <span className="lowercase">
                            {order.customer?.email || "no-email"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-theme-front tracking-tighter">
                        ৳{" "}
                        {(
                          order.financials?.totalAmount ||
                          order.totalAmount ||
                          0
                        ).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${status.bg} ${status.color}`}
                      >
                        {status.icon} {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-theme-base border border-theme-line text-theme-muted hover:text-theme-act hover:border-theme-act/30 hover:shadow-sm transition-all">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <span className="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] opacity-40">
                    No records found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
