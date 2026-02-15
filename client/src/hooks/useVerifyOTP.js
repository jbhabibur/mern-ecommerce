import { useState, useEffect } from "react";
import { verifyOTP, resendVerification } from "../services/authService";

export const useVerifyOTP = (email) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e, token = null) => {
    if (e) e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      setErrorMsg("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Parallel execution of OTP verification and a minimum 2-second delay for UX
      const [data] = await Promise.all([
        verifyOTP({ email, otp: finalOtp, token }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (data.success) {
        // Hard reload and redirect with a flag in the URL
        window.location.replace("/account/login?verified=true");
      } else {
        // If success is false but the message indicates the account is already verified
        if (
          data.message &&
          data.message.toLowerCase().includes("already verified")
        ) {
          window.location.replace("/account/login?verified=true");
        } else {
          setLoading(false);
          setErrorMsg(data.message || "Something went wrong");
        }
      }
    } catch (err) {
      // Check the same logic in the catch block because API error status codes (like 400/409) trigger this block
      const errorResponseMsg = err.response?.data?.message || "";

      if (errorResponseMsg.toLowerCase().includes("already verified")) {
        window.location.replace("/account/login?verified=true");
      } else {
        console.log(err);
        // Handle errors, show message, reset OTP input, and stop loading
        setErrorMsg(errorResponseMsg || "Invalid OTP");
        setOtp(new Array(6).fill(""));
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      setErrorMsg("");
      const data = await resendVerification({ email });
      if (data.success) {
        setTimer(60);
        setCanResend(false);
        return true;
      }
      return false;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Resend failed");
      return false;
    }
  };

  return {
    otp,
    setOtp,
    timer,
    canResend,
    loading,
    errorMsg,
    isVerified,
    handleVerify,
    handleResend,
  };
};
