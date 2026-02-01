export const RegisterForm = ({
  formData,
  loading,
  statusMsg,
  handleChange,
  executeRegistration,
}) => {
  return (
    <div className="w-full max-w-md bg-gray-50 p-8 md:p-12 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Register</h2>
      <p className="text-gray-500 text-sm mb-8">
        Please register below to create an account
      </p>

      <form onSubmit={executeRegistration} className="space-y-6" noValidate>
        {/* First Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full border p-3 bg-white focus:outline-none transition ${
              statusMsg.field === "firstName"
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {statusMsg.field === "firstName" && (
            <div className="mt-2 p-2 text-xs font-bold text-red-600 bg-red-50 border-l-2 border-red-500">
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full border p-3 bg-white focus:outline-none transition ${
              statusMsg.field === "lastName"
                ? "border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {statusMsg.field === "lastName" && (
            <div className="mt-2 p-2 text-xs font-bold text-red-600 bg-red-50 border-l-2 border-red-500">
              {statusMsg.text}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Your Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border p-3 bg-white focus:outline-none transition ${
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
          <label className="block text-sm font-semibold mb-2">
            Your Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border p-3 bg-white focus:outline-none transition ${
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

        {/* --- SUBSCRIBE SECTION START --- */}
        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="subscribe"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
            className="w-4 h-4 accent-black border-gray-300 cursor-pointer"
          />
          <label
            htmlFor="subscribe"
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            Subscribe To Email Marketing
          </label>
        </div>
        {/* --- SUBSCRIBE SECTION END --- */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#222] text-white py-4 font-bold tracking-widest hover:bg-black transition duration-300 mt-4 disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : "CREATE AN ACCOUNT"}
        </button>
      </form>
    </div>
  );
};
