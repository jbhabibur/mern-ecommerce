import { useRef, useEffect, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import { ButtonSpinner } from "../components/loaders/ButtonSpinner";
import { PrimaryButton } from "../components/atoms/PrimaryButton";
import { Toast } from "../components/atoms/Toast";

// Hooks
import { useVerifyOTP } from "../hooks/useVerifyOTP";

export const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRefs = useRef([]);

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const tokenFromUrl = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");
  const email = emailFromUrl || location.state?.email || "your email";

  const {
    otp,
    setOtp,
    timer,
    canResend,
    loading,
    errorMsg,
    isVerified,
    handleVerify,
    handleResend,
  } = useVerifyOTP(email);

  useEffect(() => {
    // Redirect if no valid session/token
    if (!tokenFromUrl && !location.state?.email) {
      navigate("/account/register");
    }

    // Handle toast display from navigation state
    if (location.state?.showToast && location.state?.toastMsg) {
      setToast({
        show: true,
        message: location.state.toastMsg,
        type: "success",
      });

      // Clean up history state to prevent toast re-run on refresh
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, showToast: false },
      });
    }
  }, [tokenFromUrl, location.state, navigate, location.pathname]);

  const onResendClick = async () => {
    try {
      await handleResend();
      setToast({
        show: true,
        message: "A new OTP has been sent to your email.",
        type: "success",
      });
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to resend OTP. Please try again.",
        type: "error",
      });
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Auto focus previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    inputRefs.current[nextIndex].focus();
  };

  if (!tokenFromUrl && !location.state?.email) return null;

  return (
    <div className="min-h-[90vh] md:min-h-screen bg-white pt-10 md:pt-20 px-4 text-center flex flex-col">
      {/* Toast Component Integration */}
      <AnimatePresence>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-[440px] mx-auto px-2">
        <h1 className="text-xl md:text-2xl font-bold uppercase mb-4 tracking-tighter">
          Verify Your Account
        </h1>
        <p className="text-[12px] md:text-[13px] text-gray-500 mb-8 leading-relaxed">
          We sent a 6-digit code to <br />
          <span className="font-bold text-black break-all">{email}</span>
        </p>

        {errorMsg && (
          <p className="text-red-500 text-[13px] mb-4 font-bold">{errorMsg}</p>
        )}

        <form
          onSubmit={(e) => handleVerify(e, tokenFromUrl)}
          className="space-y-6 md:space-y-8"
        >
          <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-sm mx-auto">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onPaste={handlePaste}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full aspect-square md:h-14 border ${
                  isVerified ? "border-green-500" : "border-gray-300"
                } text-center text-lg md:text-xl font-bold focus:border-black outline-none transition-all rounded-md bg-transparent`}
              />
            ))}
          </div>

          <PrimaryButton
            text="Verify OTP"
            type="submit"
            disabled={loading}
            loading={loading}
            loadingComponent={
              <ButtonSpinner color="white" text="Verifying..." />
            }
            className={`w-full h-[50px] transition-all duration-500 rounded-sm`}
          />
        </form>

        <div className="mt-8 md:mt-10 text-[11px] uppercase tracking-widest text-gray-400">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={onResendClick}
              className="text-black font-bold border-b border-black ml-1 inline-block"
            >
              Resend Now
            </button>
          ) : (
            <span className="text-gray-500 font-bold ml-1">
              Resend in 0:{timer < 10 ? `0${timer}` : timer}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
