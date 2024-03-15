import React from "react";
import NavAdmin from "../(components)/navigation/NavAdmin";
import AdminComponent from "../(components)/admin/AdminComponent";

const AdminHome = () => {
  return (
    <div>
      <NavAdmin />
      <div
        style={{ paddingLeft: "10%", paddingRight: "10%", paddingTop: "30px" }}
      >
        <AdminComponent />
      </div>
    </div>
  );
};

export default AdminHome;
