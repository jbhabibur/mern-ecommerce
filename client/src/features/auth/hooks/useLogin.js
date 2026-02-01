import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/authService";

export const useLogin = () => {
  const navigate = useNavigate();

  // Initial state for login credentials
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: "",
    text: "",
    field: null,
  });

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when the user starts typing in the affected field
    if (statusMsg.field === name) {
      setStatusMsg({ type: "", text: "", field: null });
    }
  };

  const executeLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "", field: null });

    try {
      const response = await loginUser(formData);

      if (response.success) {
        // 1. Store authentication data in LocalStorage
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        // 2. Update status to reflect success
        setStatusMsg({
          type: "success",
          text: "Login Successful! Redirecting...",
        });

        // 3. Redirect to the home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      // Extract error message and specific field from backend response
      const errorMessage =
        error.response?.data?.message || "Invalid Email or Password";
      const errorField = error.response?.data?.field || null;

      setStatusMsg({ type: "error", text: errorMessage, field: errorField });
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, statusMsg, handleChange, executeLogin };
};
