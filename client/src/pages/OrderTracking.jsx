import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Truck,
  CheckCircle2,
  Clock,
  Loader2,
  Copy,
  Warehouse,
} from "lucide-react";
import { BASE_URL } from "../api/apiConfig";

export const OrderTracking = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/track/${orderId}`);
        if (res.data.success) setOrder(res.data.order);
      } catch (err) {
        console.error("Tracking error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (!order || order._id !== orderId) fetchOrder();
  }, [orderId, order]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f4f4]">
        <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
      </div>
    );

  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  const steps = [
    { id: "PENDING", label: "Processing", icon: Clock },
    { id: "CONFIRMED", label: "Packed", icon: Warehouse },
    { id: "SHIPPED", label: "Shipped", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStatus = (order?.orderStatus || "PENDING").toUpperCase();
  const currentStepIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-4 md:py-8 px-2 md:px-4 font-sans text-[#212121]">
      <div className="max-w-4xl mx-auto">
        {/* 1. Header Info Card */}
        <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 mb-3">
          <h2 className="text-base md:text-lg font-medium mb-4">
            Tracking Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div className="flex gap-3">
              <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm">
                <p className="text-gray-500 font-normal">Courier Info</p>
                <p className="font-medium">Delivery Partner: BD-DEX</p>
                <p className="text-gray-500 text-xs">
                  LM-BPL-249085-Nayem Hosen
                </p>
              </div>
            </div>
            <div className="text-sm md:border-l md:pl-6 pt-2 md:pt-0">
              <p className="text-gray-500 font-normal">Tracking Number</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#0094b6] font-medium break-all">
                  DEX-BDN-0071980257
                </span>
                <Copy className="w-3 h-3 text-[#0094b6] cursor-pointer shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Progress Stepper */}
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-10 mb-3 overflow-hidden">
          {/* --- Desktop View (Horizontal) --- */}
          <div className="hidden md:flex relative justify-between items-center max-w-2xl mx-auto">
            <div className="absolute top-[24px] left-0 w-full h-[1px] border-t border-dashed border-gray-300 z-0" />
            {steps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center gap-3 bg-white px-4"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 border ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-300 border-gray-200"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-[13px] font-semibold ${isActive ? "text-[#212121]" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* --- Mobile View (Vertical) --- */}
          <div className="flex md:hidden flex-col relative gap-10 ml-4 py-2">
            <div className="absolute left-[19px] top-5 bottom-5 w-[1px] border-l border-dashed border-gray-300 z-0" />

            {steps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              return (
                <div
                  key={step.id}
                  className="relative z-10 flex flex-row items-center gap-6"
                >
                  {/* Added bg-white and overflow-hidden to keep the circle clean */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 bg-white border shrink-0 ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "text-gray-300 border-gray-200"
                    }`}
                  >
                    {/* Force icon to render without translation interference */}
                    <div className="notranslate">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Added 'notranslate' class here to prevent Google Translate from breaking the text */}
                  <span
                    className={`text-[14px] font-bold notranslate ${isActive ? "text-[#212121]" : "text-gray-400"}`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Detailed Vertical Timeline */}
        <div className="bg-white rounded-sm shadow-sm p-5 md:p-8">
          <div className="relative space-y-8">
            <div className="absolute left-[75px] md:left-[95px] top-2 bottom-2 w-[1px] bg-gray-200" />
            {order?.history
              ?.slice()
              .reverse()
              .map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex gap-4 md:gap-8 items-start"
                >
                  <div className="w-16 md:w-20 text-right text-[11px] md:text-[12px] pt-1 shrink-0">
                    <p className="font-bold text-gray-800">
                      {new Date(item.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                    <p className="text-gray-400 mt-0.5">
                      {new Date(item.updatedAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>
                  <div className="relative z-10 pt-1 shrink-0">
                    <div
                      className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                        idx === 0
                          ? "border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                          : "border-gray-200"
                      }`}
                    >
                      {idx === 0 && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 pb-2">
                    <p
                      className={`text-sm md:text-[15px] font-medium ${idx === 0 ? "text-[#212121]" : "text-gray-400"}`}
                    >
                      {item.status}
                    </p>
                    <p className="text-[12px] md:text-[13px] text-gray-500 mt-1 leading-relaxed">
                      {item.comment}{" "}
                      <span className="font-semibold text-gray-400">
                        [{order?.shippingAddress?.city}]
                      </span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
