import { useDispatch } from "react-redux";
import { setLogout } from "../redux/slices/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    // Reset Auth State (Clears user, token, and localStorage via your slice)
    dispatch(setLogout());
  };

  return logout;
};
