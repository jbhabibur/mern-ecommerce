import { ResetForm } from "../features/auth/components/forms/ResetForm";

export const ResetPasswordPage = () => {
  return (
    /**
     * Parent container:
     * - min-h-screen: Ensures the background covers the full height.
     * - flex justify-center: Centers the form horizontally.
     * - pt-20 sm:pt-32: Positions the form towards the top (not dead center).
     */
    <div className="min-h-screen flex justify-center bg-white px-6 pt-20 sm:pt-32">
      {/* Width wrapper: 
        The ResetForm itself has max-w-[450px], 
        so this container ensures it stays centered within the flexbox.
      */}
      <div className="w-full max-w-[450px]">
        <ResetForm />
      </div>
    </div>
  );
};
