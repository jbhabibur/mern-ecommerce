import React, { useState } from "react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../api/apiConfig";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { DemoCredentials } from "../../components/DemoCredentials";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State management
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Autofill handler for demo accounts
  const handleAutoFill = (email, password) => {
    setFormData({ email, password });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.accessToken,
          }),
        );

        // Persistent storage
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("adminUser", JSON.stringify(data.user));

        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-4 font-sans relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-blue-100/50 blur-[120px] -z-10"></div>

      <div className="max-w-[440px] w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
        {/* Branding & Header */}
        <div className="p-10 pb-6 flex flex-col items-center text-center">
          <div
            onClick={() => navigate("/")}
            className="group cursor-pointer mb-8 transition-transform hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">
                Mens<span className="text-blue-600">Fashion</span>
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Admin Login
          </h2>
          <p className="text-gray-400 mt-2 text-sm font-medium">
            Enter credentials or use a showcase account.
          </p>
        </div>

        <div className="px-10 pb-10">
          {/* Quick Access Component */}
          <DemoCredentials onSelect={handleAutoFill} />

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 ml-1">
                Work Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@mensfashion.com"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 font-bold cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 014.13-4.13m4.275-1.745A9.959 9.959 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.13 4.13m-1.833-1.833L7.05 7.05M12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? "Verifying..." : "Sign In to Dashboard"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors font-bold flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              Back to Store
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
