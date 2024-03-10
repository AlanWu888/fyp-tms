"use client";

import React from "react";
import "./day-week.css";

const ViewSelector = ({ mode, updateMode }) => {
  const setDay = () => {
    updateMode("day");
  };

  const setWeek = () => {
    updateMode("week");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={setDay}
          className={
            mode === "day"
              ? "button-view button-left active"
              : "button-view button-left"
          }
        >
          Day
        </button>
        <button
          onClick={setWeek}
          className={
            mode === "week"
              ? "button-view button-right active"
              : "button-view button-right"
          }
        >
          Week
        </button>
      </div>
    </div>
  );
};

export default ViewSelector;
