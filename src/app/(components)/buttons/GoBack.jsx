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
        borderRadius: "5px",
        cursor: "pointer",
        textDecoration: "none",
        height: "42px",
        paddingLeft: "10px",
        paddingRight: "10px",
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
          style={{ height: "16px", marginRight: "20px" }}
          alt="Left Arrow"
        />
        <p
          style={{
            fontSize: "16px",
            textDecoration: "none",
            transition: "text-decoration 0.3s",
            borderBottom: "1px solid transparent",
          }}
          onMouseEnter={(e) =>
            (e.target.style.borderBottom = "1px solid black")
          }
          onMouseLeave={(e) =>
            (e.target.style.borderBottom = "1px solid transparent")
          }
        >
          Go Back
        </p>
      </div>
    </button>
  );
};

export default GoBack;
