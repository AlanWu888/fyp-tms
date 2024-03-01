import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TestComponent from "@/app/(components)/timesheet/test";
import TimesheetComponent from "@/app/(components)/timesheet/json";
import TimesheetHeader from "@/app/(components)/timesheet/header/header";

const ManagerTime = () => {
  return (
    <div>
      <NavManager />
      <TimesheetHeader />
      <TimesheetComponent />
    </div>
  );
};

export default ManagerTime;
