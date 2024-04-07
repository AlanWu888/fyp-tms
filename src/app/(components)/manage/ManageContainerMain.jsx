"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { COLOURS } from "@/app/constants";
import Button from "../buttons/Button";
import LoadingSpinner from "../loading/Loading";

function ManageContainerMain() {
  const [query, setQuery] = useState("");
  const [timesheets, setTimesheets] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const handleQueryChange = (event) => {
    const searchQuery = event.target.value;
    setQuery(searchQuery);

    if (searchQuery.length >= 3) {
      const filteredUsers = grabData("userEmail").filter((email) =>
        email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setUsers(filteredUsers.sort());

      const filteredTasks = grabData("taskDescriptionAndType").filter((task) =>
        task.taskDescription.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setTasks(
        filteredTasks.sort((a, b) =>
          a.taskDescription.localeCompare(b.taskDescription),
        ),
      );
    } else {
      setUsers(grabData("userEmail").sort());
      setTasks(
        grabData("taskDescriptionAndType").sort((a, b) =>
          a.taskDescription.localeCompare(b.taskDescription),
        ),
      );
    }
  };

  async function fetchTimesheets() {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
      );
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

  useEffect(() => {
    setUsers(grabData("userEmail").sort());
    setTasks(
      grabData("taskDescriptionAndType").sort((a, b) =>
        a.taskDescription.localeCompare(b.taskDescription),
      ),
    );
  }, [timesheets]);

  return (
    <div>
      <div
        style={{
          borderBottom: `1px solid black`,
          padding: "10px",
          marginBottom: "20px",
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
              border: `1px solid ${COLOURS.GREY}`,
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
      {loading && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div
          style={{ textAlign: "center", color: "red", marginBottom: "20px" }}
        >
          {error}
        </div>
      )}
      {!loading && !error && (
        <div style={{ display: "flex", marginBottom: "150px" }}>
          <div
            style={{
              width: "40%",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                background: COLOURS.GREY,
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              Users
            </div>
            {users.map((user) => (
              <div
                key={user}
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  background: COLOURS.WHITE,
                  borderBottom: "1px solid black",
                  borderLeft: `1px solid ${COLOURS.GREY}`,
                  borderRight: `1px solid ${COLOURS.GREY}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {user}
                <Link
                  href={{
                    pathname: `/manager/manage/view-user`,
                    query: {
                      userEmail: user,
                    },
                  }}
                >
                  <Button label="view" />
                </Link>
              </div>
            ))}
            <div
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                marginTop: "20px",
                color: "#616161",
              }}
            >
              If the user you are looking for is not on the above list, it means
              they do not have any timesheet entries
            </div>
          </div>
          <div
            style={{
              width: "60%",
            }}
          >
            <div
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                background: COLOURS.GREY,
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              Tasks
            </div>
            {tasks.map((task) => (
              <div
                key={`${task.taskDescription}-${task.taskType}`}
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  background: COLOURS.WHITE,
                  borderBottom: "1px solid black",
                  borderLeft: `1px solid ${COLOURS.GREY}`,
                  borderRight: `1px solid ${COLOURS.GREY}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {task.taskDescription} ({task.taskType})
                <Link
                  href={{
                    pathname: `/manager/manage/view-task`,
                    query: {
                      taskName: task.taskDescription,
                      userEmail: "all",
                    },
                  }}
                >
                  <Button label="view" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageContainerMain;
