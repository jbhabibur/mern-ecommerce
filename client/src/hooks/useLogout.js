import { useDispatch } from "react-redux";
import { setLogout } from "../redux/slices/authSlice";

// import { clearCart } from "./slices/cartSlice"; // Recommended: add this to your cartSlice

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = () => {
    // 1. Reset Auth State (Clears user, token, and localStorage via your slice)
    dispatch(setLogout());

    // 3. Optional: Clear Cart
    // If you have a clearCart action, call it here:
    // dispatch(clearCart());

    // 4. Force a clean slate (Optional but safe)
    // window.location.href = '/login';
  };

  return logout;
};
