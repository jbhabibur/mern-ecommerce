import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { PrimaryButton } from "../../../components/atoms/PrimaryButton";

export const SocialLogin = () => {
  return (
    <div className="space-y-3!">
      {/* Google Login: Border is black, background starts white */}
      <PrimaryButton
        text="Join with Google"
        icon={FcGoogle}
        initialBg="#FFFFFF"
        initialText="#000000"
        onClick={() => console.log("Google login")}
      />

      {/* GitHub Login */}
      <PrimaryButton
        text="Join with GitHub"
        icon={FaGithub}
        initialBg="#FFFFFF"
        initialText="#000000"
        onClick={() => console.log("GitHub login")}
      />
    </div>
  );
};
