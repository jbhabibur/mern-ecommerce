import React, { useRef, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom"; // Added searchParams & navigate
import { useVerifyOTP } from "../hooks/useVerifyOTP";

export const VerifyOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. URL theke token ebong email collect kora (Professional Link Access)
  const tokenFromUrl = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");

  // Priority: URL email > Navigation state email > Default fallback
  const email = emailFromUrl || location.state?.email || "your email";

  // 2. Security Guard: Keu manually URL type korle registration-e pathiye dibe
  useEffect(() => {
    // Jodi URL-e token na thake ebong state-eo email na thake, tobe access block
    if (!tokenFromUrl && !location.state?.email) {
      navigate("/account/register");
    }
  }, [tokenFromUrl, location.state, navigate]);

  const inputRefs = useRef([]);

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

  // --- Input Handlers (UI Logic remains exactly the same) ---
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
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

  // Prevent UI flickering during redirect
  if (!tokenFromUrl && !location.state?.email) return null;

  return (
    <div className="min-h-screen bg-white pt-20 px-4 text-center">
      <div className="max-w-[400px] mx-auto">
        <h1 className="text-2xl! font-bold uppercase mb-4 tracking-tighter">
          Verify Your Account
        </h1>
        <p className="text-[13px] text-gray-500 mb-8">
          We sent a 6-digit code to <br />
          <span className="font-bold text-black">{email}</span>
        </p>

        {errorMsg && (
          <p className="text-red-500 text-[13px] mb-4 font-bold">{errorMsg}</p>
        )}

        {/* Pass token to handleVerify so backend can use it for security */}
        <form
          onSubmit={(e) => handleVerify(e, tokenFromUrl)}
          className="space-y-8"
        >
          <div className="flex justify-between gap-2">
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
                className={`w-12 h-14 border ${isVerified ? "border-green-500" : "border-gray-300"} text-center text-xl font-bold focus:border-black outline-none transition-all rounded-md bg-transparent`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || isVerified}
            className={`w-full ${isVerified ? "bg-green-600 border-green-600" : "bg-[#1a1a1a] border-black"} text-white border py-3 text-[13px] font-bold uppercase hover:bg-white! hover:text-black! transition-all duration-500 disabled:opacity-50`}
          >
            {loading
              ? "Verifying..."
              : isVerified
                ? "✔ Verified"
                : "Verify OTP"}
          </button>
        </form>

        <div className="mt-10 text-[11px] uppercase tracking-widest text-gray-400">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-black font-bold border-b border-black ml-1"
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
