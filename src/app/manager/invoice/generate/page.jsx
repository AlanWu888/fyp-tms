import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";

const ManagerInvoice = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        GENERATE
      </div>
    </div>
  );
};

export default ManagerInvoice;
