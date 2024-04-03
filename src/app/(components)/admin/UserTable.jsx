"use client";

import React, { useState } from "react";
import { COLOURS } from "@/app/constants";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Button from "../buttons/Button";
import Link from "next/link";
import ConfirmDeleteUserModal from "./userForms/ConfirmDeleteUserModal";

const UserTable = ({ userData, role, header, fetchData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleTable = () => {
    setIsOpen(!isOpen);
  };

  async function deleteUser(userID) {
    try {
      const response = await fetch(
        `/api/Users?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userID,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemove = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteUser(selectedUser._id);
    setDeleteModalOpen(false);
  };

  return (
    <div className={`user-table--${role}`} style={{ marginBottom: "20px" }}>
      <div
        className="user-table-header"
        style={{
          borderTop: "1px solid",
          borderBottom: "1px solid",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundColor: COLOURS.GREY,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{ marginRight: "15px", cursor: "pointer" }}
          onClick={toggleTable}
        >
          {isOpen ? <FaAngleDown /> : <FaAngleUp />}
        </div>
        <div style={{ fontWeight: "bold" }}>{header}</div>
      </div>
      {isOpen && (
        <div>
          {userData.map((user, index) => (
            <div
              key={index}
              className="user-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "20px",
                paddingRight: "20px",
                alignItems: "center",
              }}
            >
              <div className="user-row-left" style={{ display: "flex" }}>
                <div style={{ width: "450px" }}>
                  <p>
                    {user.firstname} {user.lastname}
                  </p>
                </div>
                <div>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="user-row-right" style={{ display: "flex" }}>
                <Link
                  href={{
                    pathname: `/admin/edit-user`,
                    query: {
                      user: user._id,
                    },
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <Button
                      bgcolour={COLOURS.WHITE}
                      colour={COLOURS.BLACK}
                      label="Edit"
                    />
                  </div>
                </Link>
                <div>
                  <Button
                    bgcolour={COLOURS.WHITE}
                    colour={COLOURS.BLACK}
                    label="Remove"
                    onClick={() => handleRemove(user)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteModalOpen && (
        <ConfirmDeleteUserModal
          user={selectedUser}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserTable;
