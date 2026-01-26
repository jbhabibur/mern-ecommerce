import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthDrawer } from "../redux/slices/authDrawerSlice";
import { X } from "lucide-react";
import { useCustomCursor } from "../hooks/useCustomCursor";

export const AuthDrawer = () => {
  const { isOpen } = useSelector((state) => state.authDrawer);
  const dispatch = useDispatch();

  // Use the custom hook
  const { mousePos, isOutside } = useCustomCursor(isOpen);

  return (
    <>
      {/* 1. Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible md:cursor-none" // md:cursor-none hides the default cursor only on desktop
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => dispatch(closeAuthDrawer())}
      >
        {/* 2. Floating Close Button - Hidden on Mobile/Tablet (hidden md:flex) */}
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
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl! font-bold uppercase tracking-tight mb-0">
            Login
          </h2>
          <button onClick={() => dispatch(closeAuthDrawer())}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Login Form Content */}
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border p-2 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="text-center flex flex-col gap-y-3">
            <button className="w-full bg-[#222] border border-black text-white hover:text-black! py-2.5 font-bold uppercase tracking-widest hover:bg-white! transition-colors duration-500">
              Log In
            </button>
            <a
              href="#"
              className="text-sm! underline underline-offset-4 text-gray-600!"
            >
              Forgot your password?
            </a>
            <a href={"account/register"}>
              <button className="w-full border border-black py-2.5 font-bold uppercase! tracking-widest bg-white hover:bg-[#222]! text-black hover:text-white! transition-colors duration-500">
                Create Account
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
