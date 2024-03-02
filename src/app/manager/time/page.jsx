import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TestComponent from "@/app/(components)/timesheet/test";
import TimesheetContainer from "@/app/(components)/timesheet/timesheet-container";

const ManagerTime = () => {
  return (
    <div>
      <NavManager />
      <TimesheetContainer />
    </div>
  );
};

export default ManagerTime;
