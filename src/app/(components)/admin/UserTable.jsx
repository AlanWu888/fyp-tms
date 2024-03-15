"use client";

import React, { useState } from "react";
import { COLOURS } from "@/app/constants";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Button from "../buttons/Button";

const UserTable = ({ userData, role, header }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleTable = () => {
    setIsOpen(!isOpen);
  };

  const handleClickButton = () => {};

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
                <div style={{ marginRight: "10px" }}>
                  <Button
                    bgcolour={COLOURS.WHITE}
                    colour={COLOURS.BLACK}
                    label="Edit"
                    onClick={handleClickButton}
                  />
                </div>
                <div>
                  <Button
                    bgcolour={COLOURS.WHITE}
                    colour={COLOURS.BLACK}
                    label="Remove"
                    onClick={handleClickButton}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTable;
