import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ManageContainer from "@/app/(components)/manage/ManageContainer";

const ManagerManage = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ManageContainer />
      </div>
    </div>
  );
};

export default ManagerManage;
