import { useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../../../services/authService";

// Components
import { ButtonSpinner } from "../../../../components/loaders/ButtonSpinner";
import { PrimaryButton } from "../../../../components/atoms/PrimaryButton";

export const ResetForm = () => {
  const { token } = useParams();

  // Form State
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle Visibility Functions
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setBackendError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Min 6 characters required.";
    }

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
      if (response?.success) {
        // This triggers a full browser refresh to the login page
        window.location.href = "/account/login?resetSuccess=true";
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Link invalid or expired.";
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[450px] min-w-[250px] w-full animate-in fade-in duration-500 px-4 sm:px-0">
      {/* Form Header */}
      <header className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-900">
          Reset Password
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
          Please enter your new password below to secure your account
        </p>
      </header>

      {/* Error Alert */}
      {backendError && (
        <div className="mb-6 bg-red-50 border-l-2 border-red-500 p-3 flex flex-col gap-1">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">
            System Alert
          </span>
          <p className="text-[10px] font-bold uppercase tracking-tight text-red-700 leading-relaxed">
            {backendError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* New Password Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            New Password <span className="text-red-500">*</span>
          </label>
          {/* Wrapper with relative and overflow-hidden to keep icon locked */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              // Added pr-10 to make space for the icon so text doesn't overlap
              className={`w-full border-b-2 bg-transparent py-2 pr-10 text-sm transition-all focus:outline-none ${
                fieldErrors.password
                  ? "border-red-500"
                  : "border-zinc-200 focus:border-black"
              }`}
            />
            <button
              type="button"
              onClick={togglePassword}
              // Changed bottom to 2 to keep it vertically aligned regardless of hover
              className="absolute right-0 bottom-2 text-zinc-400 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-[10px] font-bold uppercase text-red-500 mt-1 tracking-tight">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className={`w-full border-b-2 bg-transparent py-2 pr-10 text-sm transition-all focus:outline-none ${
                fieldErrors.confirmPassword
                  ? "border-red-500"
                  : "border-zinc-200 focus:border-black"
              }`}
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute right-0 bottom-2 text-zinc-400 hover:text-black transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-[10px] font-bold uppercase text-red-500 mt-1 tracking-tight">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <PrimaryButton
              type="submit"
              text="Reset Password"
              loading={loading}
              disabled={loading}
              initialBg="#18181b"
              initialText="#FFFFFF"
              loadingComponent={
                <ButtonSpinner color="white" text="Updating..." />
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};
