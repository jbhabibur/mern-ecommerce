import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Loader2, Plus, MoreVertical } from "lucide-react";
import { useAddress } from "../hooks/useAddress";
import { useAddressForm } from "../hooks/useAddressForm";
import { BD_LOCATIONS } from "../../../constants/locations";
import { AddressModal } from "./AddressModal";

// ১. প্যারেন্ট থেকে প্রপস গ্রহণ করা হচ্ছে
export const AddressSection = ({
  selectedId,
  setSelectedId,
  addresses,
  listLoading,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTooltipId, setShowTooltipId] = useState(null);

  const tooltipRef = useRef(null);

  // refreshAddresses ফাংশনটি Modal এর জন্য প্রয়োজন তাই এখানে রাখা হয়েছে
  const { refreshAddresses } = useAddress();

  const {
    formData,
    setFormData,
    errors,
    loading: saveLoading,
    handleChange,
    handleDivisionChange,
    handleCityChange,
    setLabel,
    handleSubmit,
  } = useAddressForm();

  // Initial auto-select: প্যারেন্টের setSelectedId ব্যবহার করবে
  useEffect(() => {
    if (addresses?.length > 0 && !selectedId) {
      const defaultAddr =
        addresses.find((a) => a.isDefaultShipping) || addresses[0];
      setSelectedId(defaultAddr._id);
    }
  }, [addresses, selectedId, setSelectedId]);

  // Handle click outside for tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltipId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      fullName: "",
      phoneNumber: "",
      division: "",
      city: "",
      zone: "",
      houseAddress: "",
      label: "HOME",
    });
    setShowModal(true);
  };

  const handleEditClick = (addr) => {
    setEditingId(addr._id);
    setFormData(addr);
    setShowModal(true);
    setShowTooltipId(null);
  };

  const divisionOptions = useMemo(() => Object.keys(BD_LOCATIONS || {}), []);
  const cityOptions = useMemo(
    () =>
      formData.division
        ? Object.keys(BD_LOCATIONS[formData.division] || {})
        : [],
    [formData.division],
  );

  const zoneOptions = useMemo(
    () =>
      formData.division && formData.city
        ? BD_LOCATIONS[formData.division][formData.city] || []
        : [],
    [formData.division, formData.city],
  );

  if (listLoading)
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="animate-spin text-[#005BD1]" />
      </div>
    );

  return (
    <div className="w-full font-sans border-b border-[#DEDEDE] pb-2">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-start px-1">
        <div>
          <span className="text-[14px] text-gray-400 font-semibold uppercase tracking-wider block">
            Ship to
          </span>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Select your address
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-gray-50 rounded-full transition-all active:scale-90 mt-1"
        >
          <ChevronDown
            size={20}
            className={`text-[#005BD1] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* --- ACCORDION CONTENT --- */}
      <div
        className={`space-y-3 transition-all duration-500 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        {addresses?.map((addr) => (
          <div
            key={addr._id}
            onClick={() => setSelectedId(addr._id)}
            className={`group relative flex items-start gap-4 p-1 rounded border transition-all duration-300 cursor-pointer ${
              selectedId === addr._id
                ? "bg-[#F4F8FF] border-[#005BD1]/20 shadow-[0_4px_20px_-4px_rgba(0,91,209,0.08)]"
                : "bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50/30"
            }`}
          >
            {/* Modern Animated Checkbox */}
            <div className="mt-1">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedId === addr._id
                    ? "border-[#005BD1] bg-[#005BD1]"
                    : "border-gray-300 bg-white"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    selectedId === addr._id
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0"
                  }`}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* Address Details */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2.5 mb-1.5">
                <h3
                  className={`text-[15px]! font-bold! tracking-tight transition-colors ${
                    selectedId === addr._id
                      ? "text-slate-900"
                      : "text-slate-700"
                  }`}
                >
                  {addr.fullName}
                </h3>

                {addr.label && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border tracking-widest uppercase transition-all ${
                      selectedId === addr._id
                        ? "bg-blue-50 border-blue-100 text-[#005BD1]"
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                  >
                    {addr.label}
                  </span>
                )}
              </div>

              <p className="text-[14px] text-slate-600 leading-snug font-medium m-0">
                {addr.houseAddress}
              </p>

              <div className="flex items-center gap-1.5 mt-1.5">
                {addr.division && (
                  <p className="text-[13px] text-slate-400 font-medium m-0">
                    {addr.division}
                  </p>
                )}

                {addr.city && (
                  <>
                    {addr.division && (
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                    )}
                    <p className="text-[13px] text-slate-400 font-medium m-0">
                      {addr.city}
                    </p>
                  </>
                )}

                {addr.zone && (
                  <>
                    {(addr.division || addr.city) && (
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                    )}
                    <p className="text-[13px] text-slate-400 m-0">
                      {addr.zone}
                    </p>
                  </>
                )}
              </div>

              {addr.phoneNumber && (
                <p className="text-[12px] text-slate-400 mt-3 font-mono tracking-tight">
                  {addr.countryCode || "+880"} {addr.phoneNumber}
                </p>
              )}
            </div>

            {/* Action Menu */}
            <div
              className="relative"
              ref={showTooltipId === addr._id ? tooltipRef : null}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltipId(
                    showTooltipId === addr._id ? null : addr._id,
                  );
                }}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-300 group-hover:text-gray-500"
              >
                <MoreVertical size={18} />
              </button>

              {showTooltipId === addr._id && (
                <div className="absolute right-0 bottom-full mb-3 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(addr);
                    }}
                    className="bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-xl px-6 py-2.5 text-[#005BD1] text-sm font-bold hover:bg-gray-50 whitespace-nowrap relative"
                  >
                    Edit
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add New Button */}
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2.5 text-[#005BD1] text-[15px] font-bold mt-4 py-3 px-1 hover:opacity-70 transition-all active:scale-[0.98]"
        >
          <div className="bg-[#EBF3FF] p-1 rounded-md">
            <Plus size={18} strokeWidth={3} />
          </div>
          Use a different address
        </button>
      </div>

      <AddressModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
        }}
        editingId={editingId}
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleDivisionChange={handleDivisionChange}
        handleCityChange={handleCityChange}
        setLabel={setLabel}
        divisionOptions={divisionOptions}
        cityOptions={cityOptions}
        zoneOptions={zoneOptions}
        handleSubmit={handleSubmit}
        saveLoading={saveLoading}
        refreshAddresses={refreshAddresses}
      />
    </div>
  );
};
