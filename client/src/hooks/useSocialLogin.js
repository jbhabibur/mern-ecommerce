import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/slices/authSlice";

export const useSocialLogin = () => {
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const loginWithProvider = async (provider, providerName) => {
    setLoadingProvider(providerName);
    setError(null);
    setToast({ show: false, message: "", type: "success" });

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/firebase-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Syncing with Redux immediately updates the UtilityHeader
      dispatch(
        setLogin({
          user: data.user,
          token: data.accessToken,
        }),
      );

      setUser(data.user);
      setToast({
        show: true,
        message: `Welcome back, ${data.user.firstName}!`,
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setToast({
        show: true,
        message: err.message || "Social login failed",
        type: "error",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const loginWithGoogle = () => loginWithProvider(googleProvider, "google");
  const loginWithGithub = () => loginWithProvider(githubProvider, "github");

  return {
    loginWithGoogle,
    loginWithGithub,
    user,
    loadingProvider,
    error,
    toast,
    setToast,
  };
};
