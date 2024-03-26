import { COLOURS } from "@/app/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../../buttons/Button";

function UserBreakdownTotal({ filteredData, date, mode, userEmail }) {
  const [totalTime, setTotalTime] = useState({});
  const [totalHours, setTotalHours] = useState(0);

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  useEffect(() => {
    const calculateTotalTime = () => {
      const totalTimeMap = {};
      let total = 0;

      filteredData.forEach((item) => {
        const key = `${item.clientName}@;!-\_#~${item.projectName}@;!-\_#~${item.taskDescription}@;!-\_#~${item.taskType}`;
        if (!totalTimeMap[key]) {
          totalTimeMap[key] = 0;
        }
        totalTimeMap[key] += item.time;
        total += item.time;
      });

      const orderedTotalTime = Object.keys(totalTimeMap).sort((a, b) => {
        const [clientNameA, projectNameA] = a.split("-").slice(0, 2);
        const [clientNameB, projectNameB] = b.split("-").slice(0, 2);

        if (clientNameA !== clientNameB) {
          return clientNameA.localeCompare(clientNameB);
        } else {
          return projectNameA.localeCompare(projectNameB);
        }
      });

      const sortedTotalTime = {};
      orderedTotalTime.forEach((key) => {
        sortedTotalTime[key] = totalTimeMap[key];
      });

      setTotalTime(sortedTotalTime);
      setTotalHours(total);
    };

    calculateTotalTime();
  }, [filteredData, date, mode]);

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
        <div>Project</div>
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
        {Object.keys(totalTime).map((key) => (
          <div
            key={key}
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
              >{`${key.split("@;!-_#~")[0]} - ${key.split("@;!-_#~")[1]}`}</p>
              <p>{`${key.split("@;!-_#~")[2]} (${key.split("@;!-_#~")[3]})`}</p>
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
              >{`${convertDecimalToTime(totalTime[key])}`}</div>
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
                      taskName: key.split("@;!-_#~")[2],
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
            {convertDecimalToTime(totalHours)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserBreakdownTotal;
