import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { FormSection } from "../features/checkout/components/FormSection";
import { OrderSummary } from "../features/checkout/components/OrderSummary";
import { FullPageLoader } from "../components/loaders/FullPageLoader";
import { useSelector, useDispatch } from "react-redux";

import logo from "../assets/logo.svg";

// Import hooks
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { useAddressForm } from "../features/checkout/hooks/useAddressForm";
import { useAddress } from "../features/checkout/hooks/useAddress";

export const CheckoutPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl");
  const [showSignOut, setShowSignOut] = useState(false);

  // --- LIFTED STATE FROM FORMSECTION ---
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [billingOption, setBillingOption] = useState("same");
  const [isEditing, setIsEditing] = useState(false);

  const {
    formData,
    errors,
    handleChange,
    handleLocationChange,
    validateForm,
    getFinalData,
    setFormData,
  } = useAddressForm();

  // Access addresses for validation logic
  const { addresses } = useAddress();

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isActuallyLoggedIn = isLoggedIn && !isEditing;
    let isValid = false;

    if (isActuallyLoggedIn) {
      if (!selectedAddressId && addresses?.length > 0) {
        alert("Please select a shipping address");
        return;
      }
      isValid = validateForm(true, billingOption);
    } else {
      isValid = validateForm(false, billingOption);
    }

    if (!isValid) {
      console.log("Validation Errors Found:", errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const selectedAddressObject = addresses?.find(
      (addr) => addr._id === selectedAddressId,
    );

    const { contact, shippingAddress, billingAddress } = getFinalData(
      isActuallyLoggedIn,
      selectedAddressObject,
      billingOption,
    );

    const orderPayload = {
      customer: {
        email: isLoggedIn ? user?.email : contact.email,
        userId: isLoggedIn ? user?.id : null,
        isGuest: !isLoggedIn,
      },
      shippingAddress: isActuallyLoggedIn
        ? {
            fullName: selectedAddressObject?.fullName,
            phoneNumber: selectedAddressObject?.phoneNumber,
            division: selectedAddressObject?.division,
            city: selectedAddressObject?.city,
            zone: selectedAddressObject?.zone,
            houseAddress: selectedAddressObject?.houseAddress,
            label: selectedAddressObject?.label,
          }
        : shippingAddress,
      billingAddress:
        billingOption === "same"
          ? isActuallyLoggedIn
            ? { ...shippingAddress } // Use the mapped object
            : shippingAddress
          : billingAddress,
      payment: {
        method: paymentMethod,
        status: "pending",
      },
    };

    try {
      console.log("🚀 Final Order Payload:", orderPayload);
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  if (isLoginLoading)
    return (
      <div className="relative">
        <FullPageLoader />
      </div>
    );

  return (
    <div
      onClick={() => setShowSignOut(false)}
      className="min-h-screen text-gray-700 font-sans bg-white"
    >
      <header className="max-w-[80rem] mx-auto px-4 py-6 md:py-8 flex justify-between items-center">
        <div
          onClick={() => navigate("/")}
          className="h-8 md:h-10 cursor-pointer"
        >
          <img src={logo} alt="Dorjibari" className="h-full object-contain" />
        </div>
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          <ShoppingBag size={24} className="text-blue-600" strokeWidth={1.5} />
        </div>
      </header>

      <main className="border-t border-[#DEDEDE]">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex justify-end bg-white border-b lg:border-b-0 lg:border-r border-[#DEDEDE]">
              <div className="w-full lg:max-w-[37rem] xl:max-w-[40rem] px-4 md:px-8 lg:px-12 py-10">
                <FormSection
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  isLoginLoading={isLoginLoading}
                  setIsLoginLoading={setIsLoginLoading}
                  showSignOut={showSignOut}
                  setShowSignOut={setShowSignOut}
                  // Pass lifted state down
                  selectedAddressId={selectedAddressId}
                  setSelectedAddressId={setSelectedAddressId}
                  billingOption={billingOption}
                  setBillingOption={setBillingOption}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  // Pass form helpers
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleLocationChange={handleLocationChange}
                />
              </div>
            </div>

            <div className="flex justify-start bg-[#FFF] lg:bg-[#FAFAFA]">
              <div className="w-full lg:max-w-[37rem] xl:max-w-[40rem] px-4 md:px-8 lg:px-12 py-2 md:py-10">
                <OrderSummary />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
