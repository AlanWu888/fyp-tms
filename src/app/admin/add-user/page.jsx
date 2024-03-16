import AddUser from "@/app/(components)/admin/userForms/AddUser";
import GoBack from "@/app/(components)/buttons/GoBack";
import NavAdmin from "@/app/(components)/navigation/NavAdmin";
import Link from "next/link";
import React from "react";

const AddUserPage = () => {
  return (
    <div>
      <NavAdmin />
      <div
        style={{
          paddingLeft: "10%",
          paddingRight: "10%",
          paddingTop: "30px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <Link
            href={{
              pathname: `/admin`,
            }}
          >
            <GoBack />
          </Link>
        </div>

        <div
          className="edit-user-header"
          style={{
            paddingBottom: "10px",
            borderBottom: "1px solid black",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "bold" }}>Add a User</div>
          <p style={{ marginBottom: "20px" }}>Add user information here</p>
        </div>
        <div style={{ borderBottom: "1px solid black", paddingBottom: "20px" }}>
          <AddUser />
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
