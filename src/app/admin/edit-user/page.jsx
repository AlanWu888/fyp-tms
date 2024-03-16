import EditUser from "@/app/(components)/admin/EditUser/EditUser";
import GoBack from "@/app/(components)/buttons/GoBack";
import NavAdmin from "@/app/(components)/navigation/NavAdmin";
import Link from "next/link";
import React from "react";

const CreateUser = () => {
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
        <Link
          href={{
            pathname: `/admin`,
          }}
        >
          <GoBack />
        </Link>
        <div
          className="edit-user-header"
          style={{
            paddingBottom: "10px",
            borderBottom: "1px solid black",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "22px", fontWeight: "bold"}}>Edit User</div>
          <p style={{marginBottom: "20px"}}>Edit user information here</p>
        </div>
        <EditUser />
      </div>
    </div>
  );
};

export default CreateUser;
