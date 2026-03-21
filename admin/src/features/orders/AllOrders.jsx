import React, { useState } from "react";
import {
  Edit3,
  AlertCircle,
  PhoneCall,
  Loader2,
  Search,
  ShoppingBag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";

// Components
import { OrderActionModal } from "../../components/OrderActionModal";

// Hooks
import { useOrderActions } from "../../hooks/useOrderActions";
import { useOrdersPagination } from "./hooks/useOrdersPagination";

// Utils
import { hasAccess } from "../../utils/authUtils";

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

export const AllOrders = () => {
  const [activeStatus, setActiveStatus] = useState("All");

  const filterOptions = [
    "All",
    "Order Placed",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // Pass activeStatus to pagination hook
  const {
    orders,
    pagination,
    currentPage,
    searchTerm,
    isLoading,
    isFetching,
    isError,
    error,
    handlePageChange,
    handleSearchChange,
  } = useOrdersPagination(8, activeStatus === "All" ? "" : activeStatus);

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

  const canManage = hasAccess("super-admin", "manager");

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center bg-theme-base">
        <Loader2 className="animate-spin text-theme-act" size={40} />
      </div>
    );

  if (isError)
    return (
      <div className="p-10 text-theme-error text-center bg-theme-base min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="mb-2" size={40} />
        <p className="font-bold">
          {error?.data?.message || "Something went wrong"}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-theme-base p-4 sm:p-8 text-theme-front">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Search */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">
              Orders Dashboard
            </h1>
            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
              REAL-TIME COMMERCE OPERATIONS & ORDER INSIGHTS
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Name, Phone, or #ID..."
              className="w-full bg-theme-sub border border-theme-line rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-1 focus:ring-theme-act outline-none transition-all"
              onChange={(e) => {
                const val = e.target.value;

                const cleanValue = val.startsWith("#") ? val.slice(1) : val;
                handleSearchChange(cleanValue);
              }}
              value={
                searchTerm
                  ? searchTerm.startsWith("#")
                    ? searchTerm
                    : `#${searchTerm}`
                  : ""
              }
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="text-theme-muted hover:text-theme-front transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              {isFetching && (
                <Loader2 className="animate-spin text-theme-act" size={14} />
              )}
            </div>
          </div>
        </header>

        {/* Status Filter Section */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 pr-4 border-r border-theme-line mr-2">
            <Filter size={14} className="text-theme-muted" />
            <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest">
              Filter:
            </span>
          </div>
          {filterOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveStatus(status);
                handlePageChange(1);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeStatus === status
                  ? "bg-theme-act text-theme-actfg border-transparent shadow-md shadow-theme-act/20 scale-105"
                  : "bg-theme-sub text-theme-muted border-theme-line hover:border-theme-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-theme-line bg-theme-base shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-theme-sub text-[10px] uppercase text-theme-muted font-black tracking-widest border-b border-theme-line">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-theme-line transition-opacity duration-300 ${
                  isFetching ? "opacity-40 pointer-events-none" : "opacity-100"
                }`}
              >
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-theme-sub/40 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-theme-act font-black uppercase">
                          #{order._id.slice(-8)}
                        </span>
                        <span className="text-[10px] text-theme-muted mt-1 flex items-center gap-1">
                          <Calendar size={10} />{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-theme-front">
                          {order.billingAddress?.fullName}
                        </span>
                        <span className="text-[11px] text-theme-muted">
                          {order.billingAddress?.phoneNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.items?.[0]?.image}
                          className="w-10 h-10 rounded-lg object-cover border border-theme-line shadow-sm"
                          alt="product"
                        />
                        <div className="hidden lg:block overflow-hidden">
                          <p className="text-[11px] font-bold text-theme-front truncate w-32">
                            {order.items?.[0]?.name}
                          </p>
                          <p className="text-[9px] text-theme-muted font-black">
                            Qty: {order.items?.[0]?.quantity} |{" "}
                            {order.items?.[0]?.size}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-theme-front">
                          ৳{order.financials?.totalAmount}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-theme-muted">
                          {order.payment?.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border whitespace-nowrap ${getStatusStyles(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      {canManage ? (
                        <button
                          onClick={() => openModal(order)}
                          className={`p-2 rounded-lg border transition-all active:scale-95 ${
                            order.payment?.method === "cod" &&
                            order.orderStatus === "Order Placed"
                              ? "bg-theme-act text-theme-actfg border-transparent shadow-lg shadow-theme-act/20 hover:brightness-110"
                              : "bg-theme-sub text-theme-front border-theme-line hover:bg-theme-line"
                          }`}
                        >
                          {order.payment?.method === "cod" &&
                          order.orderStatus === "Order Placed" ? (
                            <PhoneCall size={16} />
                          ) : (
                            <Edit3 size={16} />
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

          {orders.length === 0 && !isFetching && (
            <div className="py-20 text-center bg-theme-base">
              <ShoppingBag
                className="mx-auto mb-4 text-theme-muted opacity-20"
                size={64}
              />
              <p className="text-sm font-black uppercase tracking-widest text-theme-muted">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "No orders found"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-4 text-[10px] font-black uppercase text-theme-act underline tracking-widest hover:opacity-80 transition-opacity"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}

          {orders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-theme-sub/20 border-t border-theme-line gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || isFetching}
                  className="p-2 rounded-lg border border-theme-line text-theme-muted hover:bg-theme-sub disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === index + 1
                        ? "bg-theme-act text-theme-actfg shadow-lg shadow-theme-act/20"
                        : "text-theme-muted hover:bg-theme-sub border border-theme-line"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage || isFetching}
                  className="p-2 rounded-lg border border-theme-line text-theme-muted hover:bg-theme-sub disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-theme-muted tracking-widest">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <div className="relative">
                  <select
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="appearance-none bg-theme-base border border-theme-line rounded-xl px-4 py-2 pr-10 text-xs font-bold outline-none cursor-pointer focus:ring-1 focus:ring-theme-act"
                  >
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};
