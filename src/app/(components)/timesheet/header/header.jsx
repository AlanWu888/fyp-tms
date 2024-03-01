"use client";

import React, { useState } from "react";

import DateCounter from "@/app/(components)/timesheet/header/dateCounter/date-counter";
import ViewSelector from "@/app/(components)/timesheet/header/dayWeek/day-week";

function TimesheetHeader() {
  const [mode, setMode] = useState("day");

  const updateMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="timesheet-header">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DateCounter mode={mode} />
        <ViewSelector mode={mode} updateMode={updateMode} />
      </div>
      <div>State from Child: {mode}</div>
    </div>
  );
}

export default TimesheetHeader;
