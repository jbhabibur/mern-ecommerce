import { ResetForm } from "../features/auth/components/forms/ResetForm";

export const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {/* Container to maintain the clean minimalist look */}
      <div className="w-full flex justify-center">
        <ResetForm />
      </div>
    </div>
  );
};
