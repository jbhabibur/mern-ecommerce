import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Components
import { ButtonSpinner } from "../../../../components/loaders/ButtonSpinner";
import { PrimaryButton } from "../../../../components/atoms/PrimaryButton";

export const RegisterForm = ({
  formData,
  loading,
  statusMsg,
  handleChange,
  executeRegistration,
  handleVerifyAndRedirect,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="w-full">
      {/* Form Header */}
      <header className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-900">
          Registration
        </h2>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">
          Please fill in the fields below
        </p>
      </header>

      <form onSubmit={executeRegistration} className="space-y-4" noValidate>
        {/* Names Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
                statusMsg.field === "firstName"
                  ? "border-red-500"
                  : "border-zinc-200 focus:border-black"
              }`}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="e.g. Doe"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
                statusMsg.field === "lastName"
                  ? "border-red-500"
                  : "border-zinc-200 focus:border-black"
              }`}
            />
          </div>
        </div>

        {/* Email Field */}
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

        {/* Password Field */}
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
            className="absolute right-0 bottom-3.5 text-zinc-400 hover:text-black"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error Feedback Section */}
        {statusMsg.text && (
          <div className="bg-red-50 border-l-2 border-red-500 p-3 flex flex-col gap-3 transition-all duration-300">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">
                System Alert
              </span>
              <p className="text-[10px] font-bold uppercase tracking-tight text-red-700 leading-relaxed">
                {statusMsg.text}
              </p>
            </div>

            {/* Verification Trigger: Appears if user exists but is unverified */}
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

        {/* Marketing Subscription */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="isSubscribed"
              name="isSubscribed"
              checked={formData.isSubscribed}
              onChange={handleChange}
              className="h-4 w-4 appearance-none border-2 border-zinc-200 checked:bg-black checked:border-black transition-all cursor-pointer"
            />
            {formData.isSubscribed && (
              <span className="absolute text-white text-[10px] left-1 pointer-events-none">
                ✓
              </span>
            )}
          </div>
          <label
            htmlFor="isSubscribed"
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 cursor-pointer select-none"
          >
            Subscribe to email marketing
          </label>
        </div>

        {/* Submit Button */}
        <div className="mt-2 w-full">
          <PrimaryButton
            type="submit"
            text="Create Account"
            loading={loading} // Now works
            disabled={loading}
            initialBg="#18181b"
            initialText="#FFFFFF"
            loadingComponent={
              <ButtonSpinner color="white" text="Processing..." />
            }
          />
        </div>
      </form>
    </div>
  );
};
