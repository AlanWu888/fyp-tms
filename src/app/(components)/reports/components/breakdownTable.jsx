"use client";

import { COLOURS } from "@/app/constants";
import React, { useEffect, useState } from "react";
import Button from "../../buttons/Button";
import Link from "next/link";

function ReportsBreakdown({ timesheets, selectedTab, date, mode }) {
  const [dateRange, setDateRange] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const getRanges = () => {
    const newDate = new Date(date);
    if (mode === "week") {
      const rangeStart = new Date(newDate);
      const dayOfWeek = newDate.getDay();
      const diff = newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      rangeStart.setDate(diff);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "fortnight") {
      const rangeStart = new Date(newDate);
      const dayOfMonth = newDate.getDate();
      const diff = dayOfMonth <= 15 ? 1 : 16;
      rangeStart.setDate(diff);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 13);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "month") {
      const rangeStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const rangeEnd = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0,
      );

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "year") {
      const year = newDate.getFullYear();
      const rangeStart = new Date(year, 0, 1);
      const rangeEnd = new Date(year, 11, 31);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "all") {
      const rangeStart = new Date("1900-01-01");
      const rangeEnd = new Date("2100-12-31");

      setDateRange({ rangeStart, rangeEnd });
    } else {
      const startOfDay = new Date(newDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(newDate);
      endOfDay.setHours(23, 59, 59, 999);
      setDateRange({ rangeStart: startOfDay, rangeEnd: endOfDay });
    }
  };

  const filterDataByDateRange = () => {
    const filteredTimesheets = [];

    for (const timesheet of timesheets) {
      const entryDate = new Date(timesheet.date);

      const adjustedRangeEnd = new Date(dateRange.rangeEnd);
      adjustedRangeEnd.setHours(23, 59, 59, 999);

      if (
        entryDate >= new Date(dateRange.rangeStart) &&
        entryDate <= adjustedRangeEnd
      ) {
        filteredTimesheets.push(timesheet);
      }
    }
    setFilteredData(filteredTimesheets);
  };

  function groupTimesheetEntries(data, groupBy) {
    const groupedData = {};

    for (const entry of data) {
      const {
        userEmail,
        taskDescription,
        clientName,
        projectName,
        time,
        taskType,
      } = entry;
      const groupKey = getGroupKey(
        groupBy,
        userEmail,
        taskDescription,
        clientName,
        projectName,
      );

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {
          billable: 0,
          "non-billable": 0,
          research: 0,
        };
      }

      switch (taskType) {
        case "Billable":
          groupedData[groupKey].billable += time;
          break;
        case "Non-Billable":
          groupedData[groupKey]["non-billable"] += time;
          break;
        case "Research":
          groupedData[groupKey].research += time;
          break;
        default:
          break;
      }
    }

    return Object.entries(groupedData).map(([key, value]) => ({
      [key]: value,
    }));
  }

  function getGroupKey(
    groupBy,
    userEmail,
    taskDescription,
    clientName,
    projectName,
  ) {
    switch (groupBy) {
      case "Team":
        return userEmail;
      case "Tasks":
        return taskDescription;
      case "Projects":
        return `${clientName} - ${projectName}`;
      default:
        throw new Error("Invalid groupBy parameter");
    }
  }

  const calculateTotalHours = (group) => {
    const {
      billable,
      "non-billable": nonBillable,
      research,
    } = Object.values(group)[0];
    return billable + nonBillable + research;
  };

  function getPathname() {
    if (selectedTab === "Projects") {
      return "/manager/project/view-project";
    } else if (selectedTab === "Team") {
      return "/manager/manage/view-user";
    } else if (selectedTab === "Tasks") {
      return "/manager/report/view-task";
    }
  }

  function getQuery(param) {
    if (selectedTab === "Projects") {
      const [client, project] = param.split(" - ");
      return {
        clientName: client,
        projectName: project,
      };
    } else if (selectedTab === "Team") {
      return { userEmail: param };
    } else if (selectedTab === "Tasks") {
      return { taskName: param };
    }
  }

  useEffect(() => {
    getRanges();
  }, [date, mode, selectedTab]);

  useEffect(() => {
    filterDataByDateRange();
  }, [dateRange]);

  useEffect(() => {
    setGroupedData(groupTimesheetEntries(filteredData, selectedTab));
  }, [filteredData]);

  return (
    <div className={`reports-breakdown-table--${selectedTab}`}>
      <div
        className="table-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "20px",
          paddingRight: "20px",
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
          background: COLOURS.GREY,
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "400px",
              marginRight: "20px",
            }}
          >
            Name
          </div>
          <div
            style={{
              width: "70px",
              marginRight: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Hours
          </div>
          <div
            style={{
              width: "350px",
              marginRight: "20px",
            }}
          >
            Time breakdown
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      </div>
      <div className={`reports-breakdown-table--${selectedTab}--rows`}>
        {groupedData.map((group, index) => {
          const totalHours = calculateTotalHours(group);
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingLeft: "20px",
                paddingRight: "20px",
                borderBottom: "1px solid black",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "400px",
                    marginRight: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {Object.keys(group)[0]}
                </div>
                <div
                  style={{
                    width: "70px",
                    marginRight: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {convertDecimalToTime(
                    Object.values(group)[0].billable +
                      Object.values(group)[0]["non-billable"] +
                      Object.values(group)[0].research,
                  )}
                </div>

                <div
                  style={{
                    width: "60px",
                    marginRight: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                  }}
                >
                  {`${((Object.values(group)[0].billable / totalHours) * 100).toFixed(1)} % `}
                </div>
                <div
                  style={{
                    width: "280px",
                    marginRight: "20px",
                    display: "flex",
                    borderRadius: "5px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    overflow: "hidden",
                    border: "1px solid black",
                  }}
                >
                  {Object.values(group)[0].billable > 0 && (
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "rgba(0, 108, 207, 1)",
                        width: `${(Object.values(group)[0].billable / totalHours) * 100}%`,
                      }}
                      title={`Billable (${((Object.values(group)[0].billable / totalHours) * 100).toFixed(1)}%)\nTime spent: ${convertDecimalToTime(Object.values(group)[0].billable)}`}
                    >
                      <span style={{ opacity: 0, position: "absolute" }}>
                        {convertDecimalToTime(Object.values(group)[0].billable)}
                      </span>
                    </div>
                  )}
                  {Object.values(group)[0]["non-billable"] > 0 && (
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "rgba(252, 181, 0, 1)",
                        width: `${(Object.values(group)[0]["non-billable"] / totalHours) * 100}%`,
                      }}
                      title={`Non-Billable (${((Object.values(group)[0]["non-billable"] / totalHours) * 100).toFixed(1)}%)\nTime spent: ${convertDecimalToTime(Object.values(group)[0]["non-billable"])}`}
                    >
                      <span style={{ opacity: 0, position: "absolute" }}>
                        {convertDecimalToTime(
                          Object.values(group)[0]["non-billable"],
                        )}
                      </span>
                    </div>
                  )}
                  {Object.values(group)[0].research > 0 && (
                    <div
                      style={{
                        position: "relative",
                        backgroundColor: "rgba(0, 252, 206, 1)",
                        width: `${(Object.values(group)[0].research / totalHours) * 100}%`,
                      }}
                      title={`Research (${((Object.values(group)[0].research / totalHours) * 100).toFixed(1)}%)\nTime spent: ${convertDecimalToTime(Object.values(group)[0].research)}`}
                    >
                      <span style={{ opacity: 0, position: "absolute" }}>
                        {convertDecimalToTime(Object.values(group)[0].research)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  alignItems: "center",
                }}
              >
                <Link
                  href={{
                    pathname: getPathname(),
                    query: getQuery(Object.keys(group)[0]),
                  }}
                >
                  <Button label="view" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <p>{}</p>
      </div>
    </div>
  );
}

export default ReportsBreakdown;
