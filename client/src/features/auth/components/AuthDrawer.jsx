import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthDrawer } from "../../../redux/slices/authDrawerSlice";
import { X } from "lucide-react";
import { useCustomCursor } from "../hooks/useCustomCursor";
import { useLogin } from "../hooks/useLogin";

export const AuthDrawer = () => {
  const { isOpen } = useSelector((state) => state.authDrawer);
  const dispatch = useDispatch();

  // Custom hooks
  const { mousePos } = useCustomCursor(isOpen);
  const { formData, loading, statusMsg, handleChange, executeLogin } =
    useLogin();

  // 1. Logic for Global Banner: Show only if there is no specific field attached
  const showGlobalBanner = !statusMsg.field && statusMsg.text;

  // Automatically close drawer if login is successful
  useEffect(() => {
    if (statusMsg.type === "success") {
      const timer = setTimeout(() => {
        dispatch(closeAuthDrawer());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [statusMsg.type, dispatch]);

  // Auto-focus the field that has an error
  useEffect(() => {
    if (statusMsg.field) {
      const element = document.getElementsByName(statusMsg.field)[0];
      if (element) element.focus();
    }
  }, [statusMsg.field]);

  return (
    <>
      {/* 1. Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible md:cursor-none"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => dispatch(closeAuthDrawer())}
      >
        {/* 2. Floating Close Button */}
        <div
          className="fixed pointer-events-none z-[110] hidden md:flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-xl transition-transform duration-100 ease-out"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <X className="w-6 h-6 text-black" />
        </div>
      </div>

      {/* 3. Main Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-[101] shadow-2xl transition-transform duration-500 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-[85%] md:w-[380px]`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold uppercase tracking-tight mb-0">
            Login
          </h2>
          <button onClick={() => dispatch(closeAuthDrawer())}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Login Form Content */}
        <div className="p-4 space-y-6">
          {/* GLOBAL BANNER: Only for Success or General Failures */}
          {showGlobalBanner && (
            <div
              className={`p-3 text-sm text-center border animate-in fade-in duration-300 ${
                statusMsg.type === "success"
                  ? "bg-green-50 border-green-100 text-green-600"
                  : "bg-red-50 border-red-100 text-red-600"
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={executeLogin} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full border p-3 outline-none transition-colors duration-300 ${
                  statusMsg.field === "email"
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-black"
                }`}
              />
              {/* INPUT VALIDATION MESSAGE */}
              {statusMsg.field === "email" && (
                <div className="mt-1.5 text-xs font-bold text-red-600">
                  {statusMsg.text}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full border p-3 outline-none transition-colors duration-300 ${
                  statusMsg.field === "password"
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-black"
                }`}
              />
              {/* INPUT VALIDATION MESSAGE */}
              {statusMsg.field === "password" && (
                <div className="mt-1.5 text-xs font-bold text-red-600">
                  {statusMsg.text}
                </div>
              )}
            </div>

            <div className="text-center flex flex-col gap-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#222] border border-black text-white hover:text-black py-3 font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Log In"}
              </button>

              <a
                href={"/account/login#recover"}
                className="text-xs underline underline-offset-4 text-gray-500 hover:text-black"
              >
                Forgot your password?
              </a>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">New here?</span>
                </div>
              </div>

              <a
                href="/account/register"
                onClick={() => dispatch(closeAuthDrawer())}
              >
                <button
                  type="button"
                  className="w-full border border-black py-3 font-bold uppercase tracking-widest bg-white hover:bg-[#222] text-black hover:text-white transition-all duration-300"
                >
                  Create Account
                </button>
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
