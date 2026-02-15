import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Optional for smoother transitions
import { useRegister } from "../features/auth/hooks/useRegister";
import { RegisterForm } from "../features/auth/components/forms/RegisterForm";
import { SocialLogin } from "../features/auth/components/SocialLogin";
import { SectionLayout } from "../layout/SectionLayout";
import { PrimaryButton } from "../components/atoms/PrimaryButton";

export const RegisterPage = () => {
  const [isEmailView, setIsEmailView] = useState(false);
  const {
    formData,
    loading,
    statusMsg,
    handleChange,
    executeRegistration,
    handleVerifyAndRedirect,
  } = useRegister();

  return (
    <SectionLayout bgColor="bg-zinc-50">
      <div className="mx-auto flex flex-col md:flex-row min-h-[590px] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] my-8 border border-zinc-100">
        {/* Left Section: Interactive Form */}
        <div className="flex w-full flex-col gap-12 px-8 py-12 md:w-1/2 lg:px-20">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-full">
              <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-900 leading-none">
                Create Account
              </h2>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-zinc-400">
                Join the inner circle
              </p>
            </div>

            <div className="mt-10 w-full">
              <AnimatePresence mode="wait">
                {!isEmailView ? (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <PrimaryButton
                      text="Sign up with Email"
                      onClick={() => setIsEmailView(true)}
                      initialBg="#18181b"
                      initialText="#ffffff"
                    />

                    <div className="flex items-center gap-4 py-4">
                      <div className="h-[1px] flex-grow bg-zinc-100"></div>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                        Or
                      </span>
                      <div className="h-[1px] flex-grow bg-zinc-100"></div>
                    </div>
                    <SocialLogin />
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <button
                      onClick={() => setIsEmailView(false)}
                      className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                    >
                      <span className="transition-transform group-hover:-translate-x-1">
                        ←
                      </span>{" "}
                      Back
                    </button>
                    <RegisterForm
                      formData={formData}
                      loading={loading}
                      statusMsg={statusMsg}
                      handleChange={handleChange}
                      executeRegistration={executeRegistration}
                      handleVerifyAndRedirect={handleVerifyAndRedirect}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <footer className=" border-zinc-50 text-center md:text-left">
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest m-0">
              Member?
              <a
                href="/account/login"
                className="ml-2 font-bold text-black no-underline! link-underline"
              >
                Login here
              </a>
            </p>
          </footer>
        </div>

        {/* Right Section: Visual Branding */}
        <div className="relative flex w-full md:w-1/2 flex-col items-center justify-center bg-zinc-950 p-16 text-white order-last">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex gap-1 mb-12">
              <div className="h-20 w-20 border-2 border-white flex items-center justify-center text-3xl font-black">
                MF
              </div>
              <div className="h-20 w-20 bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-center">
                <span className="text-[8px] uppercase tracking-[0.3em] leading-tight">
                  Est.
                  <br />
                  2006
                </span>
              </div>
            </div>

            <h3 className="text-xl font-light uppercase tracking-[0.5em] mb-4">
              Aesthetics
            </h3>
            <p className="max-w-[280px] text-center text-[10px] font-medium leading-loose tracking-[0.2em] uppercase opacity-40">
              Global Style. Deshi Vibe.
            </p>

            <div className="mt-20 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-zinc-950 bg-zinc-800"
                  />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold m-0">
                30k+ Joined
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
