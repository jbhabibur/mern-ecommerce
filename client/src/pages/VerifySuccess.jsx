import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VerifySuccess = () => {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Update the countdown every second
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // Redirect to login page after 5 seconds
    const timeout = setTimeout(() => {
      navigate("/account/login?verified=true");
    }, 5000);

    // Cleanup intervals and timeouts on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="bg-green-100 p-6 rounded-full mb-4">
        {/* Success Checkmark Icon */}
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">
        Email Verified Successfully!
      </h1>
      <p className="text-gray-600 mt-2">
        Your account is now active. You will be redirected to login in{" "}
        <b>{seconds}</b> seconds.
      </p>
      <button
        onClick={() => navigate("/account/login?verified=true")}
        className="mt-6 text-blue-600 underline"
      >
        Click here if you are not redirected
      </button>
    </div>
  );
};
