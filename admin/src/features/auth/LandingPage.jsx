import React from "react";
import { useNavigate } from "react-router";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left Side: Branding & Visuals */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center px-10 py-16 lg:px-24">
        <div className="mb-8">
          {/* Logo Placeholder */}
          <div className="text-3xl font-black text-blue-600 tracking-tighter italic">
            MENS<span className="text-black">FASHION</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
          Elevate your <br />
          <span className="text-blue-600">style</span> today.
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          Explore the latest trends in men's fashion. Exclusive collections and
          premium quality just for you.
        </p>

        {/* Decorative Image Cards (Facebook style) */}
        <div className="relative h-64 w-full max-w-sm mt-4">
          <div className="absolute top-0 left-0 w-48 h-48 bg-gray-200 rounded-2xl shadow-lg rotate-[-6deg] overflow-hidden border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=500"
              alt="Fashion 1"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute top-10 left-32 w-48 h-48 bg-gray-300 rounded-2xl shadow-xl rotate-[6deg] overflow-hidden border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=500"
              alt="Fashion 2"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Right Side: Login Actions */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-16 bg-white border-l border-gray-100">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Log in to Admin Panel
          </h2>

          {/* Profile Quick Select Mockup */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  HR
                </div>
                <span className="font-medium text-gray-700">
                  Habibur Rahman
                </span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Use another profile
            </button>

            <div className="border-t border-gray-200 my-6"></div>

            <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-md">
              Create new admin account
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
              Powered by MensFashion Group
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
