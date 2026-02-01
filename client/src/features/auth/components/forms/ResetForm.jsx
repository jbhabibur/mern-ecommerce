import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../../services/authService";

export const ResetForm = () => {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({}); // Validation under input
  const [backendError, setBackendError] = useState(""); // Top red box error
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when typing starts
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setBackendError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // --- Frontend Validation ---
    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6)
      errors.password = "Min 6 characters required.";

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, formData);
      if (response.success) {
        // Redirect to login after 2 seconds or immediately
        navigate("/account/login");
      }
    } catch (err) {
      // Backend error shown at the top (Matches your reference image style)
      const msg = err.response?.data?.message || "Link invalid or expired.";
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] animate-in fade-in duration-500">
      <h1 className="text-left text-xl font-bold mb-4 text-black uppercase">
        Reset Password
      </h1>
      <p className="text-gray-600 text-[15px] mb-8 leading-relaxed">
        Please enter your new password below to secure your account.
      </p>

      {/* --- Top Error Box (Backend Errors) --- */}
      {backendError && (
        <div className="bg-[#FDF3F3] border border-[#F3DADA] text-[#D02E2E] p-4 mb-6 text-center text-sm font-medium">
          {backendError}
        </div>
      )}

      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            New Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className={`w-full border p-3 focus:outline-none transition duration-300 ${
              fieldErrors.password
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            className={`w-full border p-3 focus:outline-none transition duration-300 ${
              fieldErrors.confirmPassword
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-black bg-white px-12 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition duration-300 disabled:opacity-50"
          >
            {loading ? "UPDATING..." : "RESET PASSWORD"}
          </button>
        </div>
      </form>
    </div>
  );
};
