import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import ReportsContainer from "@/app/(components)/reports/ReportsContainer";

const ManagerReports = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <ReportsContainer />
      </div>
    </div>
  );
};

export default ManagerReports;
