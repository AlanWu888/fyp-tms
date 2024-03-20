"use client";

import React, { useEffect, useState } from "react";
import ReportsHeader from "./components/header";
import LoadingSpinner from "../loading/Loading";

function TasksContainer() {
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [mode, setMode] = useState();
  const [date, setDate] = useState(new Date().toDateString());

  async function fetchTimesheets() {
    try {
      setLoading(true);
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();

      const userTimesheets = data.timesheets.filter((timesheet) => {
        const matchingProject = projects.find((project) => {
          return (
            project.clientname === timesheet.clientName &&
            project.projectname === timesheet.projectName
          );
        });

        return matchingProject !== undefined;
      });
      setTimesheets(userTimesheets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await fetch("/api/Projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const userProjects = data.projects.filter((project) =>
        project.memberEmails.includes(taskName),
      );

      setProjects(userProjects);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();

    const queryParams = new URLSearchParams(window.location.search);
    const taskName = queryParams.get("taskName") || "";

    setTaskName(taskName);
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      fetchTimesheets();
    }
  }, [projects]);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <ReportsHeader
              date={date}
              setDate={setDate}
              mode={mode}
              setMode={setMode}
            />
          </div>
        </>
      )}
      <div>{taskName}</div>
      <div>{JSON.stringify(timesheets)}</div>
    </div>
  );
}

export default TasksContainer;
