import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ButtonSpinner } from "../../../../components/loaders/ButtonSpinner";
import { PrimaryButton } from "../../../../components/atoms/PrimaryButton";

export const LoginForm = ({
  formData,
  loading,
  statusMsg,
  handleChange,
  executeLogin,
  handleVerifyAndRedirect,
  onShowRecover,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full animate-in fade-in duration-500">
      <header className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-900">
          Login
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
          Please enter your email and password below
        </p>
      </header>

      <form onSubmit={executeLogin} className="space-y-4" noValidate>
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
              statusMsg.field === "email"
                ? "border-red-500"
                : "border-zinc-200 focus:border-black"
            }`}
          />
        </div>

        {/* Password Input */}
        <div className="relative space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
              statusMsg.field === "password"
                ? "border-red-500"
                : "border-zinc-200 focus:border-black"
            }`}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-0 bottom-3.5 text-zinc-400 hover:text-black transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error Feedback Section */}
        {statusMsg.message && (
          <div className="bg-red-50 border-l-2 border-red-500 p-3 flex flex-col gap-3 transition-all duration-300">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">
                System Alert
              </span>
              <p className="text-[10px] font-bold uppercase tracking-tight text-red-700 leading-relaxed">
                {statusMsg.message}
              </p>
            </div>

            {/* Verification Button for Unverified Accounts */}
            {statusMsg.canVerify && (
              <button
                type="button"
                onClick={handleVerifyAndRedirect}
                className="w-full sm:w-fit bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 hover:bg-black transition-all duration-300 shadow-sm"
              >
                Verify Now
              </button>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <PrimaryButton
              type="submit"
              text="Sign In"
              loading={loading}
              disabled={loading}
              initialBg="#18181b"
              initialText="#FFFFFF"
              loadingComponent={
                <ButtonSpinner color="white" text="Processing..." />
              }
            />
          </div>

          <button
            type="button"
            onClick={onShowRecover}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black underline underline-offset-4 cursor-pointer transition-colors"
          >
            Lost your password?
          </button>
        </div>
      </form>
    </div>
  );
};
