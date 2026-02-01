export const LoginForm = ({
  formData,
  loading,
  statusMsg,
  handleChange,
  executeLogin,
  onShowRecover,
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Login</h2>
      <p className="text-gray-500 text-sm mb-8">
        Please enter your email and password below to access your account
      </p>

      <form onSubmit={executeLogin} className="space-y-6" noValidate>
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-3 focus:outline-none transition ${
              statusMsg.field === "email"
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {statusMsg.field === "email" && (
            <div className="mt-2 p-2 text-xs font-bold text-red-600 bg-red-50 border-l-2 border-red-500">
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border p-3 focus:outline-none transition ${
              statusMsg.field === "password"
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {statusMsg.field === "password" && (
            <div className="mt-2 p-2 text-xs font-bold text-red-600 bg-red-50 border-l-2 border-red-500">
              {statusMsg.text}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="border border-black px-10 py-3 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition duration-300 disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "SIGN IN"}
          </button>
          <button
            type="button"
            onClick={onShowRecover}
            className="text-sm text-gray-600 underline hover:text-black cursor-pointer"
          >
            Lost your password?
          </button>
        </div>
      </form>
    </div>
  );
};
