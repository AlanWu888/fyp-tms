import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import NewProject from "@/app/(components)/projects/manager/newProject";

const ManagerNewProject = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <NewProject />
      </div>
    </div>
  );
};

export default ManagerNewProject;
