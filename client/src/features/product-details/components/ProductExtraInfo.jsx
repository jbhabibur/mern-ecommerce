import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SHIPPING_POLICY } from "../../../constants/shippingPolicy";

export const ProductExtraInfo = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    {
      id: "description",
      title: "Description",
      content: (
        <div className="space-y-4">
          {product?.sizeChart && (
            <img
              src={product.sizeChart}
              alt="Size Chart"
              className="max-w-md border rounded-xl"
            />
          )}
          <div className="text-sm space-y-1">
            <p>
              <strong>Product Name:</strong> {product?.name}
            </p>
            <p>
              <strong>Fabric Pattern:</strong> {product?.fabric}
            </p>
            <p>
              <strong>Color Name:</strong> {product?.color}
            </p>
            <p className="italic text-gray-400 text-xs mt-2">
              [Note: The color of the product may vary slightly due to lighting
              or display settings.]
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping Policy",
      content: (
        <p className="text-sm text-gray-600 leading-relaxed">
          {SHIPPING_POLICY.content}
        </p>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop Tabs Header */}
      <div className="hidden md:flex justify-center border-b border-[#E6E6E6] gap-12">
        {" "}
        {/* Added gap-12 here */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-4 px-2 text-sm font-bold uppercase tracking-widest transition-all duration-300
              ${activeTab === tab.id ? "text-black" : "text-gray-400 hover:text-black"}`}
          >
            {tab.title}

            {/* Red Underline with 0 to 100% sliding effect */}
            <span
              className={`absolute bottom-[-1px] left-0 h-[2px] bg-black transition-all duration-500 ease-in-out
                ${activeTab === tab.id ? "w-full opacity-100" : "w-0 opacity-0"}`}
            />
          </button>
        ))}
      </div>

      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="md:last:border-none border-b md:border-b-0"
          >
            {/* Mobile Accordion Header */}
            <button
              onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
              className="w-full py-4 flex md:hidden justify-between items-center font-bold uppercase text-sm"
            >
              {tab.title}
              {activeTab === tab.id ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {/* Tab Content */}
            <div
              className={`transition-all duration-500 ${activeTab === tab.id ? "block animate-in fade-in slide-in-from-top-1" : "hidden md:hidden"} pb-4 md:pb-0`}
            >
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
