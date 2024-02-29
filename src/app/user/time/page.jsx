import React from "react";
import NavUser from "@/app/(components)/navigation/NavUser";
import TimesheetComponent from "@/app/(components)/timesheet/json";

const UserTime = () => {
  return (
    <div>
      <NavUser />
      <div>UserTime</div>
      <TimesheetComponent />
    </div>
  );
};

export default UserTime;
