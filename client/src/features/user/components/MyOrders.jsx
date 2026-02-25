import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Package,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";

import { BASE_URL } from "../../../api/apiConfig";
import { useRetryPayment } from "../hooks/useRetryPayment";

export const MyOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  const {
    handleRetryPayment,
    isProcessing: retryLoading,
    processingId,
  } = useRetryPayment();

  const tabs = ["All", "Placed", "Shipped", "Delivered"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const formattedOrders = response.data.orders.map((order) => {
            const dbStatus = order.orderStatus;
            const paymentStatus = order.payment?.status;
            const paymentMethod = order.payment?.method;

            let uiStatus = "";

            if (dbStatus === "Order Placed" && paymentStatus === "pending") {
              uiStatus = "Placed";
            } else if (dbStatus === "Shipped") {
              uiStatus = "Shipped";
            } else if (dbStatus === "Delivered") {
              uiStatus = "Delivered";
            } else {
              uiStatus = dbStatus;
            }

            return {
              id: order._id.slice(-8),
              mongoId: order._id,
              status: uiStatus,
              paymentMethod,
              items: order.items || [],
              price: order.financials?.totalAmount,
            };
          });

          setOrders(formattedOrders);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleAccordion = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      order.items.some((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || String(order.id).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case "Placed":
        return "text-orange-600 bg-orange-50";
      case "Shipped":
        return "text-blue-600 bg-blue-50";
      case "Delivered":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen font-sans pb-10">
      <div className="bg-white sticky top-0 z-30 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl! font-bold! text-gray-900">My Orders</h1>
        </div>

        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-sm border-b-2 font-medium ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-3 text-gray-400" size={18} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-cyan-600" />
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrders[order.mongoId];
              const firstItem = order.items[0];
              const remainingItems = order.items.slice(1);

              return (
                <div
                  key={order.mongoId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50/20">
                    <div>
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors w-fit group"
                        onClick={() => {
                          navigator.clipboard.writeText(order.mongoId);
                          alert("Order ID copied: " + order.mongoId);
                        }}
                        title="Click to copy full ID"
                      >
                        <Package
                          size={14}
                          className="text-gray-400 group-hover:text-blue-600 transition-colors"
                        />
                        <span className="text-xs font-semibold">
                          ID: {order.id}
                        </span>
                        <Copy
                          size={12}
                          className="text-gray-400 group-hover:text-blue-600 transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase">
                        {order.paymentMethod === "cod"
                          ? "Hand Cash (COD)"
                          : "Paid Online (SSL)"}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${getStatusStyles(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* First Item Always Visible */}
                  {firstItem && (
                    <div className="p-4 flex gap-4">
                      <img
                        src={firstItem.image}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm! font-medium! text-gray-900">
                          {firstItem.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {firstItem.quantity || 1}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Accordion Items */}
                  {remainingItems.length > 0 && (
                    <>
                      <button
                        onClick={() => toggleAccordion(order.mongoId)}
                        className="w-full px-4 pb-3 text-xs font-medium flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={14} />
                            Hide Items
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} />
                            View {remainingItems.length} More Item
                            {remainingItems.length > 1 && "s"}
                          </>
                        )}
                      </button>

                      {isExpanded &&
                        remainingItems.map((item, index) => (
                          <div key={index} className="px-4 pb-4 flex gap-4">
                            <img
                              src={item.image}
                              alt=""
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Qty: {item.quantity || 1}
                              </p>
                            </div>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Footer */}
                  <div className="px-4 py-3 flex justify-between items-center bg-gray-50/10 text-xs font-medium text-gray-600">
                    <span>Total: ৳{order.price?.toLocaleString()}</span>
                    <div className="flex gap-2">
                      {order.status === "Placed" &&
                        order.paymentMethod === "ssl" && (
                          <button
                            onClick={() => handleRetryPayment(order.mongoId)}
                            disabled={processingId !== null}
                            className={`px-4 py-1.5 bg-black text-white rounded-md text-xs font-bold mr-2 flex items-center gap-2 ${
                              processingId !== null
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {processingId === order.mongoId && (
                              <Loader2 className="animate-spin" size={12} />
                            )}
                            {processingId === order.mongoId
                              ? "Processing..."
                              : "Pay Now"}
                          </button>
                        )}
                      <button className="border px-4 py-1.5 rounded-md text-xs">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
