import React, { useState } from "react";
import {
  Home,
  Truck,
  CheckCircle2,
  ClipboardList,
  Copy,
  Check,
} from "lucide-react";

export const OrderTrackingDetails = () => {
  const [copied, setCopied] = useState(false);

  const orderInfo = {
    courier: "BD-DEX",
    courierCode: "LM-BPL-249085-Nayem Hosen",
    trackingNumber: "DEX-BDN-0071980257",
    currentStep: 4,
    history: [
      {
        date: "22 May 14:55",
        status: "Delivered",
        description: "Package delivered!",
        location: "Savar",
      },
      {
        date: "22 May 09:28",
        status: "Rider will Attempt to Deliver Today",
        description: "[BD-DEX] will attempt to deliver your package today.",
        location: "Savar",
      },
      {
        date: "18 May 17:01",
        status: "Order Reached at Daraz Distribution Center",
        description:
          "Package is being sorted and will soon head to the delivery facility.",
        location: "Chattogram Sadar",
      },
      {
        date: "18 May 14:16",
        status: "Processed and Ready to Ship",
        description: "Order will be handed over to [BD-DEX] soon",
        location: null,
      },
      {
        date: "18 May 14:16",
        status: "Order Processing",
        description: "Order packed",
        location: null,
      },
      {
        date: "17 May 22:41",
        status: "Order Received by the Seller",
        description: "Seller is preparing your order",
        location: null,
      },
      {
        date: "17 May 22:41",
        status: "Order Processing",
        description: "Order received",
        location: null,
      },
    ],
  };

  const steps = [
    {
      label: "Processing",
      icon: <ClipboardList className="w-5 h-5 md:w-6 md:h-6" />,
    },
    { label: "Packed", icon: <Home className="w-5 h-5 md:w-6 md:h-6" /> },
    { label: "Shipped", icon: <Truck className="w-5 h-5 md:w-6 md:h-6" /> },
    {
      label: "Delivered",
      icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(orderInfo.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white font-sans text-gray-800">
      <h2 className="text-lg md:text-xl font-bold mb-6">Tracking Details</h2>

      {/* Header Info - Stacks on Mobile */}
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 mb-10 border-b pb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0"></div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Courier Info
            </p>
            <p className="text-sm">
              Delivery Partner:{" "}
              <span className="font-medium">{orderInfo.courier}</span>
            </p>
            <p className="text-sm text-gray-600">
              Courier {orderInfo.courierCode}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            Tracking Number
          </p>
          <div className="flex items-center gap-2 text-cyan-600 font-medium mt-1">
            <span className="text-sm md:text-base">
              {orderInfo.trackingNumber}
            </span>
            <button
              onClick={handleCopy}
              className="hover:text-cyan-700 transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Stepper - Responsive widths */}
      <div className="relative flex justify-between items-start mb-16 px-2 md:px-10">
        {/* Connecting Line */}
        <div className="absolute top-5 md:top-6 left-10 right-10 h-[1px] border-t-2 border-dashed border-gray-300 -z-0"></div>

        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center z-10 bg-white px-1 md:px-4 text-center"
          >
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                index + 1 <= orderInfo.currentStep
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step.icon}
            </div>
            <span
              className={`text-[10px] md:text-sm font-semibold uppercase tracking-tight ${
                index + 1 <= orderInfo.currentStep
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline History */}
      <div className="space-y-8">
        {orderInfo.history.map((item, index) => (
          <div key={index} className="flex gap-3 md:gap-6 relative">
            {/* Timeline Vertical Line */}
            {index !== orderInfo.history.length - 1 && (
              <div className="absolute left-[89px] md:left-[133px] top-6 bottom-[-32px] w-[1.5px] bg-gray-200"></div>
            )}

            {/* Date and Time - Narrower on mobile */}
            <div className="w-20 md:w-32 text-right text-[11px] md:text-sm font-medium pt-1 text-gray-500 shrink-0">
              {item.date}
            </div>

            {/* Status Dot */}
            <div className="relative z-10 mt-1 shrink-0">
              {index === 0 ? (
                <div className="bg-blue-600 rounded-full p-0.5">
                  <CheckCircle2 className="text-white w-4 h-4 md:w-5 md:h-5" />
                </div>
              ) : (
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded-full mx-1"></div>
              )}
            </div>

            {/* Description */}
            <div className="flex-1 pb-2">
              <p
                className={`text-sm font-bold leading-tight ${index === 0 ? "text-gray-900" : "text-gray-400"}`}
              >
                {item.status}
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {item.description}{" "}
                {item.location && (
                  <span className="font-bold text-gray-600">
                    [{item.location}]
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
