import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import { LoginForm } from "../features/auth/components/forms/LoginFrom";
import { RegisterForm } from "../features/auth/components/forms/RegisterForm";
import { Toast } from "../components/atoms/Toast";
import { SectionLayout } from "../layout/SectionLayout";
import { SocialLogin } from "../features/auth/components/SocialLogin";

// Hooks
import { useLogin } from "../features/auth/hooks/useLogin";
import { useRegister } from "../features/auth/hooks/useRegister";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [showToast, setShowToast] = useState(false);
  const [activeToast, setActiveToast] = useState({ message: "", type: "info" });
  const [urlError, setUrlError] = useState("");

  const loginEmailRef = useRef(null);

  // Auth Hooks
  const {
    formData: loginForm,
    loading: loginLoading,
    statusMsg: loginStatus,
    handleChange: handleLoginChange,
    executeLogin: handleLoginSubmit,
    handleVerifyAndRedirect: handleLoginVerify,
  } = useLogin();

  const {
    formData: registerForm,
    loading: registerLoading,
    statusMsg: registerStatus,
    handleChange: handleRegisterChange,
    executeRegistration: handleRegisterSubmit,
    handleVerifyAndRedirect: handleRegisterVerify,
  } = useRegister();

  /**
   * ACTION: Close Toast
   */
  const handleCloseToast = useCallback(() => setShowToast(false), []);

  /**
   * EFFECT: Handle URL Parameters & Cleanup
   * Runs only once on mount to check for verification or errors in URL
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const errorType = params.get("error");
    const isVerified = params.get("verified") === "true";
    const returnTo = params.get("return_to");

    if (isVerified) {
      setActiveToast({
        message: "Email verified successfully!",
        type: "success",
      });
      setShowToast(true);
    }

    if (errorType) {
      const messages = {
        "link-expired": "Verification link expired. Please register again.",
        "invalid-link": "Invalid or used verification link.",
      };
      setUrlError(messages[errorType] || "An error occurred.");
    }

    // Remove ONLY error and verified params
    if (errorType || isVerified) {
      const newParams = new URLSearchParams();

      if (returnTo) {
        newParams.set("return_to", returnTo);
      }

      navigate(
        {
          pathname: location.pathname,
          search: newParams.toString() ? `?${newParams.toString()}` : "",
        },
        { replace: true },
      );
    }
  }, []);

  /**
   * EFFECT: Sync Hook Status to Toast
   * Only triggers when a NEW message arrives from the hooks
   */
  useEffect(() => {
    const hookMsg = registerStatus?.message || loginStatus?.message;
    const hookType = registerStatus?.type || loginStatus?.type;

    if (hookMsg) {
      setActiveToast({
        message: hookMsg,
        type: hookType || "info",
      });
      setShowToast(true);
    }
  }, [loginStatus.message, registerStatus.message]);

  return (
    <SectionLayout>
      <AnimatePresence mode="wait">
        {showToast && (
          <Toast
            message={activeToast.message}
            type={activeToast.type}
            onClose={handleCloseToast}
          />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-6xl mx-auto px-2 pt-4 pb-24">
        {/* Login Column */}
        <div className="w-full py-6 md:py-10 space-y-6">
          {urlError && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-tight rounded shadow-sm animate-in fade-in slide-in-from-top-2">
              {urlError}
            </div>
          )}

          <LoginForm
            formData={loginForm}
            loading={loginLoading}
            statusMsg={loginStatus}
            handleChange={handleLoginChange}
            executeLogin={handleLoginSubmit}
            handleVerifyAndRedirect={handleLoginVerify}
            onShowRecover={() => navigate("/account/recover")}
            emailRef={loginEmailRef}
          />

          {/* Social Login Divider & Component */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 tracking-wider font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          <SocialLogin />
        </div>

        {/* Register Column */}
        <div className="w-full bg-[#FAFAFA] p-6 md:p-10">
          <RegisterForm
            formData={registerForm}
            loading={registerLoading}
            statusMsg={registerStatus}
            handleChange={handleRegisterChange}
            executeRegistration={handleRegisterSubmit}
            handleVerifyAndRedirect={handleRegisterVerify}
          />
        </div>
      </div>
    </SectionLayout>
  );
};
