import { useState } from "react";

export const PrimaryButton = ({
  text = "Button",
  icon: Icon,
  onClick,
  type = "button",
  initialBg = "#000000",
  initialText = "#FFFFFF",
  disabled = false,
  loading = false,
  loadingComponent,
  className = "",
  responsive = true,
  showTextOnMobile = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: isHovered && !disabled ? initialText : initialBg,
    color: isHovered && !disabled ? initialBg : initialText,
    border: "1px solid black",
    padding: responsive ? "8px" : "14px 24px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontSize: "10px",
    transition: "all 0.2s ease-in-out",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: responsive ? "0px" : "50px",
    outline: "none",
    opacity: disabled || loading ? 0.7 : 1,
    minHeight: responsive ? "36px" : "42px",
  };

  const handlePress = (e) => {
    // If loading or disabled, prevent any action and stop reload
    if (loading || disabled) {
      e.preventDefault();
      return;
    }

    // If it's a submit button, we let the form's onSubmit handle it,
    // BUT we pass the event through if onClick is provided.
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={handlePress}
      disabled={disabled || loading} // It's safer to keep the button physically disabled
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`active:scale-95 transition-transform ${className}`}
    >
      {loading && loadingComponent ? (
        loadingComponent
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {/* Hidden on mobile, visible on small screens and up */}
          <span className={showTextOnMobile ? "inline" : "hidden sm:inline"}>
            {text}
          </span>
        </>
      )}
    </button>
  );
};
