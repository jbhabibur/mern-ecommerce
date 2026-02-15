import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import { RecoverForm } from "../features/auth/components/forms/RecoverForm";
import { RegisterForm } from "../features/auth/components/forms/RegisterForm";
import { Toast } from "../components/atoms/Toast";
import { SectionLayout } from "../layout/SectionLayout";

// Hooks
import { useRegister } from "../features/auth/hooks/useRegister";

export const RecoverPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- STATE ---
  const [showToast, setShowToast] = useState(false);
  const [activeToast, setActiveToast] = useState({ message: "", type: "info" });

  // Guard to ensure URL cleanup happens only once
  const hasCleanedUp = useRef(false);

  // Register Hook (needed for the right column)
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
   */
  useEffect(() => {
    if (hasCleanedUp.current) return;

    const resetSuccess = searchParams.get("resetSuccess") === "true";
    const registerSuccess = searchParams.get("registerSuccess") === "true";

    if (resetSuccess) {
      setActiveToast({
        message: "Password reset successfully! You can now login.",
        type: "success",
      });
      setShowToast(true);
    }

    if (registerSuccess) {
      setActiveToast({
        message: "Registration successful! Please check your email to verify.",
        type: "success",
      });
      setShowToast(true);
    }

    if (searchParams.toString()) {
      setSearchParams({}, { replace: true });
      hasCleanedUp.current = true;
    }
  }, [searchParams, setSearchParams]);

  /**
   * EFFECT: Sync Hook Status (Register) to Toast
   */
  useEffect(() => {
    if (registerStatus?.message) {
      setActiveToast({
        message: registerStatus.message,
        type: registerStatus.type || "info",
      });
      setShowToast(true);
    }
  }, [registerStatus.message]);

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
        {/* Recover Column (Left) */}
        <div className="w-full py-6 md:py-10">
          <RecoverForm onCancel={() => navigate("/account/login")} />
        </div>

        {/* Register Column (Right) */}
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
