import React from "react";

export const ButtonSpinner = ({
  color = "white",
  text = "",
  fullPage = false,
}) => {
  // Logic for full page vs inline button loading
  const wrapperClasses = fullPage
    ? "fixed inset-0 flex flex-row items-center justify-center bg-black/20 backdrop-blur-sm z-50 gap-3"
    : "flex flex-row items-center justify-center gap-2";

  return (
    <div className={wrapperClasses}>
      <div
        className="h-[1.1em] w-[1.1em] animate-spin rounded-full border-[1.5px] shrink-0"
        style={{
          borderTopColor: color,
          borderColor: `${color}40`,
        }}
      />

      {text && (
        <span
          className="m-0 font-medium text-[0.95em] leading-none"
          style={{ color: color }}
        >
          {text}
        </span>
      )}
    </div>
  );
};
