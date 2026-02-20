import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export const DeliveryForm = ({
  formData,
  errors,
  handleChange,
  handleDivisionChange,
  handleCityChange,
  divisionOptions,
  cityOptions,
  zoneOptions,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const inputClass = (error) =>
    `w-full border ${error ? "border-red-500" : "border-gray-300"} rounded-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors bg-white`;
  const labelClass = "block text-sm text-gray-600 mb-1 font-normal";

  return (
    <section className="space-y-5">
      <h2 className="text-xl! font-semibold! text-gray-800">Delivery</h2>

      {/* Country/Region (Static) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="country" className="text-sm font-medium text-gray-700">
          Country/Region <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="country"
            className={`${inputClass(false)} appearance-none bg-white border-gray-200 w-full`}
            disabled
          >
            <option>Bangladesh</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* First Name & Last Name Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className={`${inputClass(errors.firstName)} border-gray-200`}
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className={`${inputClass(errors.lastName)} border-gray-200`}
          />
        </div>
      </div>

      {/* Division Selection */}
      <div>
        <label className={labelClass}>
          Division <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={formData.division}
            onChange={(e) => handleDivisionChange(e.target.value)}
            className={`${inputClass(errors.division)} appearance-none`}
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
          <ChevronDown
            size={16}
            className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* City & Zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              disabled={!formData.division}
              value={formData.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className={`${inputClass(errors.city)} appearance-none disabled:bg-gray-50`}
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
            <ChevronDown
              size={16}
              className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Zone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              disabled={!formData.city}
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className={`${inputClass(errors.zone)} appearance-none disabled:bg-gray-50`}
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
            <ChevronDown
              size={16}
              className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Detailed Address & Landmark */}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>
            Detailed Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="houseAddress"
            value={formData.houseAddress}
            onChange={handleChange}
            placeholder="Please enter your address"
            className={inputClass(errors.houseAddress)}
          />
        </div>

        <div>
          <label className={labelClass}>Landmark (Optional)</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="E.g. beside train station"
            className={inputClass(false)}
          />
        </div>
      </div>

      {/* Phone with Tooltip */}
      <div>
        <label className={labelClass}>
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          {/* Tooltip Wrapper */}
          <div className="relative group">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className={inputClass(errors.phoneNumber)}
            />
            <div className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
              <HelpCircle
                onMouseEnter={() => setIsHovered(!isHovered)}
                size={18}
              />
              {isHovered && (
                <div className="absolute bottom-full mb-2 right-0 w-48 hidden group-hover:block z-50">
                  <div className="bg-[#1a1a1a] text-white text-[11px] p-3 rounded-lg shadow-xl leading-tight">
                    In case we need to contact you about your order
                    <div className="absolute top-full right-2 border-8 border-transparent border-t-[#1a1a1a]"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
