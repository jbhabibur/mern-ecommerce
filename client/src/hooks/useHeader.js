import { useContext } from "react";
import { HeaderContext } from "../contexts/HeaderContext";

export const useHeader = () => {
  const context = useContext(HeaderContext);

  // Safety check to ensure the hook is used inside HeaderProvider
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  // Returns { headerHeight, setHeaderHeight } from HeaderContext.jsx
  return context;
};