import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ProjectLogs from "@/app/(components)/projects/manager/projectLogs";

const ManagerLogs = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ProjectLogs />
      </div>
    </div>
  );
};

export default ManagerLogs;
