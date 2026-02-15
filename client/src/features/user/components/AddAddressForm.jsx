import React, { useEffect } from "react";
import { Briefcase, Home } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { PhoneInput } from "../components/PhoneInput";
import { useAddressForm } from "../hooks/useAddressForm";

export const AddAddressForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const {
    formData,
    setFormData,
    errors,
    loading,
    handleChange,
    handleDivisionChange,
    handleCityChange,
    setLabel,
    cityOptions,
    zoneOptions,
    handleSubmit,
    divisionOptions,
  } = useAddressForm();

  // Populate form if editing existing data
  useEffect(() => {
    if (location.state?.addressData) {
      setFormData(location.state.addressData);
    }
  }, [location.state, setFormData]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-sm">
      <h2 className="text-xl font-normal text-gray-800 mb-6">
        {id ? "Edit Address" : "Add New Address"}
      </h2>

      <form
        onSubmit={(e) =>
          handleSubmit(e, (data) => navigate("/account/address"), !!id)
        }
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
      >
        {/* Left Column */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <PhoneInput
              value={formData.phoneNumber}
              countryCode={formData.countryCode}
              onPhoneChange={(val) =>
                handleChange({ target: { name: "phoneNumber", value: val } })
              }
              onCodeChange={(val) =>
                handleChange({ target: { name: "countryCode", value: val } })
              }
              error={errors.phoneNumber}
            />
            {errors.phoneNumber ? (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-1">
                Format: +880 1XXXXXXXXX
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="E.g. beside train station"
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.division}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className={`w-full border ${errors.division ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm bg-white focus:border-cyan-500 outline-none appearance-none cursor-pointer`}
            >
              <option value="" hidden>
                Please choose your Division
              </option>
              {divisionOptions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
            {errors.division && (
              <p className="text-xs text-red-500 mt-1">{errors.division}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              disabled={!formData.division}
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className={`w-full border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm bg-white focus:border-cyan-500 outline-none appearance-none cursor-pointer disabled:bg-gray-50!`}
            >
              <option value="" hidden>
                Please choose your city
              </option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Zone <span className="text-red-500">*</span>
            </label>
            <select
              disabled={!formData.city}
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className={`w-full border ${errors.zone ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm bg-white focus:border-cyan-500 outline-none appearance-none cursor-pointer disabled:bg-gray-50!`}
            >
              <option value="" hidden>
                Please choose your Zone
              </option>
              {zoneOptions.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            {errors.zone && (
              <p className="text-xs text-red-500 mt-1">{errors.zone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Detailed Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="houseAddress"
              value={formData.houseAddress}
              onChange={handleChange}
              placeholder="Please enter your address"
              className={`w-full border ${errors.houseAddress ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors`}
            />
            {errors.houseAddress && (
              <p className="text-xs text-red-500 mt-1">{errors.houseAddress}</p>
            )}
          </div>

          <div className="md:col-span-2 mt-2">
            <p className="text-sm text-gray-600 mb-3">Select a label:</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setLabel("OFFICE")}
                className={`flex items-center gap-2 px-6 py-2 border rounded-sm text-sm transition-all ${
                  formData.label === "OFFICE"
                    ? "border-cyan-500 text-cyan-600 bg-cyan-50"
                    : "border-gray-300 text-gray-500 hover:border-gray-400"
                }`}
              >
                <Briefcase size={16} /> OFFICE
              </button>
              <button
                type="button"
                onClick={() => setLabel("HOME")}
                className={`flex items-center gap-2 px-6 py-2 border rounded-sm text-sm transition-all ${
                  formData.label === "HOME"
                    ? "border-orange-500 text-orange-600 bg-orange-50 shadow-sm"
                    : "border-gray-300 text-gray-500 hover:border-gray-400"
                }`}
              >
                <Home size={16} /> HOME
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-8 border-t pt-6">
          <button
            onClick={() => navigate("/account/address")}
            type="button"
            disabled={loading}
            className="px-10 py-2.5 bg-gray-100 text-gray-600 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors uppercase disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-2.5 bg-orange-500 text-white rounded-sm text-sm font-medium hover:bg-orange-600 shadow-md transition-all uppercase disabled:bg-orange-300"
          >
            {loading ? "Saving..." : id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
