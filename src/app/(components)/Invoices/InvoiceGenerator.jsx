"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import GoBack from "../buttons/GoBack";
import { createUniqueTasksFromTimesheets } from "./utils";

function InvoiceGenerator() {
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const client = queryParams.get("clientname") || "";
    const project = queryParams.get("projectname") || "";
    const selectedTasks = queryParams.get("selectedTasks") || "";
    setClient(client);
    setProject(project);
    setSelectedTasks(selectedTasks);
  }, []);

  useEffect(() => {
    fetchData();
  }, [client, project]);

  useEffect(() => {
    console.log(selectedTasks);
  }, [selectedTasks]);

  const filterTimesheets = (timesheets, client, project) => {
    return timesheets.filter(
      (timesheet) =>
        timesheet.clientName === client && timesheet.projectName === project,
    );
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const responseData = await response.json();
      const timesheetData = responseData.timesheets;

      const filteredTimesheets = filterTimesheets(
        timesheetData,
        client,
        project,
      );
      const uniqueTasks = createUniqueTasksFromTimesheets(filteredTimesheets);

      setTasks(uniqueTasks);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href={{
            pathname: `/manager/invoice/choose-tasks`,
            query: {
              clientname: client,
              projectname: project,
            },
          }}
        >
          <GoBack />
        </Link>
      </div>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          Generate invoices for Clients
        </p>
        <p>{`You are viewing ${client} - ${project}`}</p>
        <p>Check the tasks you want to include on the Invoice</p>
      </div>
      <h1>Invoice Generator</h1>
      <h2>Selected Tasks:</h2>
      <p>{JSON.stringify(selectedTasks)}</p>
      <p style={{ marginTop: "60px" }}>{JSON.stringify(tasks)}</p>
      {/* {selectedTasks.length > 0 ? (
        <ul>
          {selectedTasks.map((task) => (
            <li key={task} style={{ marginBottom: "10px" }}>
              <strong>{task.split("(")[0].trim()}</strong>
              <br />
              <span>Task Types: {task.split("(")[1].split(")")[0]}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks selected.</p>
      )} */}
    </div>
  );
}

export default InvoiceGenerator;
