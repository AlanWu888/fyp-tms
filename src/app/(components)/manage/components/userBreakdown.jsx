import { COLOURS } from "@/app/constants";
import React, { useEffect, useState } from "react";

function UserBreakdown({ filteredData, date, mode }) {
  const [totalTime, setTotalTime] = useState({});

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  useEffect(() => {
    const calculateTotalTime = () => {
      const totalTimeMap = {};
      filteredData.forEach((item) => {
        const key = `${item.clientName}-${item.projectName}-${item.taskDescription}-${item.taskType}`;
        if (!totalTimeMap[key]) {
          totalTimeMap[key] = 0;
        }
        totalTimeMap[key] += item.time;
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
    };

    calculateTotalTime();
  }, [filteredData, date, mode]);

  return (
    <div className="hours-time-breakdown">
      <div
        className="hours-time-breakdown__header"
        style={{
          display: "flex",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "10px",
          paddingBottom: "10px",
          background: COLOURS.GREY,
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
        }}
      >
        <div style={{ width: "700px", border: "1px solid green" }}>Project</div>
        <div>Time</div>
      </div>
      <div className="hours-time-breakdown__rows">
        {Object.keys(totalTime).map((key) => (
          <div
            key={key}
            style={{
              display: "flex",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid black",
            }}
          >
            <div style={{ width: "700px", border: "1px solid green" }}>
              <p>{`${key.split("-")[0]} - ${key.split("-")[1]}`}</p>
              <p>{`${key.split("-")[2]} (${key.split("-")[3]})`}</p>
            </div>
            {/* <p>{`Client Name: ${key.split("-")[0]}`}</p>
          <p>{`Project Name: ${key.split("-")[1]}`}</p>
          <p>{`Task Description: ${key.split("-")[2]}`}</p>
          <p>{`Task Type: ${key.split("-")[3]}`}</p> */}
            <p>{`${convertDecimalToTime(totalTime[key])}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserBreakdown;
