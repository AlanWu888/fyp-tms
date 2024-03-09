"use client";

import React, { useState } from "react";
import Button from "../../buttons/Button";
import Link from "next/link";
import { COLOURS } from "@/app/constants";
import GoBack from "../../buttons/GoBack";
import CalendarPicker from "../../buttons/CalendarPicker";

function NewProject() {
  const [deadline, setDeadline] = useState("");

  const handleDeadlineChange = (date) => {
    // Function to handle deadline change
    setDeadline(date.toISOString().split("T")[0]);
  };

  return (
    <div>
      <Link href="/manager/project">
        <GoBack />
      </Link>
      <div
        className="header"
        style={{
          borderBottom: "1px solid black",
          marginTop: "30px",
          fontWeight: "bold",
          fontSize: "28px",
          paddingBottom: "15px",
        }}
      >
        New Project
      </div>
      <div
        className="project-details"
        style={{
          width: "75%",
          border: "1px solid black",
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "22px",
        }}
      >
        <div
          className="project-detail--input"
          style={{ display: "flex", alignItems: "center" }}
        >
          <label
            style={{
              fontWeight: "bold",
              marginRight: "30px",
              paddingTop: "20px",
              paddingBottom: "20px",
              width: "170px",
            }}
          >
            Client Name
          </label>
          <input
            style={{
              flex: 1,
              fontSize: "16px",
              border: "1px solid black",
              borderRadius: "10px",
              height: "40px",
              paddingLeft: "10px",
              paddingRight: "10px",
              fontWeight: "normal",
            }}
          />
        </div>
        <div
          className="project-detail--input"
          style={{ display: "flex", alignItems: "center" }}
        >
          <label
            style={{
              fontWeight: "bold",
              marginRight: "30px",
              paddingTop: "20px",
              paddingBottom: "20px",
              width: "170px",
              border: "1px solid black",
            }}
          >
            Project Name
          </label>
          <input
            style={{
              flex: 1,
              fontSize: "16px",
              border: "1px solid black",
              borderRadius: "10px",
              height: "40px",
              paddingLeft: "10px",
              paddingRight: "10px",
              fontWeight: "normal",
            }}
          />
        </div>
        <div
          className="project-detail--input-grp"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            className="project-detail--input-grp-item"
            style={{ display: "flex", alignItems: "center" }}
          >
            <label
              style={{
                fontWeight: "bold",
                marginRight: "30px",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "170px",
              }}
            >
              Deadline
            </label>
            <CalendarPicker onDateChange={handleDeadlineChange} />
            <input
              value={deadline}
              style={{
                flex: 1,
                fontSize: "16px",
                border: "1px solid black",
                borderRadius: "10px",
                height: "40px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontWeight: "normal",
                marginLeft: "10px",
              }}
            />
          </div>
          <div className="project-detail--input-grp-item">
            <label
              style={{
                fontWeight: "bold",
                marginRight: "30px",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "170px",
                marginLeft: "80px",
              }}
            >
              Budget
            </label>
            £
            <input
              style={{
                flex: 1,
                fontSize: "16px",
                border: "1px solid black",
                borderRadius: "10px",
                height: "40px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontWeight: "normal",
                marginLeft: "10px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewProject;
