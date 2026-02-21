import { X } from "lucide-react";

import { useCustomCursor } from "../../hooks/useCustomCursor";

export const FloatingCloseButton = ({ isOpen }) => {
  const { mousePos } = useCustomCursor(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed pointer-events-none z-[110] hidden md:flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-xl transition-transform duration-100 ease-out"
      style={{
        left: mousePos.x,
        top: mousePos.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <X className="w-6 h-6 text-black" />
    </div>
  );
};
