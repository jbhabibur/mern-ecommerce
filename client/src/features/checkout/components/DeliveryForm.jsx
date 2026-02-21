import React from "react";
import { Briefcase, Home } from "lucide-react";

export const DeliveryForm = ({
  section, // Used to identify "shipping" or "billing"
  formData,
  errors,
  handleChange,
  handleLocationChange,
  setLabel,
  divisionOptions,
  cityOptions,
  zoneOptions,
}) => {
  // Helper to check for errors in the current section
  const hasError = (fieldName) => errors[`${section}.${fieldName}`];

  // Helper for conditional class styling
  const getInputClass = (fieldName) =>
    `w-full border ${hasError(fieldName) ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm outline-none focus:border-cyan-500 transition-colors`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      {/* Left Column */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter full name"
            className={getInputClass("fullName")}
          />
          {hasError("fullName") && (
            <p className="text-red-500 text-xs mt-1">{hasError("fullName")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone || ""} // Updated key to 'phone'
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className={getInputClass("phone")}
          />
          {hasError("phone") && (
            <p className="text-red-500 text-xs mt-1">{hasError("phone")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Landmark (Optional)
          </label>
          <input
            type="text"
            value={formData.landmark || ""}
            onChange={(e) => handleChange("landmark", e.target.value)}
            placeholder="E.g. beside train station"
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-cyan-500"
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
            value={formData.division || ""}
            onChange={(e) =>
              handleLocationChange(section, "division", e.target.value)
            }
            className={getInputClass("division")}
          >
            <option value="" hidden>
              Please choose Division
            </option>
            {divisionOptions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
          {hasError("division") && (
            <p className="text-red-500 text-xs mt-1">{hasError("division")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            disabled={!formData.division}
            value={formData.city || ""}
            onChange={(e) =>
              handleLocationChange(section, "city", e.target.value)
            }
            className={getInputClass("city")}
          >
            <option value="" hidden>
              Please choose city
            </option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {hasError("city") && (
            <p className="text-red-500 text-xs mt-1">{hasError("city")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Zone <span className="text-red-500">*</span>
          </label>
          <select
            disabled={!formData.city}
            value={formData.zone || ""}
            onChange={(e) => handleChange("zone", e.target.value)}
            className={getInputClass("zone")}
          >
            <option value="" hidden>
              Please choose Zone
            </option>
            {zoneOptions.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          {hasError("zone") && (
            <p className="text-red-500 text-xs mt-1">{hasError("zone")}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Detailed Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address || ""} // Updated key to 'address'
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Please enter your address"
            className={getInputClass("address")}
          />
          {hasError("address") && (
            <p className="text-red-500 text-xs mt-1">{hasError("address")}</p>
          )}
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-3">Select a label:</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setLabel("OFFICE")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-sm text-sm transition-all ${formData.label === "OFFICE" ? "border-cyan-500 text-cyan-600 bg-cyan-50" : "border-gray-300 text-gray-500"}`}
            >
              <Briefcase size={16} /> OFFICE
            </button>
            <button
              type="button"
              onClick={() => setLabel("HOME")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 border rounded-sm text-sm transition-all ${formData.label === "HOME" ? "border-orange-500 text-orange-600 bg-orange-50 shadow-sm" : "border-gray-300 text-gray-500"}`}
            >
              <Home size={16} /> HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
