"use client";

import React from "react";
import { COLOURS } from "@/app/constants";

const GoBack = () => {
  return (
    <button
      style={{
        backgroundColor: COLOURS.GREY,
        color: COLOURS.BLACK,
        border: "1px solid black",
        borderRadius: "10px",
        cursor: "pointer",
        textDecoration: "none",
        padding: "10px",
      }}
      className="button-go-back"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={"/arrow-l.png"}
          style={{ height: "16px", marginRight: "10px" }}
          alt="Left Arrow"
        />
        <p
          style={{
            fontSize: "16px",
            textDecoration: "none",
            transition: "text-decoration 0.3s", // Transition for smooth effect
            borderBottom: "1px solid transparent", // Initially transparent underline
          }}
          onMouseEnter={(e) =>
            (e.target.style.borderBottom = "1px solid black")
          } // On hover, change underline color
          onMouseLeave={(e) =>
            (e.target.style.borderBottom = "1px solid transparent")
          } // On leaving hover, revert to transparent underline
        >
          Go Back
        </p>
      </div>
    </button>
  );
};

export default GoBack;
