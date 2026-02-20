import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export const BillingAddressForm = ({
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
    <div className="space-y-4">
      {/* Country Selection */}
      <div>
        <label className={labelClass}>
          Country/Region <span className="text-gray-400">*</span>
        </label>
        <div className="relative">
          <select
            className={`${inputClass(false)} appearance-none bg-white pr-10 disabled:bg-gray-50`}
            disabled
          >
            <option>Bangladesh</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Name Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            First name <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            name="billingFirstName"
            placeholder="First name"
            className={inputClass(false)}
          />
        </div>

        <div>
          <label className={labelClass}>
            Last name <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            name="billingLastName"
            placeholder="Last name"
            className={inputClass(errors?.billingLastName)}
          />
        </div>
      </div>

      {/* Division, City, Zone */}
      <div className="space-y-4">
        {/* Division Selection */}
        <div>
          <label className={labelClass}>
            Division <span className="text-gray-400">*</span>
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
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* City & Zone Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* City Selection */}
          <div>
            <label className={labelClass}>
              City <span className="text-gray-400">*</span>
            </label>
            <div className="relative">
              <select
                disabled={!formData.division}
                value={formData.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className={`${inputClass(errors.city)} appearance-none disabled:bg-gray-50`}
              >
                <option value="" hidden>
                  City
                </option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Zone Selection */}
          <div>
            <label className={labelClass}>
              Zone <span className="text-gray-400">*</span>
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
                  Zone
                </option>
                {zoneOptions.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Field */}
      <div>
        <label className={labelClass}>
          Detailed Address <span className="text-gray-400">*</span>
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

      {/* Landmark (Optional) */}
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

      {/* Phone with Tooltip */}
      <div>
        <label className={labelClass}>
          Phone <span className="text-gray-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            className={inputClass(errors.phoneNumber)}
          />

          {/* Tooltip Wrapper - Moved 'group' here for precise icon-only hover */}
          <div className="absolute right-3 top-2.5 text-gray-400 cursor-help group">
            <HelpCircle size={18} />

            {/* Smooth Animated Tooltip */}
            <div
              className="absolute bottom-full mb-2 right-0 w-48 
                      opacity-0 invisible translate-y-1
                      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 
                      transition-all duration-300 ease-in-out z-50 pointer-events-none"
            >
              <div className="bg-[#1a1a1a] text-white text-[11px] p-3 rounded shadow-xl leading-tight relative">
                In case we need to contact you about your order
                {/* Tooltip Arrow */}
                <div className="absolute top-full right-2 border-8 border-transparent border-t-[#1a1a1a]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
