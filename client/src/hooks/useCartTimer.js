import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice"; // Adjust path as needed

export const useCartTimer = (durationMinutes = 40) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const dispatch = useDispatch();

  const handleExpiry = () => {
    // 1. Clear Redux State (This is the most important part)
    dispatch(cartActions.clearCart());

    // 2. Clear Storage
    localStorage.removeItem("cart");
    localStorage.removeItem("cart_expiry_timestamp");

    // 3. Optional: Reload or Redirect
    // window.location.reload();
  };

  useEffect(() => {
    const storageKey = "cart_expiry_timestamp";
    const now = Date.now();
    let remaining;

    const savedTimestamp = localStorage.getItem(storageKey);

    if (savedTimestamp) {
      const elapsedSeconds = Math.floor(
        (now - parseInt(savedTimestamp)) / 1000,
      );
      remaining = durationMinutes * 60 - elapsedSeconds;
    } else {
      localStorage.setItem(storageKey, now.toString());
      remaining = durationMinutes * 60;
    }

    if (remaining <= 0) {
      handleExpiry();
      return;
    }

    setTimeLeft(remaining);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [durationMinutes]);

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(),
    isExpired: timeLeft <= 0,
  };
};
