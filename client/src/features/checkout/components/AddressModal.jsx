import React from "react";
import { X } from "lucide-react";
import { DeliveryForm } from "./DeliveryForm";

export const AddressModal = ({
  isOpen,
  onClose,
  editingId,
  formData,
  errors,
  handleChange,
  handleDivisionChange,
  handleCityChange,
  setLabel,
  divisionOptions,
  cityOptions,
  zoneOptions,
  handleSubmit,
  saveLoading,
  refreshAddresses,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-normal text-gray-800">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body (Form) */}
          <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            <DeliveryForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleDivisionChange={handleDivisionChange}
              handleCityChange={handleCityChange}
              setLabel={setLabel}
              divisionOptions={divisionOptions}
              cityOptions={cityOptions}
              zoneOptions={zoneOptions}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-2.5 bg-gray-100 text-gray-600 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              onClick={(e) =>
                handleSubmit(
                  e,
                  () => {
                    refreshAddresses();
                    onClose();
                  },
                  !!editingId,
                )
              }
              disabled={saveLoading}
              className="px-12 py-2.5 bg-orange-500 text-white rounded-sm text-sm font-medium hover:bg-orange-600 shadow-md transition-all uppercase disabled:bg-orange-300"
            >
              {saveLoading ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
