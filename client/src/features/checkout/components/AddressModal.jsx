// import React from "react";
// import { X } from "lucide-react";
// import { DeliveryForm } from "./DeliveryForm";

// export const AddressModal = ({
//   isOpen,
//   onClose,
//   editingId,
//   formData,
//   errors,
//   handleChange,
//   handleDivisionChange,
//   handleCityChange,
//   divisionOptions,
//   cityOptions,
//   zoneOptions,
//   handleSubmit,
//   saveLoading,
//   refreshAddresses,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//         <div className="p-6 md:p-8">
//           {/* Modal Header */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-normal text-gray-800">
//               {editingId ? "Edit Address" : "Add New Address"}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Modal Body (Form) */}
//           <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
//             <DeliveryForm
//               formData={formData.shipping}
//               errors={errors}
//               handleChange={(field, val) =>
//                 handleChange("shipping", field, val)
//               }
//               handleDivisionChange={handleDivisionChange}
//               handleCityChange={handleCityChange}
//               handleLocationChange={(type, val) =>
//                 handleChange("shipping", type, val)
//               }
//               setLabel={(val) => handleChange("shipping", "label", val)}
//               divisionOptions={divisionOptions}
//               cityOptions={cityOptions}
//               zoneOptions={zoneOptions}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4 mt-8 border-t pt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-10 py-2.5 bg-gray-100 text-gray-600 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors uppercase"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={async () => {
//                 const result = await handleSubmit(
//                   editingId,
//                   async (payload) => {
//                     return payload;
//                   },
//                 );

//                 if (result?.success) {
//                   refreshAddresses();
//                   onClose();
//                 }
//               }}
//               disabled={saveLoading}
//               className="px-12 py-2.5 bg-orange-500 text-white rounded-sm text-sm font-medium hover:bg-orange-600 shadow-md transition-all uppercase disabled:bg-orange-300"
//             >
//               {saveLoading ? "Saving..." : editingId ? "Update" : "Save"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// AddressModal.jsx
import React from "react";
import { X } from "lucide-react";
import { DeliveryForm } from "./DeliveryForm";

export const AddressModal = ({
  isOpen,
  onClose,
  section,
  formData,
  errors,
  handleChange,
  handleLocationChange,
  setLabel,
  divisionOptions,
  cityOptions,
  zoneOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-normal text-gray-800">
              {section === "shipping" ? "Shipping Address" : "Billing Address"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* --- FORM --- */}
          <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            <DeliveryForm
              section={section}
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleLocationChange={handleLocationChange}
              setLabel={setLabel}
              divisionOptions={divisionOptions}
              cityOptions={cityOptions}
              zoneOptions={zoneOptions}
            />
          </div>

          {/* --- FOOTER BUTTONS (Save temporarily does nothing) --- */}
          <div className="flex justify-end gap-4 mt-8 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-2.5 bg-gray-100 text-gray-600 rounded-sm text-sm font-medium hover:bg-gray-200 transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => alert("Typing works! Form state is updating.")}
              className="px-12 py-2.5 bg-orange-500 text-white rounded-sm text-sm font-medium hover:bg-orange-600 shadow-md transition-all uppercase"
            >
              Save (Dummy)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
