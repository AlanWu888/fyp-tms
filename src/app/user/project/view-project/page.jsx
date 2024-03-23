import React from "react";
import NavUser from "@/app/(components)/navigation/NavUser";
import UserViewProjectComponent from "@/app/(components)/projects/user/viewProject";

const ViewProjectPage = () => {
  return (
    <div>
      <NavUser />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <UserViewProjectComponent />
      </div>
    </div>
  );
};

export default ViewProjectPage;
