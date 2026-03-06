import React, { useState } from "react";
import {
  Phone,
  CheckCircle2,
  Edit3,
  X,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Loader2,
} from "lucide-react";

// Redux hooks for data fetching and mutations
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../../redux/service/adminOrderApi";

export const AllOrders = () => {
  // Initialize RTK Query hooks
  const { data, isLoading, isError, error } = useGetOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  // Local state for modal and form inputs
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");

  /**
   * Opens the update modal and populates it with existing order data
   */
  const handleAction = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setInternalNote(order.internalNote || "");
    setIsModalOpen(true);
  };

  /**
   * Sends the PATCH request to the backend via Redux Toolkit Query
   */
  const handleSaveChanges = async () => {
    try {
      await updateOrder({
        id: selectedOrder._id, // Used for the /api/orders/admin/update/:id path
        orderStatus: newStatus,
        internalNote: internalNote,
        // Automatically verify the order if moving to Confirmed or Shipped
        isVerified:
          newStatus === "confirmed" || newStatus === "shipped"
            ? true
            : selectedOrder.isVerified,
      }).unwrap();

      setIsModalOpen(false);
      alert("Order updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.data?.message || "Update failed. Please try again.");
    }
  };

  // Loading state
  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-theme-act" size={40} />
      </div>
    );

  // Error state
  if (isError)
    return (
      <div className="p-10 text-theme-error text-center font-poppins">
        Error:{" "}
        {error?.data?.message || "Something went wrong while fetching orders."}
      </div>
    );

  const orders = data?.orders || [];

  return (
    <div className="min-h-screen bg-theme-base p-4 sm:p-8 transition-none">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-theme-front">
            Order Management
          </h1>
          <p className="text-sm text-theme-muted font-medium">
            Manage COD verifications and monitor SSLCommerz payments.
          </p>
        </header>

        {/* Orders Table Container */}
        <div className="overflow-hidden rounded-xl border border-theme-line bg-theme-base shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-theme-sub text-xs uppercase text-theme-muted font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4 border-b border-theme-line">
                    Order ID
                  </th>
                  <th className="px-6 py-4 border-b border-theme-line">
                    Customer
                  </th>
                  <th className="px-6 py-4 border-b border-theme-line">
                    Payment
                  </th>
                  <th className="px-6 py-4 border-b border-theme-line">
                    Status
                  </th>
                  <th className="px-6 py-4 border-b border-theme-line text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-line font-poppins">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-theme-sub/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs text-theme-act font-bold uppercase">
                        #{order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-theme-front">
                          {order.customer.fullName}
                        </span>
                        <span className="text-[11px] text-theme-muted font-medium italic">
                          {order.customer.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {order.payment.method === "cod" ? (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-theme-muted/10 text-theme-muted text-[10px] font-bold uppercase border border-theme-line">
                            <AlertCircle size={12} /> COD
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-theme-success/10 text-theme-success text-[10px] font-bold uppercase border border-theme-success/20">
                            <ShieldCheck size={12} /> SSL
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          order.isVerified
                            ? "bg-theme-success/10 text-theme-success border-theme-success/20"
                            : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/10 dark:text-amber-400"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleAction(order)}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-md ${
                          order.payment.method === "cod" && !order.isVerified
                            ? "bg-theme-act text-theme-actfg"
                            : "bg-theme-sub text-theme-front border border-theme-line"
                        }`}
                      >
                        {order.payment.method === "cod" && !order.isVerified ? (
                          <>
                            <PhoneCall size={14} /> Verify COD
                          </>
                        ) : (
                          <>
                            <Edit3 size={14} /> Edit
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-theme-base border border-theme-line rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-theme-line bg-theme-sub">
              <h3 className="font-bold text-theme-front flex items-center gap-2">
                {selectedOrder.payment.method === "cod" ? (
                  <PhoneCall size={18} className="text-theme-act" />
                ) : (
                  <Edit3 size={18} className="text-theme-act" />
                )}
                {selectedOrder.payment.method === "cod"
                  ? "Verify COD Order"
                  : "Update Order Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-theme-muted hover:text-theme-front transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contextual Info for COD */}
              {selectedOrder.payment.method === "cod" && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl">
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 uppercase font-bold tracking-widest mb-2">
                    Customer Contact
                  </p>
                  <a
                    href={`tel:${selectedOrder.customer.phone}`}
                    className="text-2xl font-bold text-theme-front flex items-center gap-3 hover:text-theme-act transition-colors"
                  >
                    <Phone size={20} className="text-theme-act" />
                    {selectedOrder.customer.phone}
                  </a>
                </div>
              )}

              {/* Status & Notes Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-theme-muted uppercase tracking-tighter">
                    Change Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-theme-sub border border-theme-line p-3 rounded-lg text-sm text-theme-front outline-none focus:ring-2 focus:ring-theme-act/20 transition-all"
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="confirmed">Confirmed / Ready to Ship</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-theme-muted uppercase tracking-tighter">
                    Internal Admin Note
                  </label>
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="E.g. Customer confirmed via call at 4:30 PM today."
                    className="w-full bg-theme-sub border border-theme-line p-3 rounded-lg text-sm text-theme-front h-20 outline-none focus:ring-2 focus:ring-theme-act/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSaveChanges}
                disabled={isUpdating}
                className="w-full bg-theme-act text-theme-actfg font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  "Save & Update Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
