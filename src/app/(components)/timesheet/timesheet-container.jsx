"use client";

import React, { useState, useEffect } from "react";

import TimesheetComponent from "@/app/(components)/timesheet/day-view";
import TimesheetHeader from "@/app/(components)/timesheet/header/header";

const TimesheetContainer = () => {
  const [date, setDate] = useState(new Date().toISOString()); // Initialize as ISO string

  const handleDateChange = (newDate) => {
    setDate(newDate.toISOString());
  };

  return (
    <div>
      <TimesheetHeader date={date} setNewDate={handleDateChange} />
      <TimesheetComponent date={date} setDate={setDate} />
    </div>
  );
};

export default TimesheetContainer;
