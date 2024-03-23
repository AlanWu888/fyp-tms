import React from "react";
import NavUser from "@/app/(components)/navigation/NavUser";
import UsersProjectsList from "@/app/(components)/projects/user/project-list";

const UserProject = () => {
  return (
    <div>
      <NavUser />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <UsersProjectsList />
      </div>
    </div>
  );
};

export default UserProject;
