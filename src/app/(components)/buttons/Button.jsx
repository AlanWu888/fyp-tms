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
    border: "1px solid black",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    height: "42px",
    paddingLeft: "10px",
    paddingRight: "10px",
  };

  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      <p
        style={{
          fontSize: "16px",
          textDecoration: "none",
          transition: "text-decoration 0.3s",
          borderBottom: "1px solid transparent",
        }}
        onMouseEnter={(e) => (e.target.style.borderBottom = "1px solid black")}
        onMouseLeave={(e) =>
          (e.target.style.borderBottom = "1px solid transparent")
        }
      >
        {label}
      </p>
    </button>
  );
};

export default Button;
