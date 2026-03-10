import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../api/apiConfig";

export const LoginPage = () => {
  const navigate = useNavigate();

  // 1. State for form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2. Pre-fill data on component mount
  useEffect(() => {
    setFormData({
      email: "admin@mensfashion.com",
      password: "admin1",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login Successful:", data);

        // 1. Backend 'accessToken' pathachche, tai eitai use korte hobe
        const token = data.accessToken;

        if (token) {
          // 2. LocalStorage-e 'token' key-te accessToken-ti save kora holo
          localStorage.setItem("token", token);

          // 3. User information save kora (optional kintu useful)
          if (data.user) {
            localStorage.setItem("adminUser", JSON.stringify(data.user));
          }

          navigate("/admin/dashboard");
        } else {
          alert("Token not found in response.");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 pb-0 flex flex-col items-center">
          <div
            className="text-2xl font-black text-blue-600 tracking-tighter italic cursor-pointer mb-6"
            onClick={() => navigate("/")}
          >
            MENS<span className="text-black">FASHION</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please enter your admin credentials
          </p>
        </div>

        {/* Form */}
        <form className="p-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@mensfashion.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            Sign In
          </button>
        </form>

        <div className="px-8 pb-8">
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold tracking-wider">
              OR
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
