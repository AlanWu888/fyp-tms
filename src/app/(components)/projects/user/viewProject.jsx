"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import GoBack from "../../buttons/GoBack";
import { useSession } from "next-auth/react";
import LineChart from "../components/lineChart";
import "./viewProject.css";
import LoadingSpinner from "../../loading/Loading";
import UserTimeBreakdownComponent from "./components/timeBreakdown";

const UserViewProjectComponent = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState([]);
  const [validProject, setValidProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoursByTaskType, setHoursByTaskType] = useState();
  const [mode, setMode] = useState("day");
  const [totalHoursPerDay, setTotalHoursPerDay] = useState({});
  const [totalHoursPerWeek, setTotalHoursPerWeek] = useState({});
  const [totalHoursPerMonth, setTotalHoursPerMonth] = useState({});

  async function fetchTimesheetData() {
    try {
      const response = await fetch(
        `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();

      const projectTimesheets = data.timesheets.filter((timesheet) => {
        return (
          timesheet.clientName === clientName &&
          timesheet.projectName === projectName
        );
      });
      setTimesheets(projectTimesheets);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  }

  async function fetchProjectData() {
    try {
      const response = await fetch(
        `/api/Projects?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const userProjects = data.projects.filter((project) =>
        project.memberEmails.includes(userEmail),
      );
      setProjects(userProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  function totalTime() {
    let total = 0;
    for (let timesheet of timesheets) {
      total += timesheet.time;
    }
    return total;
  }

  function calculateTimeByProperty(property, setResultFunction) {
    let totalTime = {};

    timesheets.forEach((task) => {
      const { [property]: key, time } = task;

      if (totalTime.hasOwnProperty(key)) {
        totalTime[key] += time;
      } else {
        totalTime[key] = time;
      }
    });
    setResultFunction(totalTime);
  }

  function calculateTotalHours() {
    const totalHoursPerDay = {};
    timesheets.forEach((task) => {
      const date = new Date(task.date).toISOString().split("T")[0];
      const hours = task.time;
      if (!totalHoursPerDay[date]) {
        totalHoursPerDay[date] = 0;
      }
      totalHoursPerDay[date] += hours;
    });

    const totalHoursPerWeek = {};
    for (const date in totalHoursPerDay) {
      const weekStartDate = new Date(date);
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      const weekKey = `${weekStartDate.toISOString().split("T")[0]} - ${weekEndDate.toISOString().split("T")[0]}`;

      if (!totalHoursPerWeek[weekKey]) {
        totalHoursPerWeek[weekKey] = 0;
      }
      totalHoursPerWeek[weekKey] += totalHoursPerDay[date];
    }

    const totalHoursPerMonth = {};
    for (const date in totalHoursPerDay) {
      const monthYear = date.substring(0, 7);
      if (!totalHoursPerMonth[monthYear]) {
        totalHoursPerMonth[monthYear] = 0;
      }
      totalHoursPerMonth[monthYear] += totalHoursPerDay[date];
    }

    return {
      totalHoursPerDay,
      totalHoursPerWeek,
      totalHoursPerMonth,
    };
  }

  function calculateTimeDifference(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);

    let differenceMs = Math.abs(target - today);
    const isPast = target < today;

    const months = Math.floor(differenceMs / (1000 * 60 * 60 * 24 * 30.44));
    differenceMs -= months * (1000 * 60 * 60 * 24 * 30.44);

    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    differenceMs -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(differenceMs / (1000 * 60 * 60));
    differenceMs -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(differenceMs / (1000 * 60));

    let result = "";
    if (months > 0) {
      result += `${months}M `;
    }
    if (days > 0) {
      result += `${days}D `;
    }
    if (hours > 0) {
      result += `${hours}h `;
    }
    if (minutes > 0) {
      result += `${minutes}m`;
    }

    result = result.trim();

    const indicator = isPast ? "ago" : "from now";
    return result ? `${result} ${indicator}` : `Now`;
  }

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  function getDataForMode() {
    switch (mode) {
      case "day":
        return Object.values(totalHoursPerDay);
      case "week":
        return Object.values(totalHoursPerWeek);
      case "month":
        return Object.values(totalHoursPerMonth);
      default:
        return [];
    }
  }

  function getLabelsForMode() {
    switch (mode) {
      case "day":
        return Object.keys(totalHoursPerDay);
      case "week":
        return Object.keys(totalHoursPerWeek);
      case "month":
        return Object.keys(totalHoursPerMonth);
      default:
        return [];
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const clientNameParam = queryParams.get("clientName") || "";
    const projectNameParam = queryParams.get("projectName") || "";
    setClientName(clientNameParam);
    setProjectName(projectNameParam);
  }, []);

  useEffect(() => {
    const totalHours = calculateTotalHours();

    setTotalHoursPerDay(totalHours.totalHoursPerDay);
    setTotalHoursPerWeek(totalHours.totalHoursPerWeek);
    setTotalHoursPerMonth(totalHours.totalHoursPerMonth);

    calculateTimeByProperty("taskType", setHoursByTaskType);
  }, [timesheets]);

  useEffect(() => {
    fetchTimesheetData();
    fetchProjectData();
  }, [clientName, projectName]);

  useEffect(() => {
    const currentProject = projects.filter((project) => {
      return (
        project.clientname === clientName &&
        project.projectname === projectName &&
        project.memberEmails.includes(userEmail)
      );
    });

    setCurrentProject(currentProject);

    if (currentProject.length === 1) {
      setValidProject(true);
    }

    setLoading(false);
  }, [projects]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/user/project">
          <GoBack />
        </Link>
      </div>
      {validProject ? (
        <div>
          <div className="view-project--header">
            <p
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                marginTop: "30px",
              }}
            >
              {clientName} - {projectName}
            </p>
            <p
              style={{
                fontWeight: "normal",
                fontSize: "16px",
                marginBottom: "30px",
              }}
            >
              Project Deadline:{" "}
              {new Date(currentProject[0].deadline).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                },
              )}
            </p>
          </div>
          <div className="view-project--dashboard" style={{ display: "flex" }}>
            <div
              className="view-project--dashboard-left"
              style={{ width: "25%", marginRight: "10px" }}
            >
              <div
                style={{
                  border: "1px solid black",
                  height: "195px",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <p>Total Contribution</p>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {convertDecimalToTime(totalTime())}
                </p>
                <div
                  className="view-project--dashboard-contribution-breakdown"
                  style={{ marginTop: "10px" }}
                >
                  {Object.entries(hoursByTaskType).map(([taskType, time]) => (
                    <div
                      key={taskType}
                      className="view-project--dashboard-contribution-breakdown-row"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>{taskType}</p>
                      <p style={{ fontWeight: "bold" }}>
                        {convertDecimalToTime(time)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  border: "1px solid black",
                  height: "195px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <p>Deadline</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {new Date(currentProject[0].deadline).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <p>Time Left till Deadline</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {calculateTimeDifference(currentProject[0].deadline)}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="view-project--dashboard-right"
              style={{
                width: "75%",
                border: "1px solid black",
                height: "400px",
              }}
            >
              <div
                className="day-or-week"
                style={{ paddingTop: "10px", paddingRight: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <p style={{ marginRight: "10px" }}>{mode}</p>
                  <p style={{ marginRight: "10px" }}>View by:</p>
                  <button
                    onClick={() => setMode("day")}
                    className={
                      mode === "day"
                        ? "button-view button-left active"
                        : "button-view button-left"
                    }
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setMode("week")}
                    className={
                      mode === "week" ? "button-view active" : "button-view"
                    }
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setMode("month")}
                    className={
                      mode === "month"
                        ? "button-view button-right active"
                        : "button-view button-right"
                    }
                  >
                    Month
                  </button>
                </div>
              </div>
              <div style={{ height: "90%" }}>
                <LineChart
                  data={getDataForMode()}
                  labels={getLabelsForMode()}
                  mode={mode}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
          <div
            className="time-breakdown-component"
            style={{ marginTop: "30px" }}
          >
            <UserTimeBreakdownComponent
              timesheets={timesheets}
              currentProject={currentProject}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default UserViewProjectComponent;
