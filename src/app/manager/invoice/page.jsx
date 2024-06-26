import React from "react";
import InvoicesContainer from "@/app/(components)/Invoices/InvoicesContainer";
import NavManager from "@/app/(components)/navigation/NavManager";

const ManagerInvoice = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <InvoicesContainer />
      </div>
    </div>
  );
};

export default ManagerInvoice;
