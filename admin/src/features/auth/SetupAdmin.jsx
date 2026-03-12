import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/apiConfig";

export const SetupAdmin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL parameters grab kora (e.g., ?token=xyz&email=admin@test.com)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Security Check: Token ba Email na thakle login-e pathiye deya
  useEffect(() => {
    if (!token || !email) {
      navigate("/login");
    }
  }, [token, email, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // After sending invitation link in Email, new admin submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);
    try {
      // Backend API call to finalize admin setup
      const response = await axios.post(
        `${BASE_URL}/api/admin/setup-password`,
        {
          token,
          email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        },
      );

      if (response.data.success) {
        alert("Account activated successfully! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Link might be expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans p-6">
      {/* Main Container - Matching Landing Page Style */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[70vh]">
        {/* Left Side: Instructions (Gradient) */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-blue-700 to-indigo-900 text-white">
          <h2 className="text-4xl font-bold mb-4">Finalize Your Access</h2>
          <p className="text-blue-100 font-light leading-relaxed">
            Welcome to the team! Please complete your profile to gain full
            access to the MensFashion Admin Suite.
          </p>
          <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-200 mb-1">
              Invited Email
            </p>
            <p className="font-mono text-sm truncate">{email}</p>
          </div>
        </div>

        {/* Right Side: Setup Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Complete Profile
            </h3>
            <p className="text-gray-500 text-sm">
              Set your details and password.
            </p>
          </div>

          {error && (
            <p className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <input
              type="password"
              name="password"
              placeholder="New Password"
              required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Activating..." : "Activate Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            This invitation link is valid for 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
