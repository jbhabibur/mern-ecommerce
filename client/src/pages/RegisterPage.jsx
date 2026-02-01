import { useEffect } from "react";
import { useRegister } from "../features/auth/hooks/useRegister";
import { AuthLayout } from "../features/auth/components/AuthLayout";
import { RegisterForm } from "../features/auth/components/forms/RegisterForm";

export const RegisterPage = () => {
  const { formData, loading, statusMsg, handleChange, executeRegistration } =
    useRegister();

  // Auto-Focus Logic
  useEffect(() => {
    if (statusMsg.field) {
      const element = document.getElementsByName(statusMsg.field)[0];
      if (element) element.focus();
    }
  }, [statusMsg.field]);

  return (
    <AuthLayout
      title="Create Account"
      status={!statusMsg.field && statusMsg.text ? statusMsg : null}
      breadcrumb={
        <p className="text-[11px] text-gray-400!">
          <a
            href="/"
            className="text-gray-400! no-underline! hover:text-black! transition-colors"
          >
            Home
          </a>
          <span className="mx-2 text-gray-300">&gt;</span>
          <span className="text-gray-500!">Create Account</span>
        </p>
      }
    >
      {/* সেন্টারে রাখার জন্য একটি কন্টেইনার র‍্যাপার */}
      <div className="w-full max-w-[500px] mx-auto">
        <RegisterForm
          formData={formData}
          loading={loading}
          statusMsg={statusMsg}
          handleChange={handleChange}
          executeRegistration={executeRegistration}
        />
      </div>
    </AuthLayout>
  );
};
