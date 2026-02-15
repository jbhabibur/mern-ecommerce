import { useState } from "react";
import { forgotPassword } from "../../../../services/authService";
import { ButtonSpinner } from "../../../../components/loaders/ButtonSpinner";
import { PrimaryButton } from "../../../../components/atoms/PrimaryButton";
import { Toast } from "../../../../components/atoms/Toast";
import { AnimatePresence } from "framer-motion";

export const RecoverForm = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    setBackendError("");

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
      if (response?.success) {
        setShowToast(true); // Show the toast on success
        setEmail("");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <Toast
            type="success"
            message="Reset link sent! Please check your email inbox."
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <header className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-900">
          Reset your password
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
          We will send you an email to reset your password.
        </p>
      </header>

      {/* Backend Error Alert */}
      {backendError && (
        <div className="mb-6 border-l-2 p-3 flex flex-col gap-1 bg-red-50 border-red-500 transition-all duration-300">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">
            System Alert
          </span>
          <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed text-red-700">
            {backendError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            name="recoverEmail"
            placeholder="john@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldError) setFieldError("");
              if (backendError) setBackendError("");
            }}
            disabled={loading}
            className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
              fieldError || backendError
                ? "border-red-500"
                : "border-zinc-200 focus:border-black"
            }`}
          />
          {fieldError && (
            <p className="text-[10px] font-bold uppercase text-red-500 mt-1 tracking-tight">
              {fieldError}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <PrimaryButton
              type="submit"
              text="Submit"
              loading={loading}
              disabled={loading}
              initialBg="#18181b"
              initialText="#FFFFFF"
              loadingComponent={
                <ButtonSpinner color="white" text="Sending..." />
              }
            />
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black underline underline-offset-4 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
