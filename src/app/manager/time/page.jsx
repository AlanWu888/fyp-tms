import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TestComponent from "@/app/(components)/timesheet/test";
import TimesheetComponent from "@/app/(components)/timesheet/json";

const ManagerTime = () => {
  return (
    <div>
      <NavManager />
      <div>ManagerTime</div>
      {/* <TestComponent /> */}
      <TimesheetComponent />
    </div>
  );
};

export default ManagerTime;
