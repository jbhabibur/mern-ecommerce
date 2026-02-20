import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { FormSection } from "../features/checkout/components/FormSection";
import { OrderSummary } from "../features/checkout/components/OrderSummary";
import { FullPageLoader } from "../components/loaders/FullPageLoader";

import logo from "../assets/logo.svg";

// Import hooks
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";

export const CheckoutPage = () => {
  useScrollToTop();

  const navigate = useNavigate();

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl");
  const [showSignOut, setShowSignOut] = useState(false);

  // Loading state
  if (isLoginLoading)
    return (
      <div className="relative">
        <FullPageLoader />
      </div>
    );

  return (
    <div
      onClick={() => setShowSignOut(false)}
      className="min-h-screen text-gray-700 font-sans"
    >
      {/* Top Header */}
      <header className="max-w-[70rem] mx-auto py-8 flex justify-between items-center">
        <div onClick={() => navigate("/")} className="h-10 cursor-pointer">
          <img src={logo} alt="Dorjibari" className="h-full object-contain" />
        </div>
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer bg-amber-300s"
        >
          <ShoppingBag size={24} className="text-blue-600" strokeWidth={1.5} />
        </div>
      </header>

      <main className="border-t border-[#DEDEDE]">
        {/* Responsive grid: 1 column up to md, 2 columns for lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Side: Form */}
          <div className="w-full bg-white flex lg:justify-end border-b border-[#DEDEDE] lg:border-b-0">
            <FormSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              isLoginLoading={isLoginLoading}
              setIsLoginLoading={setIsLoginLoading}
              showSignOut={showSignOut}
              setShowSignOut={setShowSignOut}
            />
          </div>

          {/* Right Side: Summary */}
          <div className="relative w-full bg-[#FAFAFA] lg:bg-[#F5F5F5] lg:border-l border-[#DEDEDE]">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
};
