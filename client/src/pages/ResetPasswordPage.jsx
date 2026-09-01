import { ResetForm } from "../features/auth/components/forms/ResetForm";

export const ResetPasswordPage = () => {
  return (
    // Parent container
    <div className="min-h-screen flex justify-center bg-white px-6 pt-20 sm:pt-32">
      <div className="w-full max-w-[450px]">
        <ResetForm />
      </div>
    </div>
  );
};
