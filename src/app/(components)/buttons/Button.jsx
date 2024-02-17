"use client";

import React from "react";

const Button = ({ bgcolour, colour, onClick, label }) => {
  return (
    <button
      style={{ backgroundColor: bgcolour, color: colour }}
      className="px-4 py-2 rounded-md border border-black hover:underline transition-all duration-300"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
