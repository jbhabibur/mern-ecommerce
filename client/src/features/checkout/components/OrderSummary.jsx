import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FullPageLoader } from "../../../components/loaders/FullPageLoader";
import { BASE_URL } from "../../../config/apiConfig";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";

export const OrderSummary = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCheckoutDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/checkouts/cn/${token}`,
        );
        if (response.data.success) {
          setCheckoutData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching checkout summary:", error);
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    if (token) getCheckoutDetails();
  }, [token, navigate]);

  if (loading) return <FullPageLoader />;
  if (!checkoutData) return null;

  const products = checkoutData.items || [];
  const total = checkoutData.totalAmount || 0;
  const vat = Math.round(total * 0.05);
  const subtotal = total - vat;

  return (
    <div className="w-full lg:max-w-[39rem] lg:sticky lg:top-0">
      {/* --- MOBILE VIEW --- */}
      <div className="lg:hidden">
        {/* Header Toggle (Visible when closed) */}
        {!isOpen && (
          <div
            className="bg-white md:bg-[#FAFAFA] cursor-pointer mb-4"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute top-0 left-1 w-full h-full bg-[#A0AEB9] border border-gray-300 rounded-lg translate-x-1.5 rotate-4"></div>
                  <div className="relative border border-gray-200 rounded-lg bg-white p-0.5 w-full h-full z-10">
                    <img
                      src={products[0]?.image}
                      alt="order-thumb"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-20">
                      {products.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-base! font-bold text-gray-900 m-0">
                    Total
                  </h3>
                  <span className="text-sm text-gray-500 font-normal">
                    {products.length} {products.length > 1 ? "items" : "item"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-bold tracking-tight">
                  BDT
                </span>
                <span className="text-lg font-bold">
                  ৳{total.toLocaleString()}
                </span>
                <ChevronDown size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Expandable Content Area */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out bg-white ${
            isOpen ? "max-h-[1500px] opacity-100 mb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p3 md:p-6 space-y-6">
            <div
              className="flex justify-between items-center"
              onClick={() => setIsOpen(false)}
            >
              <h2 className="text-xl! font-semibold">Order summary</h2>
              <ChevronUp size={22} className="text-blue-600" />
            </div>
            <SummaryContent
              products={products}
              subtotal={subtotal}
              vat={vat}
              total={total}
            />
          </div>
        </div>

        {/* Fixed Position Button (Always at the bottom of the component) */}
        <div className="mt-2">
          <PrimaryButton
            type="submit"
            text="Pay now"
            initialBg="#0066CC"
            initialText="#FFFFFF"
            className="w-full rounded-sm py-3 text-lg"
            responsive={false}
            showTextOnMobile={true}
          />
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden lg:block p-8 xl:p-14 max-w-[38rem] ml-auto">
        <SummaryContent
          products={products}
          subtotal={subtotal}
          vat={vat}
          total={total}
        />
      </div>
    </div>
  );
};

const SummaryContent = ({ products, subtotal, vat, total }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      {products.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="relative border border-gray-200 rounded-xl bg-white flex-shrink-0 p-1">
            <img
              src={item.image}
              alt={item.productId?.name || "Product"}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-medium">
              {item.quantity}
            </span>
          </div>
          <div className="flex-grow">
            <h3 className="text-[13.5px]! font-medium text-gray-800 leading-snug">
              {item.productId?.name || "Premium Item"}
            </h3>
            <p className="text-[12px] text-gray-400 font-normal">
              {item.size || "Standard"}
            </p>
          </div>
          <p className="text-[14px] text-gray-800 font-normal">
            ৳{(item.priceAtCheckout * item.quantity).toLocaleString()}
          </p>
        </div>
      ))}
    </div>

    <div className="flex gap-3 pt-2">
      <input
        type="text"
        placeholder="Discount code"
        className="flex-grow px-4 py-2.5! bg-white border border-gray-300 rounded-md text-[14px] outline-none focus:border-black transition-all"
      />
      <button className="bg-[#F5F5F5] px-6 py-2.5! rounded-md text-gray-400 text-[14px] font-medium border border-gray-200 cursor-not-allowed">
        Apply
      </button>
    </div>

    <div className="space-y-2.5 pt-2">
      <div className="flex justify-between text-[14px]">
        <span className="text-gray-600">Subtotal</span>
        <span className="text-gray-900 font-medium">
          ৳{subtotal.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-[14px]">
        <span className="text-gray-600">Shipping</span>
        <span className="text-[12px] font-bold text-green-600 uppercase tracking-tight">
          Free
        </span>
      </div>
      <div className="flex justify-between items-center text-[14px]">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Estimate VAT</span>
          <HelpCircle size={14} className="text-gray-400" />
        </div>
        <span className="text-gray-900 font-medium">
          ৳{vat.toLocaleString()}
        </span>
      </div>
    </div>

    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
      <span className="text-[18px] font-bold text-black">Total</span>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-500 font-bold tracking-tight">
          BDT
        </span>
        <span className="text-[22px] font-bold text-black">
          ৳{total.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);
