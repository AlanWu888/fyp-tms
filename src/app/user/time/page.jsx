import React from "react";
import NavUser from "@/app/(components)/navigation/NavUser";
import TimesheetContainer from "@/app/(components)/timesheet/timesheet-container";

const UserTime = () => {
  return (
    <div>
      <NavUser />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <TimesheetContainer />
      </div>
    </div>
  );
};

export default UserTime;
