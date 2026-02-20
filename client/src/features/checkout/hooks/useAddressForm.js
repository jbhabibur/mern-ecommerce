import { useState, useCallback } from "react";

export const useAddressForm = () => {
  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    shipping: {
      firstName: "",
      lastName: "",
      address: "",
      division: "",
      city: "",
      zone: "",
      zipCode: "",
      phone: "",
    },
    billing: {
      firstName: "",
      lastName: "",
      address: "",
      division: "",
      city: "",
      zone: "",
      zipCode: "",
      phone: "",
    },
  });

  const [errors, setErrors] = useState({});

  // 2. Generic Change Handler
  // Section: 'shipping' or 'billing'
  const handleChange = useCallback(
    (section, field, value) => {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));

      // Error clear kora jodi user type kora shuru kore
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`${section}.${field}`];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // 3. Bangladesh Specific Location Handlers (Example Logic)
  const handleLocationChange = (section, type, value) => {
    setFormData((prev) => {
      const updatedSection = { ...prev[section], [type]: value };

      // Reset dependent fields
      if (type === "division") {
        updatedSection.city = "";
        updatedSection.zone = "";
      } else if (type === "city") {
        updatedSection.zone = "";
      }

      return { ...prev, [section]: updatedSection };
    });
  };

  // 4. Validation Logic
  const validateForm = (isLoggedIn, billingOption) => {
    let newErrors = {};
    const validateSection = (section) => {
      const data = formData[section];
      if (!data.firstName)
        newErrors[`${section}.firstName`] = "First name is required";
      if (!data.address)
        newErrors[`${section}.address`] = "Address is required";
      if (!data.phone)
        newErrors[`${section}.phone`] = "Phone number is required";
      if (!/^\d{11}$/.test(data.phone))
        newErrors[`${section}.phone`] = "Invalid phone number";
    };

    // Guest hole shipping validate korbo
    if (!isLoggedIn) {
      validateSection("shipping");
    }

    // Billing different hole billing-o validate korbo
    if (billingOption === "different") {
      validateSection("billing");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Final Data Retrieval Logic
  const getFinalData = (isLoggedIn, loggedInUserAddress, billingOption) => {
    let finalShipping = {};
    let finalBilling = {};

    // Shipping Logic
    if (isLoggedIn && loggedInUserAddress) {
      // User logged in thakle tar select kora saved address nibe
      finalShipping = { ...loggedInUserAddress };
    } else {
      // Guest hole form theke data nibe
      finalShipping = { ...formData.shipping };
    }

    // Billing Logic
    if (billingOption === "same") {
      // Shipping tai billing snapshot hoye jabe
      finalBilling = { ...finalShipping };
    } else {
      // Alada billing thakle form theke nibe
      finalBilling = { ...formData.billing };
    }

    return {
      shippingAddress: finalShipping,
      billingAddress: finalBilling,
    };
  };

  return {
    formData,
    errors,
    handleChange,
    handleLocationChange,
    validateForm,
    getFinalData,
    setFormData,
    // Ekhane divisionOptions, cityOptions gulo API/Static data theke pass korte paren
  };
};
