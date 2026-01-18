import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SHIPPING_POLICY } from "../../constants/shippingPolicy";

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
              [Note: Color may vary due to lighting.]
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
    <div className="w-full mt-10">
      {/* Desktop Tabs Header */}
      <div className="hidden md:flex justify-center border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-8 text-sm font-bold uppercase tracking-widest border-b-2 b-[#E8E8E8] transition-all ${
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab.title}
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
              className={`${activeTab === tab.id ? "block" : "hidden md:hidden"} pb-4 md:pb-0`}
            >
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
