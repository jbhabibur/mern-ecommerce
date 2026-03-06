import { useState, useCallback } from "react";

export const useAddressForm = () => {
  const [loading, setLoading] = useState(false); // Track API submission state
  const [formData, setFormData] = useState({
    contact: { email: "" },
    shipping: {
      fullName: "",
      phone: "",
      address: "",
      division: "",
      city: "",
      zone: "",
      landmark: "",
      label: "HOME",
    },
    billing: {
      fullName: "",
      phone: "",
      address: "",
      division: "",
      city: "",
      zone: "",
      landmark: "",
      label: "HOME",
    },
  });

  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = useCallback((section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

    const errorKey = `${section}.${field}`;
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors[errorKey]) delete newErrors[errorKey];
      return newErrors;
    });
  }, []);

  const handleLocationChange = (section, type, value) => {
    setFormData((prev) => {
      const updatedSection = { ...prev[section], [type]: value };
      if (type === "division") {
        updatedSection.city = "";
        updatedSection.zone = "";
      } else if (type === "city") {
        updatedSection.zone = "";
      }
      return { ...prev, [section]: updatedSection };
    });

    const errorKey = `${section}.${type}`;
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[errorKey];
      return newErrors;
    });
  };

  // --- UPDATED VALIDATION LOGIC ---
  const validateForm = (isActuallyLoggedIn, billingOption) => {
    let newErrors = {};

    // 1. Contact Validation (Only for Guest)
    if (!isActuallyLoggedIn) {
      const email = formData.contact.email;
      if (!email) {
        newErrors["contact.email"] = "Email is required";
      } else if (!isValidEmail(email)) {
        newErrors["contact.email"] = "Invalid email format";
      }
    }

    const validateSection = (section) => {
      const data = formData[section];
      const required = [
        { key: "fullName", label: "Full name" },
        { key: "phone", label: "Phone number" },
        { key: "address", label: "Detailed address" },
        { key: "division", label: "Division" },
        { key: "city", label: "City" },
        { key: "zone", label: "Zone" },
      ];

      required.forEach((f) => {
        if (!data[f.key] || data[f.key].trim() === "") {
          newErrors[`${section}.${f.key}`] = `${f.label} is required`;
        }
      });
    };

    // 2. Shipping Validation: Only validate manual shipping form if NOT logged in
    if (!isActuallyLoggedIn) {
      validateSection("shipping");
    }

    // 3. Billing Validation: Always validate if 'different' is chosen
    if (billingOption === "different") {
      validateSection("billing");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFinalData = (
    isActuallyLoggedIn,
    loggedInUserAddress,
    billingOption,
  ) => {
    const contactInfo = { ...formData.contact };

    let finalShipping =
      isActuallyLoggedIn && loggedInUserAddress
        ? { ...loggedInUserAddress }
        : { ...formData.shipping };

    let finalBilling =
      billingOption === "same" ? { ...finalShipping } : { ...formData.billing };

    return {
      contact: contactInfo,
      shippingAddress: finalShipping,
      billingAddress: finalBilling,
    };
  };

  /**
   * HANDLE SUBMISSION (NEW)
   * This function maps state fields to match the database schema
   * (e.g., 'phone' -> 'phoneNumber' and 'address' -> 'houseAddress')
   */
  const handleSubmit = async (editingId, apiFunction) => {
    // Map internal state to Backend/API field names
    const payload = {
      fullName: formData.shipping.fullName,
      phoneNumber: formData.shipping.phone,
      division: formData.shipping.division,
      city: formData.shipping.city,
      zone: formData.shipping.zone,
      houseAddress: formData.shipping.address,
      label: formData.shipping.label,
    };

    setLoading(true);
    try {
      // If editingId exists, we update; otherwise, we create.
      const response = editingId
        ? await apiFunction(editingId, payload)
        : await apiFunction(payload);

      return { success: true, data: response };
    } catch (err) {
      console.error("Address Submission Error:", err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleLocationChange,
    handleDivisionChange: (val) =>
      handleLocationChange("shipping", "division", val),
    handleCityChange: (val) => handleLocationChange("shipping", "city", val),
    validateForm,
    getFinalData,
    setFormData,
    handleSubmit,
  };
};
