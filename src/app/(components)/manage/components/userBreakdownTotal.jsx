"use client";
import { COLOURS } from "@/app/constants";
import Link from "next/link";
import Button from "../../buttons/Button";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function UserBreakdownTask({ filteredData, userEmail }) {
  const [totalTime, setTotalTime] = useState(0);
  const [groupedData, setGroupedData] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState([]);

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

  function groupDataByClientAndProject() {
    const grouped = {};
    filteredData.forEach((item) => {
      const key = `${item.clientName}-${item.projectName}`;
      if (!grouped[key]) {
        grouped[key] = {
          clientName: item.clientName,
          projectName: item.projectName,
          tasks: [],
          totalTime: 0,
        };
      }
      grouped[key].tasks.push(item);
      grouped[key].totalTime += item.time;
    });

    const sortedGroupedData = Object.fromEntries(
      Object.entries(grouped).sort(([keyA], [keyB]) => {
        const [clientNameA, projectNameA] = keyA.split("-");
        const [clientNameB, projectNameB] = keyB.split("-");

        if (clientNameA !== clientNameB) {
          return clientNameA.localeCompare(clientNameB);
        } else {
          return projectNameA.localeCompare(projectNameB);
        }
      }),
    );

    setGroupedData(sortedGroupedData);
  }

  function toggleGroupCollapsed(groupKey) {
    if (collapsedGroups.includes(groupKey)) {
      setCollapsedGroups(collapsedGroups.filter((key) => key !== groupKey));
    } else {
      setCollapsedGroups([...collapsedGroups, groupKey]);
    }
  }

  useEffect(() => {
    calculateTotalHours();
    groupDataByClientAndProject();
    console.log(groupedData);
  }, [filteredData]);

  return (
    <div className="hours-time-breakdown">
      <div
        className="hours-time-breakdown__header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "40px",
          paddingRight: "20px",
          paddingTop: "10px",
          paddingBottom: "10px",
          backgroundColor: COLOURS.GREY,
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
        }}
      >
        <p>Task Name</p>
        <div style={{ display: "flex" }}>
          <div
            style={{
              fontSize: "16px",
              alignItems: "center",
              display: "flex",
              width: "100px",
              justifyContent: "center",
              marginRight: "200px",
            }}
          >
            Time spent
          </div>
        </div>
      </div>
      {filteredData.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            borderBottom: "1px solid black",
          }}
        >
          No entries found
        </div>
      ) : (
        <div>
          <div className="hours-time-breakdown__rows">
            {Object.entries(groupedData).map(([groupKey, group], index) => (
              <div style={{ marginTop: "10px" }} key={`${index}`}>
                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      borderTop: "1px solid black",
                      borderBottom: "1px solid black",
                      backgroundColor: COLOURS.GREY,
                      cursor: "pointer",
                    }}
                    onClick={() => toggleGroupCollapsed(groupKey)}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ marginRight: "10px" }}>
                        {collapsedGroups.includes(groupKey) ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronUp />
                        )}
                      </div>
                      <p
                        style={{ fontSize: "16px" }}
                      >{`${group.clientName} - ${group.projectName}`}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          alignItems: "center",
                          display: "flex",
                          width: "100px",
                          justifyContent: "center",
                          marginRight: "200px",
                        }}
                      >
                        {convertDecimalToTime(group.totalTime)}
                      </div>
                    </div>
                  </div>
                  {!collapsedGroups.includes(groupKey) &&
                    Object.entries(
                      group.tasks.reduce((acc, task) => {
                        if (!acc[task.taskDescription]) {
                          acc[task.taskDescription] = {
                            taskDescription: task.taskDescription,
                            taskType: task.taskType,
                            userEmail: task.userEmail,
                            totalTime: 0,
                          };
                        }
                        acc[task.taskDescription].totalTime += task.time;
                        return acc;
                      }, {}),
                    ).map(([taskDescription, task], taskIndex) => (
                      <div
                        key={taskIndex}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingLeft: "40px",
                          paddingRight: "20px",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                          borderBottom: "1px solid black",
                          alignItems: "center",
                        }}
                      >
                        <p>{`${task.taskDescription} (${task.taskType})`}</p>
                        <div style={{ display: "flex" }}>
                          <div
                            style={{
                              fontSize: "16px",
                              alignItems: "center",
                              display: "flex",
                              width: "100px",
                              justifyContent: "center",
                            }}
                          >
                            {convertDecimalToTime(task.totalTime)}
                          </div>
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
                                  taskName: task.taskDescription,
                                },
                              }}
                            >
                              <Button label="View entries" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </React.Fragment>
              </div>
            ))}
          </div>
          <div
            className="hours-time-breakdown__footer"
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
              marginBottom: "120px",
            }}
          >
            <div>Total</div>
            <div
              style={{
                width: "100px",
                display: "flex",
                justifyContent: "center",
                marginRight: "200px",
              }}
            >
              {convertDecimalToTime(totalTime)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBreakdownTask;
