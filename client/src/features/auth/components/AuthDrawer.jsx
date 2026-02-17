import { useEffect, useState, useRef } from "react"; // Added useRef
import { useDispatch, useSelector } from "react-redux";
import { closeAuthDrawer } from "../../../redux/slices/authDrawerSlice";
import { X, Eye, EyeOff } from "lucide-react";
import { useCustomCursor } from "../../../hooks/useCustomCursor";
import { useLogin } from "../hooks/useLogin";
import { ButtonSpinner } from "../../../components/loaders/ButtonSpinner";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";

export const AuthDrawer = () => {
  const { isOpen } = useSelector((state) => state.authDrawer);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // 1. Create Refs for the input fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { mousePos } = useCustomCursor(isOpen);
  const {
    formData,
    loading,
    statusMsg,
    handleChange,
    executeLogin,
    handleVerifyAndRedirect,
  } = useLogin(() => dispatch(closeAuthDrawer()));

  const showGlobalBanner = statusMsg.type === "error" && !statusMsg.field;

  // 2. Updated useEffect to use refs instead of document.getElementsByName
  useEffect(() => {
    if (statusMsg.field === "email") {
      emailRef.current?.focus();
    } else if (statusMsg.field === "password") {
      passwordRef.current?.focus();
    }
  }, [statusMsg.field]);

  /**
   * Handles the click event for the close button.
   * Triggers a 180-degree rotation animation before closing the drawer.
   */
  const handleClose = () => {
    setIsRotating(true);

    setTimeout(() => {
      dispatch(closeAuthDrawer());
      setIsRotating(false);
    }, 200);
  };

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
        } w-[85%] sm:w-[360px] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg! font-bold uppercase tracking-tight mb-0 text-zinc-900">
            Login
          </h2>
          <button onClick={handleClose}>
            <X
              className={`w-5 h-5 text-zinc-500 hover:text-black transition-transform duration-300 ${isRotating ? "rotate-180" : "rotate-0"}`}
            />
          </button>
        </div>

        <div className="p-6">
          {showGlobalBanner && (
            <div className="mb-6 p-3 text-[10px] font-bold text-center border bg-red-50 border-red-100 text-red-600 uppercase tracking-widest animate-in fade-in">
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={executeLogin} className="space-y-4" noValidate>
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                ref={emailRef} // 3. Attach Ref
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
                  statusMsg.field === "email"
                    ? "border-red-500"
                    : "border-zinc-200 focus:border-black"
                }`}
              />
            </div>

            {/* Password Input Area */}
            <div className="relative space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                ref={passwordRef} // 4. Attach Ref
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border-b-2 bg-transparent py-2 text-sm transition-all focus:outline-none ${
                  statusMsg.field === "password"
                    ? "border-red-500"
                    : "border-zinc-200 focus:border-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3.5 text-zinc-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error Feedback Section */}
            {(statusMsg.field || statusMsg.message) && !showGlobalBanner && (
              <div className="bg-red-50 border-l-2 border-red-500 p-3 flex flex-col gap-3 transition-all duration-300 animate-in fade-in">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">
                    System Alert
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-red-700 leading-relaxed">
                    {statusMsg.text || statusMsg.message}
                  </p>
                </div>

                {statusMsg.canVerify && (
                  <button
                    type="button"
                    onClick={() => {
                      handleVerifyAndRedirect();
                      dispatch(closeAuthDrawer());
                    }}
                    className="w-full sm:w-fit bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 hover:bg-black transition-all duration-300 shadow-sm"
                  >
                    Verify Now
                  </button>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col gap-6 pt-4">
              <PrimaryButton
                type="submit"
                text="Sign In"
                loading={loading}
                disabled={loading}
                initialBg="#18181b"
                initialText="#FFFFFF"
                loadingComponent={
                  <ButtonSpinner color="white" text="Processing..." />
                }
              />

              <div className="flex justify-center">
                <a
                  href="/account/recover"
                  className="no-underline! w-fit link-underline text-[10px] font-bold uppercase tracking-widest text-black pb-0.5 leading-tight"
                >
                  Lost your password?
                </a>
              </div>

              {/* Wrapper */}
              <div>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="bg-white px-3 text-zinc-400">
                      New here?
                    </span>
                  </div>
                </div>

                <a
                  href="/account/register"
                  onClick={() => dispatch(closeAuthDrawer())}
                  className="no-underline!"
                >
                  <PrimaryButton
                    type="button"
                    text="Create Account"
                    loading={loading}
                    disabled={loading}
                    initialBg="#FFFFFF"
                    initialText="#18181b"
                    className="border border-zinc-200"
                    loadingComponent={
                      <ButtonSpinner color="black" text="Processing..." />
                    }
                  />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
