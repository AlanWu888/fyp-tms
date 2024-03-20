import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ManageContainerTask from "@/app/(components)/manage/ManageContainerTask";

const ManageTask = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ManageContainerTask />
      </div>
    </div>
  );
};

export default ManageTask;
