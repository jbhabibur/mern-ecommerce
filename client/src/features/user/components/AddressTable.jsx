import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePen, Trash } from "lucide-react";
// Import the services
import {
  setDefaultAddress,
  deleteAddress,
} from "../../../services/addressService";

export const AddressTable = ({ addresses, refreshAddresses }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const handleSetDefault = async (addressId, type) => {
    const currentAddr = addresses.find((a) => a._id === addressId);
    const currentStatus =
      type === "shipping"
        ? currentAddr.isDefaultShipping
        : currentAddr.isDefaultBilling;

    try {
      setUpdatingId(`${addressId}-${type}`);

      // Using the service instead of fetch
      await setDefaultAddress(addressId, { type, status: !currentStatus });

      await refreshAddresses();
    } catch (err) {
      console.error("Update failed", err);
      // Optional: Add toast notification here for 'err.message'
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      // Using the service instead of fetch
      await deleteAddress(addressId);

      await refreshAddresses();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      {/* Table Header: Hidden on mobile/tablet, shown only on desktop */}
      <thead className="hidden lg:table-header-group">
        <tr className="bg-gray-50 border-b border-gray-100">
          <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
            Full Name
          </th>
          <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
            Address
          </th>
          <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
            Location
          </th>
          <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
            Phone
          </th>
          <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
            Status
          </th>
          <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100 block lg:table-row-group">
        {addresses.map((addr) => (
          <tr
            key={addr._id}
            className="hover:bg-gray-50 transition-colors flex flex-col lg:table-row py-5 lg:py-0 mb-4 lg:mb-0 border border-gray-100 lg:border-none rounded-md lg:rounded-none"
          >
            {/* Full Name */}
            <td className="px-4 py-2 lg:py-4 lg:px-4 text-sm text-gray-800 align-top block lg:table-cell">
              <span className="lg:hidden text-[10px] font-bold text-cyan-600 block uppercase mb-1">
                Full Name
              </span>
              <div className="font-semibold lg:font-normal">
                {addr.fullName}
              </div>
            </td>

            {/* Address */}
            <td className="px-4 py-2 lg:py-4 lg:px-4 text-sm text-gray-800 align-top block lg:table-cell lg:max-w-[250px]">
              <span className="lg:hidden text-[10px] font-bold text-cyan-600 block uppercase mb-1">
                Address
              </span>
              <p className="leading-relaxed lg:truncate lg:hover:whitespace-normal">
                {addr.houseAddress}
              </p>
            </td>

            {/* Location */}
            <td className="px-4 py-2 lg:py-4 lg:px-4 text-sm text-gray-600 align-top block lg:table-cell">
              <span className="lg:hidden text-[10px] font-bold text-cyan-600 block uppercase mb-1">
                Location
              </span>
              {`${addr.division}, ${addr.city}, ${addr.zone}`}
            </td>

            {/* Phone */}
            <td className="px-4 py-2 lg:py-4 lg:px-4 text-sm text-gray-600 align-top block lg:table-cell">
              <span className="lg:hidden text-[10px] font-bold text-cyan-600 block uppercase mb-1">
                Phone
              </span>
              {`${addr.countryCode} ${addr.phoneNumber}`}
            </td>

            {/* Status Toggles */}
            <td className="px-4 py-3 lg:py-4 lg:px-4 align-top block lg:table-cell">
              <span className="lg:hidden text-[10px] font-bold text-cyan-600 block uppercase mb-2">
                Set as Default
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={updatingId === `${addr._id}-shipping`}
                  onClick={() => handleSetDefault(addr._id, "shipping")}
                  className={`flex items-center gap-x-2 px-3 py-1.5 rounded border transition-all text-nowrap ${
                    addr.isDefaultShipping
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-gray-200 text-gray-400 hover:text-blue-500 cursor-pointer"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">
                    {updatingId === `${addr._id}-shipping` ? "..." : "Shipping"}
                  </span>
                  {addr.isDefaultShipping && (
                    <span className="text-[10px]">✓</span>
                  )}
                </button>

                <button
                  disabled={updatingId === `${addr._id}-billing`}
                  onClick={() => handleSetDefault(addr._id, "billing")}
                  className={`flex items-center gap-x-2 px-3 py-1.5 rounded border transition-all text-nowrap ${
                    addr.isDefaultBilling
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-400 hover:text-indigo-500 cursor-pointer"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">
                    {updatingId === `${addr._id}-billing` ? "..." : "Billing"}
                  </span>
                  {addr.isDefaultBilling && (
                    <span className="text-[10px]">✓</span>
                  )}
                </button>
              </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3 lg:py-4 lg:px-4 text-left lg:text-right align-middle block lg:table-cell border-t lg:border-none border-gray-50 bg-gray-50 lg:bg-transparent">
              <button
                onClick={() =>
                  navigate(`/account/edit-address/${addr._id}`, {
                    state: { addressData: addr },
                  })
                }
                className="text-cyan-600 hover:text-cyan-700 mr-4"
              >
                <SquarePen size={24} className="inline-block" />
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="text-cyan-600 hover:text-cyan-700"
              >
                <Trash size={24} className="inline-block" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
