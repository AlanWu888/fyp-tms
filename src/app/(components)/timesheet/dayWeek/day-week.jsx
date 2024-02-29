"use client";

import React, { useState } from "react";
import "./day-week.css";

const ViewSelector = () => {
  const [mode, setView] = useState("day");

  const setDay = () => {
    setView("day");
  };

  const setWeek = () => {
    setView("week");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>chosen: {mode}</div>
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
