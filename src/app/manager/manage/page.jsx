import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ManageContainerMain from "@/app/(components)/manage/ManageContainerMain";

const ManageMain = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ManageContainerMain />
      </div>
    </div>
  );
};

export default ManageMain;
