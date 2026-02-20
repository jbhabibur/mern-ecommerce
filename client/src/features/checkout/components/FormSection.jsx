import { EllipsisVertical } from "lucide-react";

import { useState } from "react";
import { useAddressForm } from "../../../features/user/hooks/useAddressForm";
import { DeliveryForm } from "./DeliveryForm";
import { BillingAddressForm } from "./BillingAddressForm";
import { PaymentSection } from "./PaymentSection";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { AddressSection } from "./AddressSection";
import { setLogout } from "../../../redux/slices/authSlice";

export const FormSection = ({
  paymentMethod,
  setPaymentMethod,
  setIsLoginLoading,
  showSignOut,
  setShowSignOut,
}) => {
  const {
    formData,
    errors,
    handleChange,
    handleDivisionChange,
    handleCityChange,
    divisionOptions,
    cityOptions,
    zoneOptions,
  } = useAddressForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  console.log(isLoggedIn, user);

  const [billingOption, setBillingOption] = useState("same");

  // LOGIC: Handle the fake delay for the Sign In link
  const handleFakeSignInLoading = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);

    const currentPath = window.location.pathname + window.location.search;
    console.log("heello", currentPath);

    // URL-e kono space ba line break thaka cholbe na
    const loginUrl =
      "/account/login?return_to=" + encodeURIComponent(currentPath);

    console.log("Navigating to:", loginUrl);

    setTimeout(() => {
      navigate(loginUrl);
    }, 1000);
  };

  const inputClass = (error) =>
    `w-full border ${error ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors`;

  return (
    /* Form container aligned to the right to meet the center of the screen on desktop */
    <div className="w-full lg:max-w-[38rem] p-6 md:p-10 space-y-10">
      {/* 1. Contact Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          {isLoggedIn ? (
            <div className="flex items-center justify-between w-full border-b border-[#DEDEDE] pb-3">
              {/* User Identity Display */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
                  {user?.email?.charAt(0).toUpperCase() || "H"}
                </div>
                <span className="text-sm text-gray-700 font-normal">
                  {user?.email || "habibur.cse.diu@gmail.com"}
                </span>
              </div>

              {/* Action Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSignOut(!showSignOut);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <EllipsisVertical size={20} />
                </button>

                {/* Sign Out Tooltip/Dropdown */}
                {showSignOut && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <div className="relative bg-white border border-gray-200 shadow-xl rounded-lg py-2 px-4 min-w-[100px]">
                      {/* Triangle Arrow */}
                      <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
                      <button
                        onClick={() => {
                          dispatch(setLogout());
                          setShowSignOut(false);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* When user not logged it */}
              <h2 className="text-xl! font-semibold! text-gray-800">Contact</h2>
              <a
                href="#"
                onClick={handleFakeSignInLoading}
                className="text-blue-600 underline text-sm"
              >
                Sign in
              </a>
            </>
          )}
        </div>
        {!isLoggedIn && (
          <input
            type="text"
            name="emailOrPhone"
            className={inputClass(false)}
            placeholder="Enter email or mobile phone number"
          />
        )}
      </section>

      {/* 2. Delivery Section */}

      {!isLoggedIn ? (
        <DeliveryForm
          {...{
            formData,
            errors,
            handleChange,
            handleDivisionChange,
            handleCityChange,
            divisionOptions,
            cityOptions,
            zoneOptions,
          }}
        />
      ) : (
        <AddressSection />
      )}

      {/* 3. Payment Section */}
      <PaymentSection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {/* 4. Billing Address Section */}
      <section className="mt-8">
        <h2 className="text-xl! font-semibold! text-gray-800 mb-4">
          Billing address
        </h2>
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
          {/* Same Address Option */}
          <div
            onClick={() => setBillingOption("same")}
            className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all border! ${billingOption === "same" ? "bg-[#F5F6FF] border-[#005BD1] z-10" : "bg-white border-transparent border-b-gray-200 hover:bg-gray-50"}`}
          >
            <div
              className={`relative flex items-center justify-center w-5 h-5 rounded-full border transition-all ${billingOption === "same" ? "border-[#0066CC]! border-[6px]!" : "border-gray-300"}`}
            />
            <span
              className={`text-sm font-medium ${billingOption === "same" ? "text-gray-800" : "text-gray-700"}`}
            >
              Same as shipping address
            </span>
          </div>

          {/* Different Address Option */}
          <div
            onClick={() => setBillingOption("different")}
            className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all border! ${billingOption === "different" ? "bg-[#F5F6FF] border-[#005BD1] z-10" : "bg-white border-transparent hover:bg-gray-50"}`}
          >
            <div
              className={`relative flex items-center justify-center w-5 h-5 rounded-full border transition-all ${billingOption === "different" ? "border-[#0066CC]! border-[6px]!" : "border-gray-300"}`}
            />
            <span
              className={`text-sm font-medium ${billingOption === "different" ? "text-gray-800" : "text-gray-700"}`}
            >
              Use a different billing address
            </span>
          </div>

          {/* Billing Form Accordion */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${billingOption === "different" ? "max-h-[1000px] opacity-100 border-t border-gray-200" : "max-h-0 opacity-0"}`}
          >
            <div className="p-6 bg-[#F5F5F5]">
              <BillingAddressForm
                {...{
                  formData,
                  errors,
                  handleChange,
                  handleDivisionChange,
                  handleCityChange,
                  divisionOptions,
                  cityOptions,
                  zoneOptions,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Submit Button */}
      <div className="hidden md:block">
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
  );
};
