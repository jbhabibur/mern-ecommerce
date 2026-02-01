import { useState } from "react";
import { registerUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subscribe: false,
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: "",
    text: "",
    field: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (statusMsg.field === name) {
      setStatusMsg({ type: "", text: "", field: null });
    }
  };

  const executeRegistration = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "", field: null });

    const dataToSubmit = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      isSubscribed: formData.subscribe,
    };

    try {
      const response = await registerUser(dataToSubmit);

      console.log("Server Response:", response);

      // PROFESSIONAL REDIRECT
      // 'allowed: true' acts as a secret key to grant access to the OTP page
      // 'replace: true' removes the register page from history for better UX
      navigate("/account/verify-otp", {
        state: {
          allowed: true,
          email: formData.email,
        },
        replace: true,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        subscribe: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      const errorField = error.response?.data?.field || null;

      setStatusMsg({ type: "error", text: errorMessage, field: errorField });
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, statusMsg, handleChange, executeRegistration };
};
