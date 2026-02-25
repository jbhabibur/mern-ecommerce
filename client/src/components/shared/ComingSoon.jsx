import React from "react";
import { ArrowLeft, Bell } from "lucide-react";

export const ComingSoon = ({ featureName = "This Feature" }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Title */}
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-widest text-gray-400 font-medium">
            Coming Soon
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {featureName}
          </h1>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed">
            We're building something thoughtful and powerful. This feature will
            be available soon.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-gray-200 mx-auto rounded-full" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-black transition">
            <Bell size={16} />
            Notify Me
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 pt-6">Expected Launch · Q2 2026</p>
      </div>
    </div>
  );
};
