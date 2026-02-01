import { useState } from "react";
import { forgotPassword } from "../../../../services/authService";

export const RecoverForm = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState(""); // For validation under input
  const [backendError, setBackendError] = useState(""); // For the top error box (image 3)
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setFieldError("");
    setBackendError("");
    setIsSuccess(false);

    // --- Frontend Validation (shown under input) ---
    if (!email) {
      setFieldError("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        setIsSuccess(true);
        setEmail(""); // Clear input on success
      }
    } catch (err) {
      // If user is not found, show the red box at the top like image 3
      const msg = err.response?.data?.message || "Something went wrong.";
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 animate-in fade-in duration-500">
      <h1 className="text-left text-xl! font-bold! mb-4 text-black uppercase">
        Reset your password
      </h1>
      <p className="text-gray-600 text-[15px] mb-8 leading-relaxed">
        We will send you an email to reset your password.
      </p>

      {/* --- Top Error Box (Matches Image 3) --- */}
      {backendError && (
        <div className="bg-[#FDF3F3] border border-[#F3DADA] text-[#D02E2E] p-4 mb-6 text-center text-sm">
          {backendError}
        </div>
      )}

      {/* Success Message (Optional, without toast) */}
      {isSuccess && (
        <div className="bg-[#F3FAF5] border border-[#D1E7DD] text-[#0F5132] p-4 mb-6 text-center text-sm">
          Check your email for the reset link!
        </div>
      )}

      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="recoverEmail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldError) setFieldError(""); // Clear field error on type
              if (backendError) setBackendError(""); // Clear top error on type
            }}
            disabled={loading}
            className={`w-full border p-3 focus:outline-none transition duration-300 ${
              fieldError
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />

          {/* --- Field Validation Error (under input) --- */}
          {fieldError && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {fieldError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-8 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="border border-black bg-white px-12 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING..." : "SUBMIT"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 underline hover:text-black transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
