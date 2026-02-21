import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resendVerification } from "../../../services/authService";
import { setLogin, setAppLoading } from "../../../redux/slices/authSlice";
import { closeAuthDrawer } from "../../../redux/slices/authDrawerSlice";

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    type: "",
    message: "",
    field: null,
    canVerify: false,
  });

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Don't reset everything here, just clear the specific field error
      if (statusMsg.message) {
        setStatusMsg({ type: "", message: "", field: null, canVerify: false });
      }
    },
    [statusMsg.message],
  );

  const executeLogin = async (e) => {
    // PROTECTION 1: Strongest event prevention
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }

    setLoading(true);
    // PROTECTION 2: Reset status message before the new attempt
    setStatusMsg({ type: "", message: "", field: null, canVerify: false });

    try {
      const response = await loginUser(formData);
      console.log(response);

      /* FIX: Based on your console screenshot, the server data is inside 'response.data'.
       We destructure it here for cleaner access.
    */
      const { data } = response;

      // Now check 'data.success' instead of 'response.success'
      if (data && data.success) {
        const searchParams = new URLSearchParams(location.search);
        const returnTo = searchParams.get("return_to");

        const redirectPath = returnTo ? decodeURIComponent(returnTo) : "/";

        // Artificial Delay (1.5s)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Clear from data
        setFormData({ email: "", password: "" });

        // Dispatch Login State
        dispatch(
          setLogin({
            user: data.user,
            token: data.accessToken,
          }),
        );

        // CLOSE DRAWER HERE
        dispatch(closeAuthDrawer());

        // Store the token and user details in localStorage
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate(redirectPath, { replace: true });
      } else {
        // Handle cases where the request finished but the server returned success: false
        setStatusMsg({
          type: "error",
          message: data?.message || "Login failed",
          field: "email",
        });
      }
    } catch (error) {
      /* PROTECTION 3: Error handling for network issues or 4xx/5xx status codes.
       Axios puts server error details in error.response.data
    */
      const errorData = error?.response?.data;

      setStatusMsg({
        type: "error",
        message: errorData?.message || "Invalid Email or Password",
        field: errorData?.field || "email",
        canVerify: !!errorData?.unverified,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle manual verification trigger (unverified accounts)
  const handleVerifyAndRedirect = async () => {
    try {
      const resendData = { email: formData.email };
      const response = await resendVerification(resendData);

      if (response.success) {
        navigate("/account/verify-otp", {
          state: {
            allowed: true,
            email: formData.email,
            showToast: true,
            toastMsg: response.message || "OTP sent successfully!",
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
