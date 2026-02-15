import React from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import components
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";
import { AddressTable } from "./AddressTable";

// Import hooks
import { useAddresses } from "../hooks/useAddressesBook";

export const AddressBook = () => {
  const { addresses, isLoading, error, refreshAddresses, toggleDefault } =
    useAddresses();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-sm min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-2" />
        <p className="text-gray-500 text-sm">Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white p-6 rounded-sm min-h-[400px] flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p className="font-medium text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 md:p-6 rounded-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-lg md:text-2xl font-normal text-gray-800">
          Address Book
        </h2>

        {/* Responsive Button: Icon on mobile, Text + Icon on Desktop */}
        <div>
          <PrimaryButton
            text="Add New Address"
            icon={Plus}
            responsive={true}
            onClick={() => navigate("/account/add-new-address")}
          />
        </div>
      </div>

      {/* Content Section - No Scroll */}
      <div className="w-full">
        {addresses && addresses.length > 0 ? (
          <div className="w-full border-t border-gray-100">
            {/* The table tag itself must be block on mobile to prevent overflow */}
            <table className="w-full block lg:table">
              <AddressTable
                addresses={addresses}
                refreshAddresses={refreshAddresses}
                onToggleDefault={toggleDefault}
              />
            </table>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded">
            <p className="text-gray-400 italic text-sm">
              No addresses saved yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
