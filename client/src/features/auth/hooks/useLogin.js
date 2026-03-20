import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, resendVerification } from "../../../services/authService";
import { setLogin } from "../../../redux/slices/authSlice";
import { closeAuthDrawer } from "../../../redux/slices/authDrawerSlice";

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: "",
    message: "",
    field: null,
    canVerify: false,
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatusMsg((prev) =>
      prev.message
        ? { type: "", message: "", field: null, canVerify: false }
        : prev,
    );
  }, []);

  const executeLogin = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }

    setLoading(true);
    setStatusMsg({ type: "", message: "", field: null, canVerify: false });

    try {
      const response = await loginUser(formData);
      const { data } = response;

      if (data && data.success) {
        // 1. Calculate redirection path
        const searchParams = new URLSearchParams(window.location.search);
        const returnTo = searchParams.get("return_to");
        const redirectPath = returnTo ? decodeURIComponent(returnTo) : "/";

        // 2. Persist data silently (No UI change triggered yet)
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 3. UI transition delay (Allow user to see "Success" state if you have one)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 4. Update Redux state
        // We do this right before navigating so the 'isLoggedIn' logic fires
        // at the exact moment the page changes.
        dispatch(
          setLogin({
            user: data.user,
            token: data.accessToken,
          }),
        );

        setFormData({ email: "", password: "" });
        dispatch(closeAuthDrawer());

        // 5. Navigate to destination
        navigate(redirectPath, { replace: true });

        // Final safety: We don't set loading false here because
        // the component is unmounting/navigating away anyway.
      } else {
        setStatusMsg({
          type: "error",
          message: data?.message || "Login failed",
          field: "email",
        });
        setLoading(false);
      }
    } catch (error) {
      const errorData = error?.response?.data;
      setStatusMsg({
        type: "error",
        message: errorData?.message || "Invalid Email or Password",
        field: errorData?.field || "email",
        canVerify: !!errorData?.unverified,
      });
      setLoading(false);
    }
  };

  const handleVerifyAndRedirect = async () => {
    try {
      const response = await resendVerification({ email: formData.email });
      if (response.success) {
        navigate("/account/verify-otp", {
          state: {
            allowed: true,
            email: formData.email,
            showToast: true,
            toastMsg: response.message,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  return {
    formData,
    loading,
    statusMsg,
    handleChange,
    executeLogin,
    handleVerifyAndRedirect,
  };
};
