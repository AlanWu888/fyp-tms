import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ManageContainerUser from "@/app/(components)/manage/ManageContainerUser";

const ManageUser = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ManageContainerUser />
      </div>
    </div>
  );
};

export default ManageUser;
