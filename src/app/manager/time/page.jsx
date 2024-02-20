import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TestComponent from "@/app/(components)/timesheet/test";

const ManagerTime = () => {
  return (
    <div>
      <NavManager />
      <div>ManagerTime</div>
      <TestComponent/>
    </div>
  );
};

export default ManagerTime;
