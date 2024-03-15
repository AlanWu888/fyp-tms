import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ViewProjectComponent from "@/app/(components)/projects/manager/viewProject";

const ViewProjectPage = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ViewProjectComponent />
      </div>
    </div>
  );
};

export default ViewProjectPage;
