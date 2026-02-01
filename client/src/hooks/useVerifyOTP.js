import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authService";

export const useVerifyOTP = (email) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  // --- Timer Logic ---
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // --- API: Verify OTP ---
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length < 6) {
      setErrorMsg("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const data = await verifyOTP({ email, otp: finalOtp });
      if (data.success) {
        setIsVerified(true);
        setTimeout(() => navigate("/account/login"), 2000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Invalid OTP");
      setOtp(new Array(6).fill(""));
    } finally {
      setLoading(false);
    }
  };

  // --- API: Resend OTP ---
  const handleResend = async () => {
    try {
      setErrorMsg("");
      const data = await resendOTP({ email });
      if (data.success) {
        setTimer(60);
        setCanResend(false);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Resend failed");
    }
  };

  return {
    otp,
    setOtp,
    timer,
    setTimer,
    canResend,
    setCanResend,
    loading,
    errorMsg,
    isVerified,
    handleVerify,
    handleResend,
  };
};
