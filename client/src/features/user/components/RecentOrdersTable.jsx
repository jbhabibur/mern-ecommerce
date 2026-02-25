import React, { useState } from "react";
import { Copy } from "lucide-react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";

// API Fetcher
const fetchUserOrders = async () => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.orders || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Could not fetch orders");
  }
};

const ImagePreviewPortal = ({ imageUrl, onClose }) => {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-white p-2 rounded-lg shadow-2xl scale-in-95 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute -top-12 right-0 text-white text-4xl font-light hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Large Preview"
          className="w-full h-auto max-h-[85vh] object-contain rounded-md shadow-inner"
        />
      </div>
    </div>,
    document.body,
  );
};

export const RecentOrdersTable = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate(); // Hook initialize

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recentOrders"],
    queryFn: fetchUserOrders,
  });

  return (
    <div className="bg-white shadow-sm overflow-hidden mb-10 border border-gray-100 rounded-sm">
      <div className="border-b border-gray-100">
        <h2 className="text-xl! p-2 lg:p-4 md:text-2xl! text-[#424242] font-normal">
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : isError ? (
          <div className="p-10 text-center text-red-500 text-sm">
            {error.message}
          </div>
        ) : orders.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-50 bg-gray-50/20">
                <th className="px-5 py-4 font-normal">Order #</th>
                <th className="px-5 py-4 font-normal">Placed On</th>
                <th className="px-5 py-4 font-normal">Items Preview</th>
                <th className="px-5 py-4 font-normal text-right">Total</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-6 text-gray-600 font-medium">
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors w-fit"
                      onClick={() => {
                        navigator.clipboard.writeText(order._id);
                        alert("Order ID copied: " + order._id);
                      }}
                      title="Click to copy full ID"
                    >
                      <span>#{order._id.slice(-8)}</span>
                      <Copy size={14} className="text-gray-400" />
                    </div>
                  </td>
                  <td className="px-5 py-6 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>

                  <td className="px-5 py-6">
                    <div className="flex items-center">
                      <div className="flex -space-x-3">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image || item.productImage} //
                            alt="thumb"
                            onClick={() =>
                              setSelectedImage(item.image || item.productImage)
                            }
                            className="w-12 h-12 rounded-full border-2 border-white bg-white shadow-sm object-contain cursor-pointer transition-transform hover:scale-110 hover:z-10"
                          />
                        ))}
                      </div>
                      {order.items?.length > 3 && (
                        <div className="ml-4 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-6 text-right text-gray-800 font-medium">
                    <div className="flex flex-col">
                      <span>
                        ৳ {(order.financials?.subtotal || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {order.items?.length}{" "}
                        {order.items?.length > 1 ? "Items" : "Item"}
                      </span>
                    </div>
                  </td>

                  {/* Industry Standard Routing */}
                  <td className="text-center">
                    <button
                      onClick={() =>
                        navigate(`/account/orders/${order._id}/track`)
                      }
                      className="text-black font-bold hover:text-[#148197] transition-colors uppercase text-xs! border border-black! px-2 py-1.5 rounded-sm"
                    >
                      Track Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-gray-400">No orders found.</div>
        )}
      </div>

      {selectedImage && (
        <ImagePreviewPortal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};
