import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Truck,
  Package,
  ShoppingBag,
  Loader2,
  CreditCard,
  Banknote,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api/apiConfig";

/**
 * OrderSuccess Component
 * Displays a high-contrast, modern B&W confirmation screen after a successful purchase.
 * Uses 'state' navigation to pass data to the tracking page efficiently.
 */
export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract orderId from the URL query parameters (e.g., ?orderId=123)
  const orderId = searchParams.get("orderId");

  /* ---------------------------------------------------------
     1. Lifecycle: Fetch order details from API on mount
  --------------------------------------------------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return setLoading(false);
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
        if (res.data.success) {
          setOrderData(res.data.order);
        }
      } catch (err) {
        console.error("Order fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  /* ---------------------------------------------------------
     2. Loading State: Minimalist B&W Spinner
  --------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-10 h-10 text-black animate-spin stroke-[1.5]" />
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-black">
          Authenticating Order
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------
     3. Error State: If orderId is invalid or not found
  --------------------------------------------------------- */
  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-black">
        <div className="text-center max-w-sm w-full">
          <div className="mb-6 flex justify-center">
            <div className="p-5 border border-black rounded-full">
              <Package className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
            Missing Records
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            We couldn't find the order details you're looking for.
          </p>
          <Link
            to="/"
            className="block w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all no-underline"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  // Helper variables for cleaner JSX
  const isSSL = orderData.payment?.method === "ssl";
  const displayId = orderData._id?.toUpperCase();

  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto">
        {/* ================= SUCCESS HEADER ================= */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-black mb-6">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Order Confirmed
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Your transaction was processed successfully. A confirmation receipt
            has been sent to your registered email.
          </p>
        </div>

        {/* ================= SUMMARY GRID (B&W BORDER LAYOUT) ================= */}
        <div className="border-y border-black py-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Order ID & Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Order Reference
            </span>
            <p className="font-mono text-lg font-bold">
              #{displayId?.slice(-10)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Payment Mode
            </span>
            <div className="flex items-center gap-2 font-bold uppercase text-sm">
              {isSSL ? (
                <CreditCard className="w-4 h-4" />
              ) : (
                <Banknote className="w-4 h-4" />
              )}
              {isSSL ? "Secure Digital Pay" : "Cash on Delivery"}
            </div>
          </div>

          {/* Amount Display */}
          <div className="space-y-1 md:text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Total Charged
            </span>
            <p className="text-3xl font-black tracking-tighter">
              ৳{orderData.financials?.totalAmount}
            </p>
          </div>
        </div>

        {/* ================= DETAILS SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Shipping Address Column */}
          <section>
            <h3 className="text-[10px]! font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Destination
            </h3>
            <div className="space-y-1 text-sm leading-relaxed">
              <p className="font-bold text-base">
                {orderData.shippingAddress?.fullName}
              </p>
              <p className="text-zinc-600">
                {orderData.shippingAddress?.houseAddress}
              </p>
              <p className="text-zinc-600">
                {orderData.shippingAddress?.city},{" "}
                {orderData.shippingAddress?.division}
              </p>
              <p className="pt-2 font-mono font-bold">
                {orderData.shippingAddress?.phoneNumber}
              </p>
            </div>
          </section>

          {/* Status/Next Step Column */}
          <section className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100">
            <h3 className="text-[10px]! font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-zinc-400">
              <Truck className="w-4 h-4" /> Logistics Status
            </h3>
            <h4 className="font-bold text-lg mb-2 text-black">
              Preparing for Dispatch
            </h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {isSSL
                ? "Payment verified. Your items are currently being inspected and packed for immediate shipping."
                : `Order acknowledged. Please ensure ৳${orderData.financials?.totalAmount} is available for the courier.`}
            </p>
          </section>
        </div>

        {/* ================= ACTION BAR (NAVIGATION) ================= */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Track Shipment Link: Navigates to tracking page passing order data via state */}
          <Link
            to={`/track-order/${orderId}`}
            state={{ order: orderData }} // Passes the full object to avoid extra API calls
            className="flex-1 bg-black text-white h-14 rounded-full font-bold text-xs! uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98] no-underline!"
          >
            <Package className="w-4 h-4" />
            Track Shipment
          </Link>

          {/* Continue Shopping Link */}
          <Link
            to="/"
            className="flex-1 bg-white border border-zinc-200 text-black h-14 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all active:scale-[0.98] no-underline!"
          >
            Continue Browsing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
