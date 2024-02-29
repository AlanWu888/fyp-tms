import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TestComponent from "@/app/(components)/timesheet/test";
import TimesheetComponent from "@/app/(components)/timesheet/json";
import DateCounter from "@/app/(components)/timesheet/dateCounter/date-counter";
import ViewSelector from "@/app/(components)/timesheet/dayWeek/day-week";

const ManagerTime = () => {
  return (
    <div>
      <NavManager />
      <DateCounter />
      <TimesheetComponent />
      <ViewSelector />
    </div>
  );
};

export default ManagerTime;
