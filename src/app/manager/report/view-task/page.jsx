import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TasksContainer from "@/app/(components)/reports/TasksContainer";

const ReportsTaskBreakdown = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <TasksContainer />
      </div>
    </div>
  );
};

export default ReportsTaskBreakdown;
