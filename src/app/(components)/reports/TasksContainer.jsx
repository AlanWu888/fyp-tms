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

  const isClientSide = typeof window !== "undefined";
  const queryParams = isClientSide
    ? new URLSearchParams(window.location.search)
    : null;
  const initialTaskName = queryParams?.get("taskName") || "";

  const sortedTimesheets = timesheets.sort((a, b) => {
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
            {Object.entries(timesheetsByClient).map(
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
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TasksContainer;
