import React from "react";

const Button = ({
  bgcolour,
  colour,
  onClick,
  label,
  disabled,
  disabledColour,
}) => {
  const buttonStyle = {
    backgroundColor: disabled ? disabledColour : bgcolour,
    color: colour,
    pointerEvents: disabled ? "none" : "auto",
  };

  return (
    <button
      style={buttonStyle}
      className={`px-4 py-2 rounded-md border border-black transition-all duration-300 ${disabled ? "" : "hover:underline"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
