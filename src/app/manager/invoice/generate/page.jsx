import React from "react";
import NavManager from "@/app/(components)/navigation/NavManager";
import InvoiceGenerator from "@/app/(components)/Invoices/InvoiceGenerator";

const ManagerInvoice = () => {
  return (
    <div>
      <NavManager />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <InvoiceGenerator />
      </div>
    </div>
  );
};

export default ManagerInvoice;
