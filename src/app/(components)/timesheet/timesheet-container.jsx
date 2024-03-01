"use client"

import React, { useState, useEffect } from "react";

import TimesheetComponent from "@/app/(components)/timesheet/day-view";
import TimesheetHeader from "@/app/(components)/timesheet/header/header";

const TimesheetContainer = () => {
  const [date, setDate] = useState(new Date().toISOString()); // Initialize as ISO string

  return (
    <div>
      <TimesheetHeader setDate={setDate} />
      <TimesheetComponent date={date} />
    </div>
  );
};

export default TimesheetContainer;