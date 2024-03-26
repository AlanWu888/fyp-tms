"use client";

import React, { useState, useEffect } from "react";

import TimesheetHeader from "@/app/(components)/timesheet/header/header";
import WeekViewTimesheet from "./week-view";
import DayViewTimesheet from "@/app/(components)/timesheet/day-view";

const TimesheetContainer = () => {
  const [date, setDate] = useState(new Date().toISOString());
  const [mode, setMode] = useState("day");

  const handleDateChange = (newDate) => {
    setDate(newDate.toISOString());
  };

  return (
    <div>
      <TimesheetHeader
        date={date}
        setNewDate={handleDateChange}
        mode={mode}
        setMode={setMode}
      />
      {mode === "day" ? (
        <DayViewTimesheet date={date} setDate={setDate} />
      ) : (
        <WeekViewTimesheet date={date} />
      )}
    </div>
  );
};

export default TimesheetContainer;
