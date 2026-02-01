import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLogin } from "../features/auth/hooks/useLogin";
import { useRegister } from "../features/auth/hooks/useRegister";

// Components
import { AuthLayout } from "../features/auth/components/AuthLayout";
import { LoginForm } from "../features/auth/components/forms/LoginFrom";
import { RegisterForm } from "../features/auth/components/forms/RegisterForm";
import { RecoverForm } from "../features/auth/components/forms/RecoverForm";

export const LoginPage = () => {
  const { hash } = useLocation();
  const isRecovering = hash === "#recover";

  // Login Hook
  const {
    formData: loginForm,
    loading: loginLoading,
    statusMsg: loginStatus,
    handleChange: handleLoginChange,
    executeLogin: handleLoginSubmit,
  } = useLogin();

  // Register Hook
  const {
    formData: registerForm,
    loading: registerLoading,
    statusMsg: registerStatus,
    handleChange: handleRegisterChange,
    executeRegistration: handleRegisterSubmit,
  } = useRegister();

  // Global Status Logic
  const currentStatus =
    !loginStatus.field && loginStatus.text
      ? loginStatus
      : !registerStatus.field && registerStatus.text
        ? registerStatus
        : null;

  // Auto-Focus Logic
  useEffect(() => {
    const errorField = loginStatus.field || registerStatus.field;
    if (errorField) {
      const element = document.getElementsByName(errorField)[0];
      if (element) element.focus();
    }
  }, [loginStatus.field, registerStatus.field]);

  return (
    <AuthLayout
      title="Sign In"
      status={currentStatus}
      breadcrumb={
        <p className="text-gray-400! text-sm">
          <a
            className="no-underline! text-gray-400! hover:text-black transition duration-500"
            href="/"
          >
            Home
          </a>
          {" > "} Account
        </p>
      }
    >
      {/* LEFT COLUMN: Login or Recover */}
      <div className="w-full max-w-md">
        {isRecovering ? (
          <RecoverForm onCancel={() => (window.location.hash = "")} />
        ) : (
          <LoginForm
            formData={loginForm}
            loading={loginLoading}
            statusMsg={loginStatus}
            handleChange={handleLoginChange}
            executeLogin={handleLoginSubmit}
            onShowRecover={() => (window.location.hash = "recover")}
          />
        )}
      </div>

      {/* RIGHT COLUMN: Register */}
      <div className="w-full max-w-md">
        <RegisterForm
          formData={registerForm}
          loading={registerLoading}
          statusMsg={registerStatus}
          handleChange={handleRegisterChange}
          executeRegistration={handleRegisterSubmit}
        />
      </div>
    </AuthLayout>
  );
};
