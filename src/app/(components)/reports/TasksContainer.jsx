"use client";

import React, { useEffect, useState } from "react";
import ReportsHeader from "./components/header";
import LoadingSpinner from "../loading/Loading";
import { COLOURS } from "@/app/constants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import GoBack from "../buttons/GoBack";
import Link from "next/link";

function TasksContainer() {
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);
  const [timesheets, setTimesheets] = useState([]);
  const [mode, setMode] = useState();
  const [date, setDate] = useState(new Date().toDateString());
  const [collapsedClients, setCollapsedClients] = useState([]);

  const [dateRange, setDateRange] = useState({});
  const [filteredData, setFilteredData] = useState([]);

  const isClientSide = typeof window !== "undefined";
  const queryParams = isClientSide
    ? new URLSearchParams(window.location.search)
    : null;
  const initialTaskName = queryParams?.get("taskName") || "";

  const sortedTimesheets = filteredData.sort((a, b) => {
    const clientNameComparison = a.clientName.localeCompare(b.clientName);
    if (clientNameComparison !== 0) {
      return clientNameComparison;
    }
    return a.projectName.localeCompare(b.projectName);
  });

  const timesheetsByClient = sortedTimesheets.reduce((acc, timesheet) => {
    if (!acc[timesheet.clientName]) {
      acc[timesheet.clientName] = [];
    }
    acc[timesheet.clientName].push(timesheet);
    return acc;
  }, {});

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const toggleClientCollapsed = (clientName) => {
    setCollapsedClients((prevCollapsedClients) =>
      prevCollapsedClients.includes(clientName)
        ? prevCollapsedClients.filter((name) => name !== clientName)
        : [...prevCollapsedClients, clientName],
    );
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

  useEffect(() => {
    getRanges();
  }, [date, mode]);

  useEffect(() => {
    filterDataByDateRange();
  }, [dateRange]);

  useEffect(() => {
    setTaskName(initialTaskName);
    setCollapsedClients([]);
  }, [initialTaskName]);

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch timesheets");
        }
        const data = await response.json();
        const userTimesheets = data.timesheets.filter(
          (timesheet) => timesheet.taskDescription === taskName,
        );
        setTimesheets(userTimesheets);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (taskName) {
      fetchTimesheets();
    }
  }, [taskName]);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Link href={{ pathname: `/manager/report` }}>
              <GoBack />
            </Link>
            <ReportsHeader
              date={date}
              setDate={setDate}
              mode={mode}
              setMode={setMode}
            />
          </div>
          <div
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
              marginBottom: "5px",
            }}
          >
            <div>Client/Project</div>
            <div style={{ display: "flex" }}>
              <p
                style={{
                  alignItems: "center",
                  display: "flex",
                  width: "100px",
                  justifyContent: "center",
                }}
              >
                Time Spent
              </p>
              <p
                style={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                  display: "flex",
                  width: "300px",
                }}
              >
                Date of entry
              </p>
            </div>
          </div>
          <div>
            {Object.entries(timesheetsByClient).length === 0 ? (
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
              Object.entries(timesheetsByClient).map(
                ([clientName, clientTimesheets], index) => (
                  <React.Fragment key={clientName}>
                    {index > 0 && <div style={{ marginBottom: "5px" }} />}
                    <div
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
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleClientCollapsed(clientName)}
                    >
                      <div>{clientName}</div>
                      <div>
                        {collapsedClients.includes(clientName) ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                    </div>
                    {!collapsedClients.includes(clientName) &&
                      clientTimesheets.map((timesheet) => (
                        <div
                          key={timesheet._id}
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
                            <p style={{ fontSize: "20px" }}>
                              {timesheet.projectName}
                            </p>
                            <p>({timesheet.taskType})</p>
                          </div>
                          <div style={{ display: "flex" }}>
                            <p
                              style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                alignItems: "center",
                                display: "flex",
                                width: "100px",
                                justifyContent: "center",
                              }}
                            >
                              {convertDecimalToTime(timesheet.time)}
                            </p>
                            <p
                              style={{
                                justifyContent: "flex-end",
                                fontSize: "20px",
                                fontWeight: "bold",
                                alignItems: "center",
                                display: "flex",
                                width: "300px",
                              }}
                            >
                              {new Date(timesheet.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </React.Fragment>
                ),
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TasksContainer;
