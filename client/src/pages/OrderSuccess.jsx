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
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../api/apiConfig";

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");

  /* ---------------- Fetch Order ---------------- */
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

  /* ---------------- Loading State ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">
          Loading Order...
        </p>
      </div>
    );
  }

  /* ---------------- Fallback if No Order ---------------- */
  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-md text-center max-w-md w-full">
          <Package className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <Link
            to="/"
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const isSSL = orderData.payment?.method === "ssl";
  const displayId = orderData._id?.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ================= Success Header ================= */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center p-10">
            {/* Success Icon */}
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-3">
              Order Confirmed!
            </h1>
            <p className="opacity-90 text-sm md:text-base">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
          </div>

          {/* Order Meta Info */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
            {/* Order ID */}
            <div className="p-8 text-center">
              <Package className="mx-auto w-5 h-5 text-slate-400 mb-2" />
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Order ID
              </p>
              <p className="font-mono font-bold text-lg mt-1">
                #{displayId?.slice(-10)}
              </p>
              <div className="flex justify-center items-center gap-1 text-xs text-slate-400 mt-2">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-8 text-center">
              <CreditCard className="mx-auto w-5 h-5 text-slate-400 mb-2" />
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Payment Method
              </p>

              <div className="mt-2 text-sm font-semibold">
                {isSSL ? (
                  <span className="text-emerald-600 flex justify-center items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Online Payment
                  </span>
                ) : (
                  <span className="text-orange-600 flex justify-center items-center gap-1">
                    <Banknote className="w-4 h-4" />
                    Cash on Delivery
                  </span>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="p-8 text-center bg-slate-50">
              <ShoppingBag className="mx-auto w-5 h-5 text-slate-400 mb-2" />
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Total Amount
              </p>
              <p className="text-3xl font-black mt-1">
                ৳{orderData.financials?.totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* ================= Details Section ================= */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Info */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h4 className="text-sm font-bold uppercase tracking-widest">
                Shipping Address
              </h4>
            </div>

            <p className="font-bold">{orderData.shippingAddress?.fullName}</p>
            <p className="text-slate-600 text-sm">
              {orderData.shippingAddress?.houseAddress},{" "}
              {orderData.shippingAddress?.city}
            </p>
            <p className="text-slate-600 text-sm">
              {orderData.shippingAddress?.division}, Bangladesh
            </p>
            <p className="text-blue-600 font-semibold text-sm mt-2">
              {orderData.shippingAddress?.phoneNumber}
            </p>
          </div>

          {/* Next Step Card */}
          <div
            className={`p-8 rounded-3xl border shadow-sm ${
              isSSL
                ? "bg-emerald-50 border-emerald-100"
                : "bg-blue-50 border-blue-100"
            }`}
          >
            <div className="flex gap-4 items-start">
              <div className="bg-white p-3 rounded-xl shadow">
                <Truck className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-bold mb-2">Next Step: Order Processing</h4>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {isSSL
                    ? "Your payment has been verified. We are preparing your order for shipment."
                    : `Please keep ৳${orderData.financials?.totalAmount} ready in cash during delivery.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Action Buttons ================= */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:opacity-90 transition">
            <Package className="w-4 h-4" />
            Track Order
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-white border px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-slate-100 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
