import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import TaskPicker from "@/app/(components)/Invoices/TaskPicker";

const ManagerInvoice = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <TaskPicker />
      </div>
    </div>
  );
};

export default ManagerInvoice;
