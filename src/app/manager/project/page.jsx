import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ProjectsList from "@/app/(components)/projects/project-list";

const ManagerProjects = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ProjectsList />
      </div>
    </div>
  );
};

export default ManagerProjects;
