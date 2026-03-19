import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../../api/apiConfig";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/request-access`, {
        email,
      });
      if (res.data.success) {
        alert("Request sent successfully! Super Admin will review it.");
        setIsModalOpen(false);
        setEmail("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans p-6 md:p-12 relative">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 overflow-hidden min-h-[80vh]">
        {/* Left Side: Visual Hero (Unchanged) */}
        <div className="relative hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 to-indigo-900 text-white overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-16">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-blue-600 rounded-sm rotate-45"></div>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">
                Mens<span className="text-blue-200">Fashion</span>
              </span>
            </div>
            <h1 className="text-6xl! font-extrabold! leading-[1.1] mb-6">
              Redefining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Modern Elegance.
              </span>
            </h1>
            <p className="text-blue-100 text-lg max-w-sm font-light leading-relaxed">
              Empowering your vision with seamless inventory management and
              real-time insights for every collection.
            </p>
          </div>
          <div className="relative z-10 mt-12">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-indigo-900 bg-gray-200 overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                    alt="admin"
                  />
                </div>
              ))}
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-indigo-900 bg-blue-500 text-[10px] font-bold">
                +12
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-200/80 font-medium font-inter">
              Trusted by a community of 200+ elite stylists
            </p>
          </div>
        </div>

        {/* Right Side: Action Panel */}
        <div className="flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 relative">
          <div className="mb-8 md:mt-16 md:absolute md:bottom-8 text-center bg-amber-300 px-4 py-1 rounded-full">
            <span className="text-xs text-gray-700 uppercase tracking-widest font-bold font-inter">
              Powered by MensFashion Group
            </span>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 font-inter">
                Please enter your credentials to access your dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/login")}
                className="group relative w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-semibold overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-gray-200 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sign in to Dashboard
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium uppercase tracking-widest font-inter">
                  or
                </span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 px-6 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
              >
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Join via Invitation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Request Invitation
              </h3>
              <p className="text-gray-500 mt-2 text-sm font-inter">
                Enter your work email, and we'll send you an invitation link
                after review.
              </p>
            </div>

            <form
              onSubmit={handleRequestAccess}
              noValidate
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@mensfashion.com"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-inter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? "Processing..." : "Submit Request"}
                {!loading && (
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
