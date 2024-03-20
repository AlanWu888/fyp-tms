"use client";

import React, { useState, useEffect } from "react";

function ManageContainerMain() {
  const [query, setQuery] = useState("");
  const [timesheets, setTimesheets] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  async function fetchTimesheets() {
    try {
      setLoading(true);
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();

      const userTimesheets = data.timesheets;
      setTimesheets(userTimesheets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  function grabData(parameter) {
    if (parameter === "userEmail") {
      // Grab unique userEmails
      const uniqueUserEmails = Array.from(
        new Set(timesheets.map((timesheet) => timesheet.userEmail)),
      );
      return uniqueUserEmails;
    } else if (parameter === "taskDescriptionAndType") {
      const uniqueCombinations = timesheets.reduce(
        (accumulator, currentTask) => {
          const { taskDescription, taskType } = currentTask;
          const key = `${taskDescription}-${taskType}`;
          accumulator[key] = currentTask;
          return accumulator;
        },
        {},
      );

      return Object.values(uniqueCombinations);
    } else {
      return [];
    }
  }

  useEffect(() => {
    fetchTimesheets();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", border: "1px solid red" }}>
        <div
          style={{
            marginRight: "30px",
            width: "600px",
            border: "1px solid blue",
          }}
        >
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            Manage Users and Tasks
          </p>
          <p>Look up user activity, or look at timesheet activity</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label
              style={{
                fontWeight: "bold",
                marginRight: "10px",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "80px",
              }}
            >
              Search by:
            </label>
            <input
              value={query}
              onChange={handleQueryChange}
              required={true}
              style={{
                fontSize: "18px",
                border: "1px solid black",
                borderRadius: "10px",
                height: "40px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontWeight: "normal",
                width: "400px",
              }}
              placeholder="Type an email or a timesheet name..."
            />
          </div>
        </div>
        <div style={{ border: "1px solid blue", width: "100%" }}>
          <div style={{ border: "1px solid red", marginBottom: "20px" }}>
            <p>Placeholder for component 1</p>
          </div>
          <div style={{ border: "1px solid red" }}>
            <p>Placeholder for component 2</p>
          </div>
        </div>
      </div>
      <div>{JSON.stringify(timesheets)}</div>
    </div>
  );
}

export default ManageContainerMain;
