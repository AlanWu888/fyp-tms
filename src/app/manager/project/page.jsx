import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ProjectsComponent from "@/app/(components)/projects/manager/json";

const ManagerProjects = () => {
  return (
    <div>
      <NavManager />
      <div>ManagerProjects</div>
      <ProjectsComponent/>
    </div>
  );
};

export default ManagerProjects;
