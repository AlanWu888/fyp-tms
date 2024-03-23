import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ManagersProjectsList from "@/app/(components)/projects/manager/project-list";

const ManagerProjects = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ManagersProjectsList />
      </div>
    </div>
  );
};

export default ManagerProjects;
