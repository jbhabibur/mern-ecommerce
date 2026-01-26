import React from "react";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-white pt-10 px-4 md:px-0">
      {/* 1. Breadcrumb */}
      <nav className="max-w-[1200px] mx-auto text-[11px] text-gray-400 mb-12">
        <a
          href="/"
          className="text-gray-400! no-underline! hover:text-black! transition-colors"
        >
          Home
        </a>
        <span className="mx-2 text-gray-300">&gt;</span>
        <span className="text-gray-500!">Create Account</span>
      </nav>

      <div className="max-w-[500px] mx-auto text-center">
        {/* 2. Header */}
        <h1 className="text-2xl! md:text-3xl font-bold uppercase mb-4">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Please register below to create an account
        </p>

        {/* 3. Form */}
        <form
          className="space-y-5 text-left"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2.5 outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2.5 outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2">
              Your Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2.5 outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2">
              Your Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2.5 outline-none focus:border-black transition-colors"
            />
          </div>

          {/* 4. Newsletter Checkbox */}
          <div className="flex items-center space-x-2! pt-2">
            <input
              type="checkbox"
              id="subscribe"
              className="w-4 h-4 accent-black border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="subscribe"
              className="text-xs text-gray-600 cursor-pointer select-none"
            >
              Subscribe To Email Marketing
            </label>
          </div>

          {/* 5. Submit Button */}
          <div>
            <button className="bg-[#1a1a1a] hover:bg-white! text-white hover:text-black! border border-black px-4 py-2 mb-5 text-[13px] font-bold uppercase transition-colors duration-500">
              Create An Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
