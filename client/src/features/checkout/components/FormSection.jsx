import { useAddressForm } from "../hooks/useAddressForm";
import { EllipsisVertical } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DeliveryForm } from "./DeliveryForm";
import { PaymentSection } from "./PaymentSection";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AddressSection } from "./AddressSection";
import { setLogout } from "../../../redux/slices/authSlice";
import { BD_LOCATIONS } from "../../../constants/locations";

import { useAddress } from "../hooks/useAddress";

export const FormSection = ({
  paymentMethod,
  setPaymentMethod,
  setIsLoginLoading,
  showSignOut,
  setShowSignOut,
  // Props from Parent
  selectedAddressId,
  setSelectedAddressId,
  billingOption,
  setBillingOption,
  isEditing,
  setIsEditing,
  formData,
  errors,
  handleChange,
  handleLocationChange,
}) => {
  const { addresses, loading: listLoading } = useAddress();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // --- START BD LOCATIONS LOGIC ---
  const divisionOptions = useMemo(() => Object.keys(BD_LOCATIONS || {}), []);

  const shippingCityOptions = useMemo(() => {
    const div = formData.shipping?.division;
    return div ? Object.keys(BD_LOCATIONS[div] || {}) : [];
  }, [formData.shipping?.division]);

  const shippingZoneOptions = useMemo(() => {
    const div = formData.shipping?.division;
    const city = formData.shipping?.city;
    return div && city ? BD_LOCATIONS[div][city] || [] : [];
  }, [formData.shipping?.division, formData.shipping?.city]);

  const billingCityOptions = useMemo(() => {
    const div = formData.billing?.division;
    return div ? Object.keys(BD_LOCATIONS[div] || {}) : [];
  }, [formData.billing?.division]);

  const billingZoneOptions = useMemo(() => {
    const div = formData.billing?.division;
    const city = formData.billing?.city;
    return div && city ? BD_LOCATIONS[div][city] || [] : [];
  }, [formData.billing?.division, formData.billing?.city]);
  // --- END BD LOCATIONS LOGIC ---

  const handleFakeSignInLoading = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    const currentPath = window.location.pathname + window.location.search;
    const loginUrl =
      "/account/login?return_to=" + encodeURIComponent(currentPath);
    setTimeout(() => {
      navigate(loginUrl);
    }, 1000);
  };

  const inputClass = (error) =>
    `w-full border ${error ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors`;

  return (
    <div className="w-full max-w-[60rem] lg:max-w-[40rem] p-1 lg:p-10 space-y-10">
      <section>
        <div className="flex justify-between items-center mb-3">
          {isLoggedIn ? (
            <div className="flex items-center justify-between w-full border-b border-[#DEDEDE] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
                  {user?.email?.charAt(0).toUpperCase() || "H"}
                </div>
                <span className="text-sm text-gray-700 font-normal">
                  {user?.email || "habibur.cse.diu@gmail.com"}
                </span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSignOut(!showSignOut);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <EllipsisVertical size={20} />
                </button>
                {showSignOut && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <div className="relative bg-white border border-gray-200 shadow-xl rounded-lg py-2 px-4 min-w-[100px]">
                      <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
                      <button
                        type="button"
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
          <div className="flex flex-col">
            <input
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleChange("contact", "email", e.target.value)}
              className={inputClass(errors["contact.email"])}
              placeholder="Enter your email address"
            />
            {errors["contact.email"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["contact.email"]}
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        {!isLoggedIn || isEditing ? (
          <DeliveryForm
            section="shipping"
            formData={formData.shipping}
            errors={errors}
            handleChange={(field, val) => handleChange("shipping", field, val)}
            handleLocationChange={handleLocationChange}
            setLabel={(val) => handleChange("shipping", "label", val)}
            divisionOptions={divisionOptions}
            cityOptions={shippingCityOptions}
            zoneOptions={shippingZoneOptions}
          />
        ) : (
          <div className="space-y-4">
            <AddressSection
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              selectedId={selectedAddressId}
              setSelectedId={setSelectedAddressId}
              addresses={addresses}
              listLoading={listLoading}
            />
          </div>
        )}
      </section>

      <PaymentSection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <section className="mt-8">
        <h2 className="text-xl! font-semibold! text-gray-800 mb-4">
          Billing address
        </h2>
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
          <div
            onClick={() => setBillingOption("same")}
            className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all border! ${billingOption === "same" ? "bg-[#F5F6FF] border-[#005BD1] z-10" : "bg-white border-transparent border-b-gray-200 hover:bg-gray-50"}`}
          >
            <div
              className={`relative w-5 h-5 rounded-full border transition-all ${billingOption === "same" ? "border-[#0066CC]! border-[6px]!" : "border-gray-300"}`}
            />
            <span
              className={`text-sm font-medium ${billingOption === "same" ? "text-gray-800" : "text-gray-700"}`}
            >
              Same as shipping address
            </span>
          </div>

          <div
            onClick={() => setBillingOption("different")}
            className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all border! ${billingOption === "different" ? "bg-[#F5F6FF] border-[#005BD1] z-10" : "bg-white border-transparent hover:bg-gray-50"}`}
          >
            <div
              className={`relative w-5 h-5 rounded-full border transition-all ${billingOption === "different" ? "border-[#0066CC]! border-[6px]!" : "border-gray-300"}`}
            />
            <span
              className={`text-sm font-medium ${billingOption === "different" ? "text-gray-800" : "text-gray-700"}`}
            >
              Use a different billing address
            </span>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${billingOption === "different" ? "max-h-[1000px] opacity-100 border-t border-gray-200" : "max-h-0 opacity-0"}`}
          >
            <div className="p-6 bg-[#F5F5F5]">
              <DeliveryForm
                section="billing"
                formData={formData.billing}
                errors={errors}
                handleChange={(field, val) =>
                  handleChange("billing", field, val)
                }
                handleLocationChange={handleLocationChange}
                setLabel={(val) => handleChange("billing", "label", val)}
                divisionOptions={divisionOptions}
                cityOptions={billingCityOptions}
                zoneOptions={billingZoneOptions}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="hidden lg:block">
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
