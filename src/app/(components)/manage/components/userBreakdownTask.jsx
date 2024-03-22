"use client";

import { COLOURS } from "@/app/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../../buttons/Button";

function UserBreakdownTask({ filteredData, userEmail }) {
  const [totalTime, setTotalTime] = useState(0);

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  function calculateTotalHours() {
    let totalTime = 0;
    filteredData.forEach((item) => {
      totalTime += item.time;
    });
    setTotalTime(totalTime);
  }

  useEffect(() => {
    calculateTotalHours();
  }, [filteredData]);

  return (
    <div className="hours-time-breakdown">
      <div
        className="hours-time-breakdown__header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "10px",
          paddingBottom: "10px",
          background: COLOURS.GREY,
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
        }}
      >
        <div>Project TASK</div>
        <div
          style={{
            width: "100px",
            display: "flex",
            justifyContent: "center",
            marginRight: "200px",
          }}
        >
          Time Spent
        </div>
      </div>
      <div className="hours-time-breakdown__rows">
        {filteredData.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid black",
            }}
          >
            <div>
              <p
                style={{ fontSize: "24px" }}
              >{`${item.clientName} - ${item.projectName}`}</p>
              <p>{`${item.taskDescription} (${item.taskType})`}</p>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  alignItems: "center",
                  display: "flex",
                  width: "100px",
                  justifyContent: "center",
                }}
              >{`${convertDecimalToTime(item.time)}`}</div>
              <div
                style={{
                  width: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Link
                  href={{
                    pathname: `/manager/manage/view-task`,
                    query: {
                      userEmail: userEmail,
                    },
                  }}
                >
                  <Button label="View entries" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div
          className="hours-time-breakdown__header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderTop: "2px solid black",
            borderBottom: "3px solid black",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          <div>Total</div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              width: "100px",
              justifyContent: "center",
            }}
          >
            {convertDecimalToTime(totalTime)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserBreakdownTask;
