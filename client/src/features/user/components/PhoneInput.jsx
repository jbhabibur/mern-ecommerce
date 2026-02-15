import React from "react";
import { COUNTRY_CODES } from "../../../constants/locations";

export const PhoneInput = ({
  value,
  countryCode,
  onPhoneChange,
  onCodeChange,
}) => {
  const handleInputChange = (e) => {
    // 1. Keep only digits
    let inputVal = e.target.value.replace(/\D/g, "");

    // 2. Extract digits from selected country code
    const cleanCountryCode = countryCode.replace(/\D/g, "");

    // 3. Remove country code if it exists at the start of input
    if (cleanCountryCode && inputVal.startsWith(cleanCountryCode)) {
      inputVal = inputVal.slice(cleanCountryCode.length);
    }

    // 4. Optional: Remove leading zero (common for BD numbers)
    if (inputVal.startsWith("0")) {
      inputVal = inputVal.slice(1);
    }

    onPhoneChange(inputVal);
  };

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <div className="flex">
        {/* Country Picker */}
        <select
          value={countryCode}
          onChange={(e) => onCodeChange(e.target.value)}
          className="bg-gray-50 border border-gray-300 border-r-0 rounded-l-sm px-2 py-2 text-sm focus:border-cyan-500 outline-none cursor-pointer"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label} {c.code}
            </option>
          ))}
        </select>

        {/* Number Input */}
        <input
          type="tel"
          value={value}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          className="flex-1 border border-gray-300 rounded-r-sm px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-colors"
        />
      </div>
    </div>
  );
};
