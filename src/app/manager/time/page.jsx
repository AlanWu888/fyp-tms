import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TestComponent from "@/app/(components)/timesheet/test";
import TimesheetContainer from "@/app/(components)/timesheet/timesheet-container";

const ManagerTime = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <TimesheetContainer />
      </div>
    </div>
  );
};

export default ManagerTime;
