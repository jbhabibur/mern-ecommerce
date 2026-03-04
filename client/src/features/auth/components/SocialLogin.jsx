import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";
import { useSocialLogin } from "../../../hooks/useSocialLogin";
import { Toast } from "../../../components/atoms/Toast";
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { closeAuthDrawer } from "../../../redux/slices/authDrawerSlice";

export const SocialLogin = () => {
  const dispatch = useDispatch();
  const { loginWithGoogle, loginWithGithub, loadingProvider, toast, setToast } =
    useSocialLogin();

  /**
   * Handle the Toast closure.
   * If login was successful, we close the drawer.
   * Redux state update in the hook handles the Header UI change.
   */
  const handleToastClose = () => {
    if (toast.type === "success") {
      // Close the Auth Drawer immediately
      dispatch(closeAuthDrawer());

      // Optional: Reset toast state if the component stays mounted
      setToast({ ...toast, show: false });
    } else {
      // For errors, we simply hide the toast so the user can try again
      setToast({ ...toast, show: false });
    }
  };

  return (
    <div className="space-y-3!">
      {/* Toast Notification Layer */}
      <AnimatePresence>
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleToastClose}
          />
        )}
      </AnimatePresence>

      {/* Google Login Button */}
      <PrimaryButton
        text={
          loadingProvider === "google" ? "Processing..." : "Join with Google"
        }
        icon={FcGoogle}
        initialBg="#FFFFFF"
        initialText="#000000"
        onClick={loginWithGoogle}
        disabled={!!loadingProvider}
      />

      {/* GitHub Login Button */}
      <PrimaryButton
        text={
          loadingProvider === "github" ? "Processing..." : "Join with GitHub"
        }
        icon={FaGithub}
        initialBg="#FFFFFF"
        initialText="#000000"
        onClick={loginWithGithub}
        disabled={!!loadingProvider}
      />
    </div>
  );
};
