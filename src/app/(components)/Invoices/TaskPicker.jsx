"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLOURS } from "@/app/constants";
import Link from "next/link";
import Button from "../buttons/Button";
import GoBack from "../buttons/GoBack";
import { createUniqueTasksFromTimesheets } from "./utils";
import LoadingSpinner from "../loading/Loading";
import Checkbox from "../checkboxes/checkbox";

function TaskPicker() {
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [tasks, setTasks] = useState({});
  const [tasksArray, setTasksArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const client = queryParams.get("clientname") || "";
    const project = queryParams.get("projectname") || "";
    setClient(client);
    setProject(project);
  }, []);

  useEffect(() => {
    fetchData();
  }, [client, project]);

  useEffect(() => {
    if (tasks && Object.keys(tasks).length > 0) {
      const taskDescriptionsWithTypes = Object.entries(
        tasks.taskDescriptions,
      ).map(([description, { taskTypes }]) => {
        const types = taskTypes.map(({ type }) => type);
        return `${description} (${types.join(", ")})`;
      });
      setTasksArray(taskDescriptionsWithTypes);
    } else {
      setTasksArray([]);
    }
    setLoading(false);
  }, [tasks]);

  const handleCheckboxChange = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks((prevSelectedTasks) =>
        prevSelectedTasks.filter((selectedTask) => selectedTask !== task),
      );
    } else {
      setSelectedTasks((prevSelectedTasks) => [...prevSelectedTasks, task]);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/manager/invoice">
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
      {loading ? (
        <LoadingSpinner />
      ) : tasksArray.length === 0 ? (
        <div>No tasks found</div>
      ) : (
        <div style={{ marginBottom: "120px" }}>
          <div
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
            Task Name
          </div>
          {tasksArray.map((task) => (
            <div
              key={task}
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingLeft: "20px",
                paddingRight: "20px",
                fontSize: "20px",
                borderBottom: "1px solid black",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{task}</div>
              <div>
                <Checkbox
                  isChecked={selectedTasks.includes(task)}
                  onChange={() => handleCheckboxChange(task)}
                />
              </div>
            </div>
          ))}
          <div style={{ border: "1px solid blue", marginTop: "30px" }}>
            {JSON.stringify(selectedTasks)}
          </div>
          <div style={{ border: "1px solid blue", marginTop: "30px" }}>
            {JSON.stringify(tasks)}
          </div>
          <Link
            href={{
              pathname: "/manager/invoice/generate",
              query: {
                clientname: client,
                projectname: project,
                selectedTasks: JSON.stringify(selectedTasks),
              },
            }}
          >
            <Button
              label="next"
              onClick={console.log(JSON.stringify(selectedTasks))}
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default TaskPicker;
