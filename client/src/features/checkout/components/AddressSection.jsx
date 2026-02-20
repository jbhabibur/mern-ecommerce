import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DeliveryForm } from "./DeliveryForm";

export const AddressSection = () => {
  // Initial Mock Data
  const initialData = {
    firstName: "Md Habibur",
    lastName: "Rahman",
    division: "Dhaka",
    city: "Savar",
    zone: "Savar Polli Biddut",
    houseAddress: "সাভারের এমপি শফিকুল ইসলামের বাড়ির সামনে",
    landmark: "Rosni Jame Mosjid",
    phoneNumber: "1621161532",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Accordion state
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Mock Options (Apnar useAddressForm hook thakle ogulo props theke nite paren)
  const divisionOptions = ["Dhaka", "Chittagong"];
  const cityOptions = ["Savar", "Gazipur"];
  const zoneOptions = ["Savar Polli Biddut", "Savar Canttonment"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDivisionChange = (val) =>
    setFormData({ ...formData, division: val });

  const handleCityChange = (val) => setFormData({ ...formData, city: val });

  const handleSave = () => {
    // API call ba logic ekhane hobe
    setIsEditing(false);
    setIsOpen(false);
  };

  return (
    <div className="w-full transition-all duration-300">
      {!isEditing ? (
        /* --- View Mode with Smooth Accordion --- */
        <div className="overflow-hidden  border-b border-[#DEDEDE] pb-3">
          {/* Clickable Header Area */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer transition-colors"
          >
            {/* Top Row: Ship to and Action Buttons */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400 font-normal">Ship to</span>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Accordion toggle off kore editing mode e jabe
                    setIsEditing(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change
                </button>
                <ChevronDown
                  size={28}
                  className={`text-[#005BD1] p-1 rounded bg-[#F3F7FD] font-bold transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Bottom Row: Brief Address (Only visible when closed) */}
            {!isOpen && (
              <div className="transition-all duration-300">
                <p className="text-[15px] text-gray-800 font-normal">
                  {formData.houseAddress}
                </p>
              </div>
            )}
          </div>

          {/* Accordion Content Area: Open hole full detail dekhabe */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="pt-4 text-sm text-gray-700 border-t border-gray-100 space-y-1 bg-white">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">
                  Default Shipping Address
                </p>
                <h3 className="text-base font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-gray-600">{formData.houseAddress}</p>
                <p className="text-gray-600">
                  {formData.division} - {formData.city} - {formData.zone}
                </p>
                <p className="text-gray-900 font-semibold pt-1">
                  (+880) {formData.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- Edit Mode (Form) --- */
        <div className="bg-white p-6 border border-gray-200 rounded-none shadow-md">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Delivery Details
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Delivery Form component call */}
          <DeliveryForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleDivisionChange={handleDivisionChange}
            handleCityChange={handleCityChange}
            divisionOptions={divisionOptions}
            cityOptions={cityOptions}
            zoneOptions={zoneOptions}
          />

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-black text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Save and Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
