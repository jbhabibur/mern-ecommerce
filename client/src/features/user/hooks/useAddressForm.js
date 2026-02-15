import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { BD_LOCATIONS, COUNTRY_CODES } from "../../../constants/locations";
// 1. Ensure both services are imported
import { createAddress, updateAddress } from "../../../services/addressService";

export const useAddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    countryCode: "+880",
    landmark: "",
    division: "",
    city: "",
    zone: "",
    houseAddress: "",
    label: "HOME",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const divisionOptions = useMemo(() => Object.keys(BD_LOCATIONS), []);

  const cityOptions = useMemo(() => {
    if (!formData.division) return [];
    return Object.keys(BD_LOCATIONS[formData.division] || {});
  }, [formData.division]);

  const zoneOptions = useMemo(() => {
    if (!formData.division || !formData.city) return [];
    return BD_LOCATIONS[formData.division][formData.city] || [];
  }, [formData.division, formData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDivisionChange = (value) => {
    setFormData((prev) => ({ ...prev, division: value, city: "", zone: "" }));
  };

  const handleCityChange = (value) => {
    setFormData((prev) => ({ ...prev, city: value, zone: "" }));
  };

  const setLabel = (labelValue) => {
    setFormData((prev) => ({ ...prev, label: labelValue }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.division) newErrors.division = "Division is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.zone) newErrors.zone = "Zone is required";
    if (!formData.houseAddress.trim())
      newErrors.houseAddress = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Main submit logic
   */
  const handleSubmit = async (e, callback, isEdit = false) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(isEdit ? "Updating..." : "Saving...");

    try {
      let response;
      if (isEdit) {
        // 2. Use the correct ID from formData (usually _id from MongoDB)
        const targetId = formData._id || formData.id;
        response = await updateAddress(targetId, formData);
      } else {
        response = await createAddress(formData);
      }

      // 3. Success condition - Trigger callback for navigation
      if (response.success || response) {
        toast.success(isEdit ? "Updated!" : "Saved!", { id: loadingToast });

        if (callback) {
          callback(response.data); // This triggers the navigate() in your component
        }
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error.message || "Something went wrong", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    loading,
    divisionOptions,
    cityOptions,
    zoneOptions,
    handleChange,
    handleDivisionChange,
    handleCityChange,
    setLabel,
    handleSubmit,
  };
};
