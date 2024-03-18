"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReportsHeader from "./components/header";
import LoadingSpinner from "../loading/Loading";
import ReportsDashboard from "./components/dashboard";

function ReportsContainer() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [selectedTab, setSelectedTab] = useState();
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
        project.memberEmails.includes(userEmail),
      );

      setProjects(userProjects);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.message);
      setLoading(false);
    }
  }

  function totalHoursByCondition(condition, type) {}

  useEffect(() => {
    fetchProjects();
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
          <div>
            <ReportsHeader
              date={date}
              setDate={setDate}
              mode={mode}
              setMode={setMode}
            />
          </div>
          <div>
            <ReportsDashboard
              timesheets={timesheets}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              date={date}
              mode={mode}
            />
          </div>
          <div
            style={{
              border: "1px solid",
              marginBottom: "20px",
            }}
          >
            <p>{date}</p>
            <p>{mode}</p>
            <p>{selectedTab}</p>
          </div>
          <div
            style={{
              border: "1px solid",
              display: "flex",
              marginBottom: "20px",
            }}
          >
            <p>{JSON.stringify(projects)}</p>
          </div>
          <div
            style={{
              border: "1px solid",
              display: "flex",
              marginBottom: "20px",
            }}
          >
            <p>{JSON.stringify(timesheets)}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsContainer;
